import { createHmac, timingSafeEqual } from "node:crypto";

import { after } from "next/server";

interface SentryIssue {
  title: string;
  culprit: string;
  shortId: string;
  substatus?: string;
  metadata: {
    type?: string;
    value?: string;
  };
  web_url?: string;
}

interface SentryEvent {
  title: string;
  environment?: string;
  tags: [string, string][];
  web_url?: string;
}

interface SentryWebhookPayload {
  action: string;
  data: {
    issue?: SentryIssue;
    event?: SentryEvent;
    triggered_rule?: string;
  };
  actor?: {
    name?: string;
  };
}

type AlertType = "created" | "regressed" | "triggered";

const ALERT_COLORS: Record<AlertType, number> = {
  created: 0xff0000,
  regressed: 0xff6f00,
  triggered: 0xff0000,
};

const DEFAULT_COLOR = 0x9e9e9e;

const EMBED_TITLE_MAX_LENGTH = 256;

function getAlertType({ action, data }: SentryWebhookPayload): AlertType | null {
  if (action === "created" || action === "triggered") {
    return action;
  }

  if (action === "unresolved" && data.issue?.substatus === "regressed") {
    return "regressed";
  }

  return null;
}

function isValidSignature(body: string, signature: string, secret: string) {
  const expected = Buffer.from(createHmac("sha256", secret).update(body, "utf8").digest("hex"));
  const received = Buffer.from(signature);

  return expected.length === received.length && timingSafeEqual(expected, received);
}

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

function createIssueEmbed(issue: SentryIssue, alertType: AlertType, actorName: string) {
  return {
    title: truncate(`[${alertType.toUpperCase()}] ${issue.title}`, EMBED_TITLE_MAX_LENGTH),
    description: issue.culprit || "No culprit information",
    color: ALERT_COLORS[alertType],
    ...(issue.web_url && { url: issue.web_url }),
    fields: [
      { name: "Issue", value: issue.shortId, inline: true },
      { name: "Type", value: issue.metadata.type ?? "Unknown", inline: true },
      { name: "Triggered by", value: actorName, inline: true },
      { name: "Message", value: truncate(issue.metadata.value ?? "N/A", 200), inline: false },
    ],
  };
}

function createEventEmbed(event: SentryEvent, triggeredRule: string) {
  const tags = Object.fromEntries(event.tags);

  return {
    title: truncate(`[ERROR] ${event.title}`, EMBED_TITLE_MAX_LENGTH),
    description: triggeredRule ? `Rule: ${triggeredRule}` : "Sentry Alert",
    color: ALERT_COLORS.triggered,
    ...(event.web_url && { url: event.web_url }),
    fields: [
      { name: "Environment", value: event.environment ?? "Unknown", inline: true },
      { name: "Browser", value: tags.browser ?? "-", inline: true },
      { name: "OS", value: tags.os ?? "-", inline: true },
    ],
  };
}

function createEmbed({ data, actor }: SentryWebhookPayload, alertType: AlertType) {
  if (data.issue) {
    return createIssueEmbed(data.issue, alertType, actor?.name ?? "System");
  }

  if (data.event) {
    return createEventEmbed(data.event, data.triggered_rule ?? "");
  }

  return {
    title: "[ALERT] Sentry Notification",
    description: "Unknown payload type",
    color: DEFAULT_COLOR,
  };
}

export async function POST(request: Request) {
  const secret = process.env.SENTRY_WEBHOOK_SECRET;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!secret || !webhookUrl) {
    return Response.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("sentry-hook-signature");

  if (!signature || !isValidSignature(body, signature, secret)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: SentryWebhookPayload;
  try {
    payload = JSON.parse(body) as SentryWebhookPayload;
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!payload?.data) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const alertType = getAlertType(payload);

  if (!alertType) {
    return Response.json({ skipped: true });
  }

  const embed = {
    ...createEmbed(payload, alertType),
    timestamp: new Date().toISOString(),
    footer: { text: "Sentry" },
  };

  // Sentry는 1초 안에 응답하지 않으면 타임아웃으로 처리하므로 응답한 뒤에 전송한다.
  after(async () => {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });

      if (!response.ok) {
        // eslint-disable-next-line no-console
        console.error(`Discord 웹훅 전송에 실패했습니다. (${response.status})`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Discord 웹훅 전송에 실패했습니다.", error);
    }
  });

  return Response.json({ ok: true });
}

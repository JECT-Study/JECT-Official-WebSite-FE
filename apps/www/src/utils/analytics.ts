import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

import type { JobFamily } from "@/apis/recruit/schemas";

const isAnalyticsEnvironment =
  process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";

const amplitudeApiKey = isAnalyticsEnvironment
  ? process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
  : undefined;

const UTM_STORAGE_KEY = "ject_utm_params";

const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

type UTMParams = Partial<Record<(typeof UTM_PARAMS)[number], string>>;

function extractUTMParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};

  UTM_PARAMS.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });

  return utmParams;
}

function getStoredUTMParams(): UTMParams {
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UTMParams) : {};
  } catch {
    return {};
  }
}

function trackUTMParams() {
  const utmParams = extractUTMParams();

  if (Object.keys(utmParams).length === 0) {
    return;
  }

  sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));

  const identify = new amplitude.Identify();
  Object.entries(utmParams).forEach(([key, value]) => {
    identify.set(key, value);
  });
  amplitude.identify(identify);
}

export function initAnalytics() {
  if (!amplitudeApiKey) {
    return;
  }

  amplitude.init(amplitudeApiKey, undefined, {
    autocapture: { elementInteractions: true },
  });
  amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));

  trackUTMParams();
}

function trackEvent(eventName: string, eventProperties: Record<string, unknown> = {}) {
  if (!amplitudeApiKey) {
    return;
  }

  amplitude.track(eventName, { ...eventProperties, ...getStoredUTMParams() });
}

export function trackApplyStart(source: string) {
  trackEvent("apply_start", { source });
}

export function trackApplyStepView(step: string, jobFamily: JobFamily) {
  trackEvent("apply_step_view", { step, job_family: jobFamily });
}

export function trackApplyStepComplete(step: string, jobFamily: JobFamily) {
  trackEvent("apply_step_complete", { step, job_family: jobFamily });
}

export function trackApplyComplete(jobFamily: JobFamily) {
  trackEvent("apply_complete", { job_family: jobFamily, conversion: true });
}

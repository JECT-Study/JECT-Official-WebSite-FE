const FONT_FAMILY =
  "font-family:Pretendard Variable, Apple SD Gothic Neo, Malgun Gothic, '맑은 고딕', sans-serif";

const HEADING_COLOR = "#292c35";

const BODY_COLOR = "#444650";

const CAPTION_COLOR = "#8f909c";

export const ACCENT_COLOR = "#2a4de2";

export const CALLOUT_BACKGROUND = "#f5f7fe";

// 메일 클라이언트마다 <style>과 클래스 지원 여부가 다르므로 블록마다 인라인 스타일로 출력한다.
export const MAIL_STYLES = {
  heading1: `margin:0 0 32px;font-size:28px;line-height:36.4px;font-weight:400;color:${HEADING_COLOR};letter-spacing:-0.48px;${FONT_FAMILY}`,
  heading2: `margin:0 0 12px;font-size:20px;line-height:26px;font-weight:400;color:${HEADING_COLOR};letter-spacing:-0.22px;${FONT_FAMILY}`,
  heading3: `margin:0 0 8px;font-size:17px;line-height:25.5px;font-weight:400;color:${HEADING_COLOR};letter-spacing:-0.1px;${FONT_FAMILY}`,
  paragraph: `margin:0 0 16px;font-size:16px;line-height:25.6px;color:${BODY_COLOR};letter-spacing:0.05px;${FONT_FAMILY}`,
  caption: `margin:0 0 16px;font-size:13px;line-height:20.8px;color:${CAPTION_COLOR};letter-spacing:0.08px;${FONT_FAMILY}`,
  link: "color:#4a68fc;text-decoration:underline",
  bold: "font-weight:600",
  callout: `margin:0 0 16px;background-color:${CALLOUT_BACKGROUND};border:1px solid #e1e2ee;border-collapse:separate`,
  calloutCell: "padding:12px 16px",
  calloutTitle: `margin:0 0 12px;font-size:20px;line-height:26px;font-weight:600;color:${ACCENT_COLOR};letter-spacing:-0.22px;${FONT_FAMILY}`,
  calloutBadge: `width:30px;height:30px;background-color:${ACCENT_COLOR}`,
  calloutBadgeText: `font-size:20px;line-height:26px;font-weight:600;color:#ffffff;letter-spacing:-0.22px;${FONT_FAMILY}`,
  calloutGap: "width:12px;font-size:0;line-height:0",
} as const;

export const FONT_COLOR_PRESETS = [
  { label: "제목", value: HEADING_COLOR },
  { label: "본문", value: BODY_COLOR },
  { label: "캡션", value: CAPTION_COLOR },
  { label: "강조", value: ACCENT_COLOR },
] as const;

export function getBlockColor(type: string) {
  if (type === "heading") return HEADING_COLOR;
  if (type === "caption") return CAPTION_COLOR;
  if (type === "calloutTitle") return ACCENT_COLOR;
  return BODY_COLOR;
}

/**
 * 다음 블록에 따라 적용할 아래쪽 여백을 결정한다.
 * 마지막 블록은 여백을 제거하고, 캡션 앞 블록은 캡션과 자연스럽게 이어지도록 여백을 줄인다.
 */
export function getBlockMarginBottom(isLast: boolean, isBeforeCaption: boolean) {
  if (isLast) return "0";
  if (isBeforeCaption) return "4px";
  return null;
}

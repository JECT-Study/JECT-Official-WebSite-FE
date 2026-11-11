import { ACCENT_COLOR, getBlockMarginBottom, MAIL_STYLES } from "./mailStyles";

function parseFragment(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template;
}

const CALLOUT_TITLE_SELECTOR = 'h2[data-block="callout-title"]';
const CAPTION_SELECTOR = 'p[data-block="caption"]';
const BADGE_TABLE_SELECTOR = 'table[data-block="callout-badge"]';
const CALLOUT_SELECTOR = 'table[data-block="callout"]';
const CALLOUT_CELL_SELECTOR = `${CALLOUT_SELECTOR} > tbody > tr > td[data-content]`;
const TABLE_RESET = 'role="presentation" cellpadding="0" cellspacing="0" border="0"';

const BADGE_TABLE_MARGINS: Record<string, string> = {
  left: "0",
  center: "0 auto",
  right: "0 0 0 auto",
};

/**
 * toMailHtml이 추가한 번호 배지 `<table>`과 인라인 스타일을 제거한다.
 * 스타일은 각 노드의 renderHTML이 다시 적용한다.
 */
export function toEditorContent(html: string) {
  const template = parseFragment(html);
  template.content.querySelectorAll(BADGE_TABLE_SELECTOR).forEach((table) => {
    const title = table.querySelector(CALLOUT_TITLE_SELECTOR);
    if (title == null) table.remove();
    else table.replaceWith(title);
  });
  template.content.querySelectorAll("[style]").forEach((element) => {
    element.removeAttribute("style");
  });
  return template.innerHTML;
}

function appendStyle(element: Element, style: string) {
  const current = element.getAttribute("style");
  element.setAttribute("style", current == null ? style : `${current};${style}`);
}

function applySpacing(blocks: Element[]) {
  blocks.forEach((block, index) => {
    const next = blocks[index + 1];
    const margin = getBlockMarginBottom(next == null, next?.matches(CAPTION_SELECTOR) === true);
    if (margin != null) appendStyle(block, `margin-bottom:${margin}`);
  });
}

function wrapWithBadge(title: Element, number: number) {
  const align = title.getAttribute("align") ?? "left";
  const margin = BADGE_TABLE_MARGINS[align] ?? BADGE_TABLE_MARGINS.left;
  const wrapper = parseFragment(
    `<table ${TABLE_RESET} data-block="callout-badge" align="${align}" style="margin:${margin}"><tbody><tr>` +
      `<td valign="middle" width="30" style="width:30px"><table ${TABLE_RESET} width="30" height="30" bgcolor="${ACCENT_COLOR}" style="${MAIL_STYLES.calloutBadge}"><tbody><tr><td align="center" valign="middle" style="${MAIL_STYLES.calloutBadgeText}">${number}</td></tr></tbody></table></td>` +
      `<td style="${MAIL_STYLES.calloutGap}">&nbsp;</td>` +
      `<td valign="middle" data-content=""></td>` +
      "</tr></tbody></table>"
  ).content.firstElementChild;
  if (wrapper == null) return;

  title.replaceWith(wrapper);
  wrapper.querySelector("td[data-content]")?.append(title);
}

/**
 * 번호 배지와 블록 여백은 편집 화면에서 CSS로만 표시하며, `getHTML()` 결과에는 포함되지 않는다.
 * 메일에서도 동일하게 표시되도록 해당 스타일을 HTML에 직접 반영한다.
 */
export function toMailHtml(html: string) {
  const template = parseFragment(html);
  let count = 0;

  // 편집 중 trailingNode가 문서 끝에 두는 빈 문단은 저장하지 않는다.
  const last = template.content.lastElementChild;
  if (last?.tagName === "P" && !last.hasAttribute("data-block") && last.childNodes.length === 0) {
    last.remove();
  }

  template.content.querySelectorAll(CALLOUT_CELL_SELECTOR).forEach((cell) => {
    const children = Array.from(cell.children);
    applySpacing(children);

    const callout = cell.closest(CALLOUT_SELECTOR);
    const first = children[0];
    if (
      callout?.getAttribute("data-numbered") !== "false" &&
      first?.matches(CALLOUT_TITLE_SELECTOR) === true
    ) {
      count += 1;
      wrapWithBadge(first, count);
    }
  });

  applySpacing(Array.from(template.content.children));

  return template.innerHTML;
}

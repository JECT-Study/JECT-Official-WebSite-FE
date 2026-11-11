import { Heading } from "@tiptap/extension-heading";
import { Placeholder, Selection } from "@tiptap/extensions";
import { Extension, Mark, mergeAttributes, Node } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Callout, CalloutTitle } from "./callout";
import { MAIL_STYLES } from "./mailStyles";

export const HEADING_LEVELS = [1, 2, 3] as const;

export type HeadingLevel = (typeof HEADING_LEVELS)[number];

const HEADING_STYLES: Record<HeadingLevel, string> = {
  1: MAIL_STYLES.heading1,
  2: MAIL_STYLES.heading2,
  3: MAIL_STYLES.heading3,
};

const MailHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level as HeadingLevel;
    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: HEADING_STYLES[level],
      }),
      0,
    ];
  },
});

export const TEXT_ALIGNS = ["left", "center", "right"] as const;

export type TextAlign = (typeof TEXT_ALIGNS)[number];

export const TEXT_ALIGN_TYPES = ["heading", "paragraph", "caption", "calloutTitle"];

// Tiptap의 기본 TextAlign 확장은 정렬 정보를 인라인 스타일로 저장하고 읽는다.
// 메일 클라이언트마다 지원 방식이 다르므로 align 속성도 함께 저장한다. 불러올 때는 인라인 스타일을 제거하므로 align 속성에서 정렬 정보를 읽는다.
const MailTextAlign = Extension.create({
  name: "mailTextAlign",

  addGlobalAttributes() {
    return [
      {
        types: TEXT_ALIGN_TYPES,
        attributes: {
          textAlign: {
            default: null,
            parseHTML: (element) => element.getAttribute("align"),
            renderHTML: (attributes) => {
              const align = attributes.textAlign as TextAlign | null;
              return align == null ? {} : { align, style: `text-align:${align}` };
            },
          },
        },
      },
    ];
  },
});

const Caption = Node.create({
  name: "caption",
  group: "block",
  content: "inline*",

  parseHTML() {
    // 일반 문단의 `p` 규칙보다 먼저 확인해야 한다.
    return [{ tag: 'p[data-block="caption"]', priority: 60 }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, { "data-block": "caption", style: MAIL_STYLES.caption }),
      0,
    ];
  },
});

function parseFontColor(value: unknown): string | null {
  return typeof value === "string" && /^#[\da-f]{6}$/i.test(value) ? value.toLowerCase() : null;
}

const FontColorMark = Mark.create({
  name: "fontColor",

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => parseFontColor(element.getAttribute("data-color")),
        renderHTML: (attributes) => {
          const color = parseFontColor(attributes.color);
          return color == null ? {} : { "data-color": color, style: `color:${color}` };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-color]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});

export function createExtensions(placeholder?: string) {
  return [
    // 툴바에 없는 서식은 단축키로도 만들어지지 않도록 비활성화한다.
    StarterKit.configure({
      heading: false,
      paragraph: { HTMLAttributes: { style: MAIL_STYLES.paragraph } },
      bold: { HTMLAttributes: { style: MAIL_STYLES.bold } },
      link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: { rel: "noopener noreferrer", style: MAIL_STYLES.link },
      },
      bulletList: false,
      orderedList: false,
      listItem: false,
      listKeymap: false,
      blockquote: false,
      code: false,
      codeBlock: false,
      horizontalRule: false,
      // 콜아웃 뒤처럼 입력할 공간이 없는 위치에서는 한글 조합이 깨지므로 비활성화한다.
      gapcursor: false,
      trailingNode: { notAfter: ["heading", "caption"] },
    }),
    MailHeading.configure({ levels: [...HEADING_LEVELS] }),
    MailTextAlign,
    Caption,
    FontColorMark,
    Callout,
    CalloutTitle,
    Placeholder.configure({ placeholder }),
    Selection,
  ];
}

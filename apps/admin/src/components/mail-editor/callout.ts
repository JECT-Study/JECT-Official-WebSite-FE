import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { TextSelection } from "@tiptap/pm/state";
import { type Editor, mergeAttributes, Node } from "@tiptap/react";

import { CALLOUT_BACKGROUND, MAIL_STYLES } from "./mailStyles";

function hasCalloutBadge(callout: ProseMirrorNode) {
  return callout.attrs.numbered === true && callout.firstChild?.type.name === "calloutTitle";
}

// 콜아웃 제목은 항상 굵게 표시하며 문단 종류, 굵게, 글자색을 바꿀 수 없다. 단축키가 제목보다 먼저 처리되도록 우선순위를 높인다.
export const CalloutTitle = Node.create({
  name: "calloutTitle",
  priority: 200,
  content: "inline*",
  marks: "italic underline strike link",
  defining: true,

  parseHTML() {
    // 제목 2의 `h2` 규칙보다 먼저 확인해야 한다.
    return [{ tag: 'h2[data-block="callout-title"]', priority: 60 }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "h2",
      mergeAttributes(HTMLAttributes, {
        "data-block": "callout-title",
        style: MAIL_STYLES.calloutTitle,
      }),
      0,
    ];
  },

  addKeyboardShortcuts() {
    const block = () => !canChangeBlockType(this.editor);
    return {
      "Mod-Alt-0": block,
      "Mod-Alt-1": block,
      "Mod-Alt-2": block,
      "Mod-Alt-3": block,
    };
  },
});

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "calloutTitle? (paragraph | heading | caption)+",
  isolating: true,
  defining: true,

  addAttributes() {
    return {
      numbered: {
        default: true,
        parseHTML: (element) => element.getAttribute("data-numbered") !== "false",
        renderHTML: (attributes) => ({ "data-numbered": String(attributes.numbered) }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'table[data-block="callout"]', contentElement: "td[data-content]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "table",
      mergeAttributes(HTMLAttributes, {
        role: "presentation",
        cellpadding: "0",
        cellspacing: "0",
        border: "0",
        "data-block": "callout",
        width: "100%",
        bgcolor: CALLOUT_BACKGROUND,
        style: MAIL_STYLES.callout,
      }),
      ["tbody", ["tr", ["td", { "data-content": "", style: MAIL_STYLES.calloutCell }, 0]]],
    ];
  },

  // 첫 줄 맨 앞의 Backspace는 번호 배지, 콜아웃 제목, 콜아웃 순서로 하나씩 지운다. 콜아웃 제목은 글자를 남기고 문단으로 바꾼다.
  addKeyboardShortcuts() {
    return {
      // 마지막 빈 문단에서 Enter를 누르면 콜아웃 밖으로 빠져나간다.
      Enter: ({ editor }) => {
        const { $from, empty } = editor.state.selection;
        if (!empty || $from.depth < 2) return false;

        const callout = $from.node(-1);
        const isLastEmptyParagraph =
          $from.parent.type.name === "paragraph" &&
          $from.parent.content.size === 0 &&
          $from.index(-1) === callout.childCount - 1;
        if (callout.type.name !== this.name || !isLastEmptyParagraph) return false;

        const minChildCount = callout.firstChild?.type.name === "calloutTitle" ? 2 : 1;
        if (callout.childCount - 1 < minChildCount) return false;

        const calloutEnd = $from.after(-1);
        return editor
          .chain()
          .command(({ tr, state }) => {
            tr.delete($from.before(), $from.after());
            const after = tr.mapping.map(calloutEnd);
            const next = tr.doc.nodeAt(after);
            if (next?.type.name !== "paragraph" || next.content.size !== 0) {
              tr.insert(after, state.schema.nodes.paragraph.create());
            }
            tr.setSelection(TextSelection.create(tr.doc, after + 1));
            return true;
          })
          .run();
      },

      Backspace: ({ editor }) => {
        const { $from, empty } = editor.state.selection;
        if (!empty || $from.parentOffset !== 0 || $from.depth < 2) return false;

        const callout = $from.node($from.depth - 1);
        if (callout.type.name !== this.name || $from.index($from.depth - 1) !== 0) return false;

        if (hasCalloutBadge(callout)) {
          const calloutPos = $from.before($from.depth - 1);
          return editor
            .chain()
            .command(({ tr }) => {
              tr.setNodeAttribute(calloutPos, "numbered", false);
              return true;
            })
            .run();
        }

        if ($from.parent.type.name === "calloutTitle") {
          return editor.commands.setNode("paragraph");
        }

        unwrapCallout(editor);
        return true;
      },
    };
  },
});

function findCallout(editor: Editor) {
  const { $from } = editor.state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    const node = $from.node(depth);
    if (node.type.name === "callout") return { node, pos: $from.before(depth) };
  }
  return null;
}

/** 콜아웃 제목은 다른 블록으로 바꿀 수 없다. 스키마상으로는 허용되므로 명령 전에 확인한다. */
export function canChangeBlockType(editor: Editor) {
  return !editor.isActive("calloutTitle");
}

export function isInCallout(editor: Editor) {
  return findCallout(editor) != null;
}

export function insertCallout(editor: Editor) {
  editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const { schema } = state;
      const callout = schema.nodes.callout.create(null, [
        schema.nodes.calloutTitle.create(),
        schema.nodes.paragraph.create(),
      ]);
      tr.replaceSelectionWith(callout);

      tr.doc.descendants((node, pos) => {
        if (node !== callout) return true;
        tr.setSelection(TextSelection.create(tr.doc, pos + 2));
        return false;
      });
      return true;
    })
    .run();
}

export function unwrapCallout(editor: Editor) {
  const callout = findCallout(editor);
  if (callout == null) return;

  editor
    .chain()
    .focus()
    .command(({ tr, state }) => {
      const blocks: ProseMirrorNode[] = [];
      callout.node.forEach((child) => {
        blocks.push(
          child.type.name === "calloutTitle"
            ? state.schema.nodes.heading.create(
                { level: 2, textAlign: child.attrs.textAlign },
                child.content
              )
            : child
        );
      });
      tr.replaceWith(callout.pos, callout.pos + callout.node.nodeSize, blocks);
      tr.setSelection(TextSelection.near(tr.doc.resolve(callout.pos + 1)));
      return true;
    })
    .run();
}

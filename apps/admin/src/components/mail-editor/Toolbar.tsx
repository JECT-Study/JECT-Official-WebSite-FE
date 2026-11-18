import { Fragment } from "react";

import { BlockButton, Divider, DropdownMenu, type IconName, Tooltip } from "@jects/jds";
import { NodeSelection } from "@tiptap/pm/state";
import { type Editor, useEditorState } from "@tiptap/react";

import { canChangeBlockType, insertCallout, isInCallout, unwrapCallout } from "./callout";
import { LinkPopover } from "./LinkPopover";
import {
  HEADING_LEVELS,
  type HeadingLevel,
  TEXT_ALIGN_TYPES,
  TEXT_ALIGNS,
  type TextAlign,
} from "./MailEditor.extensions";
import { FONT_COLOR_PRESETS, getBlockColor } from "./mailStyles";
import { ToolbarButton } from "./ToolbarButton";

interface ToolbarAction {
  key: string;
  label: string;
  icon: IconName;
  isActive: (editor: Editor) => boolean;
  canRun: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
}

const HEADING_ICONS: Record<HeadingLevel, IconName> = {
  1: "heading-1",
  2: "heading-2",
  3: "heading-3",
};

const ALIGN_ACTIONS: Record<TextAlign, { label: string; icon: IconName }> = {
  left: { label: "왼쪽 정렬", icon: "text-align-justify-start" },
  center: { label: "가운데 정렬", icon: "text-align-justify-center" },
  right: { label: "오른쪽 정렬", icon: "text-align-justify-end" },
};

function getTextAlign(editor: Editor): TextAlign {
  const { $from } = editor.state.selection;
  const node =
    editor.state.selection instanceof NodeSelection ? editor.state.selection.node : $from.parent;
  const align: unknown = node.attrs.textAlign;
  return align === "center" || align === "right" ? align : "left";
}

const TOOLBAR_GROUPS: ToolbarAction[][] = [
  [
    {
      key: "bold",
      label: "굵게",
      icon: "bold",
      isActive: (editor) => editor.isActive("bold"),
      canRun: (editor) => editor.can().toggleBold(),
      run: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
      key: "italic",
      label: "기울임",
      icon: "italic",
      isActive: (editor) => editor.isActive("italic"),
      canRun: (editor) => editor.can().toggleItalic(),
      run: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
      key: "underline",
      label: "밑줄",
      icon: "underline",
      isActive: (editor) => editor.isActive("underline"),
      canRun: (editor) => editor.can().toggleUnderline(),
      run: (editor) => editor.chain().focus().toggleUnderline().run(),
    },
    {
      key: "strike",
      label: "취소선",
      icon: "strikethrough",
      isActive: (editor) => editor.isActive("strike"),
      canRun: (editor) => editor.can().toggleStrike(),
      run: (editor) => editor.chain().focus().toggleStrike().run(),
    },
  ],
  [
    ...HEADING_LEVELS.map<ToolbarAction>((level) => ({
      key: `heading-${level}`,
      label: `제목 ${level}`,
      icon: HEADING_ICONS[level],
      isActive: (editor) => editor.isActive("heading", { level }),
      canRun: (editor) => canChangeBlockType(editor) && editor.can().toggleHeading({ level }),
      run: (editor) => editor.chain().focus().toggleHeading({ level }).run(),
    })),
    {
      key: "caption",
      label: "캡션",
      icon: "captions",
      isActive: (editor) => editor.isActive("caption"),
      canRun: (editor) =>
        canChangeBlockType(editor) && editor.can().toggleNode("caption", "paragraph"),
      run: (editor) => editor.chain().focus().toggleNode("caption", "paragraph").run(),
    },
  ],
  [
    ...TEXT_ALIGNS.map<ToolbarAction>((align) => ({
      key: `align-${align}`,
      label: ALIGN_ACTIONS[align].label,
      icon: ALIGN_ACTIONS[align].icon,
      isActive: (editor) => getTextAlign(editor) === align,
      canRun: () => true,
      run: (editor) =>
        TEXT_ALIGN_TYPES.reduce(
          (chain, type) =>
            chain.updateAttributes(type, { textAlign: align === "left" ? null : align }),
          editor.chain().focus()
        ).run(),
    })),
  ],
];

function ColorSwatch({ color }: { color: string }) {
  return <span className="size-12 shrink-0 rounded-max" style={{ backgroundColor: color }} />;
}

function getFontColor(editor: Editor) {
  const { selection, doc } = editor.state;
  if (selection.empty) {
    const color: unknown = editor.getAttributes("fontColor").color;
    return typeof color === "string" ? color : getBlockColor(selection.$from.parent.type.name);
  }

  const colors = new Set<string>();
  doc.nodesBetween(selection.from, selection.to, (node, pos) => {
    if (!node.isText) return;
    const color: unknown = node.marks.find((mark) => mark.type.name === "fontColor")?.attrs.color;
    colors.add(
      typeof color === "string" ? color : getBlockColor(doc.resolve(pos).parent.type.name)
    );
  });
  return colors.size === 1 ? ([...colors][0] ?? null) : null;
}

interface FontColorMenuProps {
  editor: Editor;
}

function FontColorMenu({ editor }: FontColorMenuProps) {
  const { fontColor, canSetColor } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      fontColor: getFontColor(editor),
      canSetColor: editor.can().setMark("fontColor"),
    }),
  });

  const setFontColor = (color: string) => {
    editor.chain().focus().setMark("fontColor", { color }).run();
  };

  return (
    <DropdownMenu.Root size="sm">
      <DropdownMenu.Trigger asChild disabled={!canSetColor}>
        <BlockButton size="sm" hierarchy="secondary" variant="hollow" suffixIcon="chevron-down">
          글자 색
        </BlockButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="start"
        sideOffset={4}
        className="z-floated max-h-[320px] w-[120px] overflow-y-auto"
      >
        <DropdownMenu.Group>
          {FONT_COLOR_PRESETS.map(({ label, value }) => (
            <DropdownMenu.Button
              key={label}
              isSelected={fontColor === value}
              onSelect={() => setFontColor(value)}
            >
              <span className="flex items-center gap-8">
                <ColorSwatch color={value} />
                {label}
              </span>
            </DropdownMenu.Button>
          ))}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

interface ToolbarProps {
  editor: Editor;
}

export function Toolbar({ editor }: ToolbarProps) {
  const actionState = useEditorState({
    editor,
    selector: ({ editor }): Record<string, { active: boolean; enabled: boolean }> =>
      Object.fromEntries(
        TOOLBAR_GROUPS.flat().map((action) => [
          action.key,
          { active: action.isActive(editor), enabled: action.canRun(editor) },
        ])
      ),
  });
  const isCalloutActive = useEditorState({ editor, selector: ({ editor }) => isInCallout(editor) });

  return (
    <Tooltip.Provider>
      <div className="flex flex-wrap items-center gap-4 border-b border-stroke-alpha-assistive px-12 py-8">
        {TOOLBAR_GROUPS.map((group, index) => (
          <Fragment key={group[0]?.key}>
            {index > 0 && <Divider orientation="vertical" className="h-16 self-center" />}
            {group.map((action) => (
              <ToolbarButton
                key={action.key}
                label={action.label}
                active={actionState[action.key]?.active ?? false}
                disabled={actionState[action.key]?.enabled !== true}
                icon={action.icon}
                onClick={() => action.run(editor)}
              />
            ))}
          </Fragment>
        ))}
        <Divider orientation="vertical" className="h-16 self-center" />
        <FontColorMenu editor={editor} />
        <Divider orientation="vertical" className="h-16 self-center" />
        <LinkPopover editor={editor} />
        <ToolbarButton
          label="콜아웃"
          active={isCalloutActive}
          onClick={() => (isCalloutActive ? unwrapCallout(editor) : insertCallout(editor))}
          icon="square-text"
        />
      </div>
    </Tooltip.Provider>
  );
}

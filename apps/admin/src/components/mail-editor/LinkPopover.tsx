import { type KeyboardEvent, useEffect, useState } from "react";

import { Divider, IconButton } from "@jects/jds";
import { type Editor, useEditorState } from "@tiptap/react";
import { Popover } from "radix-ui";

import { ToolbarButton } from "./ToolbarButton";

// 메일 본문에서는 상대 경로가 의도한 리소스를 가리키지 않을 수 있으므로 스킴이 없는 URL은 `https`로 처리한다.
function withProtocol(href: string) {
  return /^[a-z][a-z\d+.-]*:/i.test(href) ? href : `https://${href}`;
}

function getLinkHref(editor: Editor) {
  const href: unknown = editor.getAttributes("link").href;
  return typeof href === "string" ? href : "";
}

interface LinkPopoverProps {
  editor: Editor;
}

export function LinkPopover({ editor }: LinkPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");

  const isActive = useEditorState({ editor, selector: ({ editor }) => editor.isActive("link") });

  useEffect(() => {
    const handleSelectionUpdate = () => {
      setUrl(getLinkHref(editor));
      if (editor.isEditable && editor.isActive("link")) setIsOpen(true);
    };
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor]);

  const input = url.trim();

  const setLink = () => {
    if (input === "") return;

    const href = withProtocol(input);
    if (!editor.can().setLink({ href })) return;

    const chain = editor.chain().focus().extendMarkRange("link").setLink({ href });
    if (editor.state.selection.empty) chain.insertContent({ type: "text", text: href });
    chain.run();
    setIsOpen(false);
  };

  const removeLink = () => {
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .unsetLink()
      .setMeta("preventAutolink", true)
      .run();
    setUrl("");
  };

  const openLink = () => {
    window.open(withProtocol(input), "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    event.preventDefault();
    setLink();
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Anchor asChild>
        <span className="inline-flex">
          <ToolbarButton
            label="링크"
            active={isActive}
            onClick={() => {
              setUrl(getLinkHref(editor));
              setIsOpen((open) => !open);
            }}
            icon="link"
          />
        </span>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-floated outline-none"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <div className="flex items-center gap-4 rounded-8 border border-stroke-alpha-subtler bg-surface-standard p-8 shadow-overlay">
            <input
              type="url"
              placeholder="링크를 입력하세요"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="h-32 min-w-[192px] bg-transparent px-8 font-body text-body-md font-body-normal text-object-bolder outline-none placeholder:text-object-assistive"
            />
            <IconButton
              icon="corner-down-left"
              size="sm"
              hierarchy="tertiary"
              condensed={false}
              title="적용"
              disabled={input === ""}
              onClick={setLink}
            />
            <Divider orientation="vertical" className="h-16 self-center" />
            <IconButton
              icon="external-link"
              size="sm"
              hierarchy="tertiary"
              condensed={false}
              title="새 창에서 열기"
              disabled={input === ""}
              onClick={openLink}
            />
            <IconButton
              icon="trash"
              size="sm"
              hierarchy="tertiary"
              condensed={false}
              title="링크 삭제"
              disabled={input === "" && !isActive}
              onClick={removeLink}
            />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

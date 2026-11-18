import { type ReactNode, useEffect } from "react";

import { type Editor, EditorContent, useEditor } from "@tiptap/react";

import { cn } from "@/utils/cn";

import { createExtensions } from "./MailEditor.extensions";
import { toEditorContent, toMailHtml } from "./MailEditor.utils";
import { Toolbar } from "./Toolbar";

interface MailEditorProps {
  label?: ReactNode;
  helperText?: ReactNode;
  /** toMailHtml로 변환한 HTML이다. 내용이 없으면 빈 문자열이다. */
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

function getValue(editor: Editor) {
  return editor.isEmpty ? "" : toMailHtml(editor.getHTML());
}

export function MailEditor({
  label,
  helperText,
  value,
  onChange,
  onBlur,
  placeholder,
  invalid = false,
  readOnly = false,
  required = false,
}: MailEditorProps) {
  const editor = useEditor({
    extensions: createExtensions(placeholder),
    content: toEditorContent(value),
    editable: !readOnly,
    enableInputRules: false,
    enablePasteRules: ["link"],
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: cn(
          "mail-editor-content min-h-[160px] resize-y overflow-auto px-12 py-10 font-body text-body-md font-body-normal text-object-bolder outline-none group-data-[readonly=true]:cursor-default group-data-[readonly=true]:resize-none"
        ),
      },
    },
    onUpdate: ({ editor }) => onChange(getValue(editor)),
    onBlur: () => onBlur?.(),
  });

  // useEditor는 리렌더 시 editable 옵션을 반영하지 않는다.
  useEffect(() => {
    editor.setEditable(!readOnly, false);
  }, [editor, readOnly]);

  useEffect(() => {
    if (value === getValue(editor)) return;
    editor.commands.setContent(toEditorContent(value), { emitUpdate: false });
  }, [editor, value]);

  return (
    <div className="flex flex-col">
      {label != null && (
        <span className="mb-4 flex items-start gap-2">
          <span
            onClick={() => editor.commands.focus()}
            className="font-label text-label-sm font-label-normal text-object-neutral"
          >
            {label}
          </span>
          {required && (
            <span className="mt-[-2px] font-label text-label-sm font-label-normal text-feedback-notifying-static-inverse-bold">
              *
            </span>
          )}
        </span>
      )}
      <div
        data-readonly={readOnly}
        className={cn(
          "group relative flex flex-col overflow-clip rounded-8 border bg-surface-standard transition-[border-color,box-shadow] duration-100 ease-fluent has-[:focus-visible]:ring-2",
          invalid
            ? "border-feedback-destructive-alpha-alternative focus-within:border-feedback-destructive-normal hover:border-feedback-destructive-normal has-[:focus-visible]:ring-feedback-destructive-alpha-alternative"
            : "border-stroke-alpha-assistive focus-within:border-accent-normal hover:border-accent-normal has-[:focus-visible]:ring-accent-alpha-alternative"
        )}
      >
        {!readOnly && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      {helperText != null && (
        <span
          className={cn(
            "mt-6 font-label text-label-sm font-label-normal",
            invalid ? "text-feedback-destructive-normal" : "text-object-alternative"
          )}
        >
          {helperText}
        </span>
      )}
    </div>
  );
}

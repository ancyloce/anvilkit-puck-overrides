"use client";

import React, { ReactNode, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RichtextInputProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  children?: ReactNode;
}

/**
 * RichtextInput — a toolbar-based rich-text composition widget for Puck's
 * `custom` or `richtext`-style fields.
 *
 * **Note:** This implementation uses the browser's native `contenteditable`
 * with `document.execCommand` purely as a lightweight, zero-dependency
 * demonstration.  `execCommand` is deprecated by the WHATWG spec and may
 * produce inconsistent results across browsers.  For production use, replace
 * the content-editable approach with a maintained rich-text library such as
 * Tiptap, ProseMirror, or Slate, which provide cross-browser consistency,
 * proper accessibility, and a stable extension API.
 */
export function RichtextInput({
  value,
  onChange,
  readOnly = false,
}: RichtextInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  function exec(command: string, arg?: string) {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  const toolbarActions = [
    { icon: <Bold className="h-3.5 w-3.5" />, command: "bold", label: "Bold" },
    {
      icon: <Italic className="h-3.5 w-3.5" />,
      command: "italic",
      label: "Italic",
    },
    {
      icon: <Underline className="h-3.5 w-3.5" />,
      command: "underline",
      label: "Underline",
    },
    null,
    {
      icon: <List className="h-3.5 w-3.5" />,
      command: "insertUnorderedList",
      label: "Bullet list",
    },
    {
      icon: <ListOrdered className="h-3.5 w-3.5" />,
      command: "insertOrderedList",
      label: "Numbered list",
    },
    null,
    {
      icon: <Link className="h-3.5 w-3.5" />,
      command: "createLink",
      label: "Link",
      prompt: "Enter URL",
    },
  ] as const;

  return (
    <div
      className={cn(
        "rounded-md border overflow-hidden",
        readOnly && "opacity-60 pointer-events-none"
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b bg-muted/50 px-1 py-1">
        {toolbarActions.map((action, i) => {
          if (action === null) {
            return (
              <Separator
                key={`sep-${i}`}
                orientation="vertical"
                className="h-4 mx-0.5"
              />
            );
          }
          return (
            <Button
              key={action.command}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                exec(
                  action.command,
                  "prompt" in action
                    ? window.prompt(action.prompt) ?? undefined
                    : undefined
                )
              }
              aria-label={action.label}
              type="button"
            >
              {action.icon}
            </Button>
          );
        })}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className="min-h-[120px] p-3 text-sm focus:outline-none"
        dangerouslySetInnerHTML={{ __html: value ?? "" }}
        onInput={() => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }}
      />
    </div>
  );
}

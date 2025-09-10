"use client";

import {
  FORMAT_TEXT_COMMAND,
  // $getSelection,
  // $isRangeSelection,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@/components/ui/button";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const applyFormat = (format: "bold" | "italic" | "underline" | "strikethrough" | "code") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="flex gap-2 border-b p-2 bg-muted">
      <Button size="sm" variant="outline" onClick={() => applyFormat("bold")}>
        Bold
      </Button>
      <Button size="sm" variant="outline" onClick={() => applyFormat("italic")}>
        Italic
      </Button>
      <Button size="sm" variant="outline" onClick={() => applyFormat("underline")}>
        Underline
      </Button>
      <Button size="sm" variant="outline" onClick={() => applyFormat("strikethrough")}>
        Strike
      </Button>
      <Button size="sm" variant="outline" onClick={() => applyFormat("code")}>
        Code
      </Button>
    </div>
  );
}

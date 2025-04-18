/* only *one* new prop added: maxLines & helper notice */

import React, { useRef, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button }   from "@/components/ui/button";
import { X }        from "lucide-react";

type Props = {
  text: string;
  setText: (t: string) => void;
  onClassify: () => void;
  maxLines?: number;                 // NEW – defaults to 1‑line mode
};

const TextInput = ({ text, setText, onClassify, maxLines = 1 }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onClassify();
    }
  };

  const clear = () => {
    setText("");
    ref.current?.focus();
  };

  const lines = text.split(/\r?\n/).filter((l) => l.trim()).length;

  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium mb-1">Text{maxLines > 1 && "s"}</label>

      <div className="relative">
        <Textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            maxLines === 1
              ? "Type a tweet or sentence…"
              : `Up to ${maxLines} lines – each line will be classified`
          }
          className="min-h-[120px] pr-10"
          onKeyDown={handleKey}
        />
        {text && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={clear}
            aria-label="Clear text"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {maxLines > 1 && (
        <p className="mt-1 text-xs text-gray-500">
          {lines}/{maxLines} lines&nbsp;• Ctrl/⌘ + Enter to run
        </p>
      )}
    </div>
  );
};

export default TextInput;

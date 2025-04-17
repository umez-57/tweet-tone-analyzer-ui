
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type TextInputProps = {
  text: string;
  setText: (text: string) => void;
  onClassify: () => void;
};

const TextInput = ({ text, setText, onClassify }: TextInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Ctrl+Enter or Cmd+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onClassify();
    }
  };

  const clearText = () => {
    setText('');
    textareaRef.current?.focus();
  };

  return (
    <div className="mb-4 relative">
      <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
        Text
      </label>
      <div className="relative">
        <Textarea
          ref={textareaRef}
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a tweet or any short sentence..."
          className="min-h-[120px] pr-10"
          onKeyDown={handleKeyDown}
          aria-label="Text to analyze"
        />
        {text && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={clearText}
            aria-label="Clear text"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Press Ctrl+Enter (or Cmd+Enter) to classify
      </p>
    </div>
  );
};

export default TextInput;

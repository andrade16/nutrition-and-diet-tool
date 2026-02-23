"use client";

import { useRef, useEffect } from "react";
import styles from "./ChatInput.module.css";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onNewChat: () => void;
  isLoading: boolean;
  showNewChat: boolean;
  error: string | null;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  onNewChat,
  isLoading,
  showNewChat,
  error,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset height when the input is cleared externally (e.g. after sending a message)
  useEffect(() => {
    if (value === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value]);

  return (
    <div className={styles.inputArea}>
      <div className={styles.inputContainer}>
        {showNewChat && (
          <button
            className={styles.newChatBtn}
            onClick={onNewChat}
            title="New chat"
            aria-label="New chat"
          >
            ↺
          </button>
        )}
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          rows={1}
          onChange={(e) => {
            onChange(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height =
              Math.min(e.target.scrollHeight, 200) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Ask about nutrition, meal planning, dietary advice..."
          disabled={isLoading}
        />
        <button
          className={styles.sendBtn}
          onClick={() => onSend()}
          disabled={isLoading || !value.trim()}
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.hint}>Enter to send · Shift+Enter for new line</p>
    </div>
  );
}

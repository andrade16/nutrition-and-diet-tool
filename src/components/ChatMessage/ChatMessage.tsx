"use client";

import ReactMarkdown from "react-markdown";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isLoading: boolean;
}

export default function ChatMessage({
  role,
  content,
  isLoading,
}: ChatMessageProps) {
  return (
    <div
      className={`${styles.message} ${role === "user" ? styles.user : styles.assistant}`}
    >
      <div className={styles.bubble}>
        {content === "" && isLoading ? (
          <span className={styles.thinking}>
            <span />
            <span />
            <span />
          </span>
        ) : role === "assistant" ? (
          <div className="prose">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

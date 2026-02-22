"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addExchange,
  clearMessages,
  selectMessages,
  type Message,
} from "@/store/slices/chatSlice";
import { selectUserRole } from "@/store/slices/userSlice";
import { selectFavoritedFoods } from "@/store/slices/favoritesSlice";
import type { FavoriteItem } from "@/lib/types/usda";
import { streamChatResponse } from "@/lib/chat-api";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";

const SUGGESTIONS = [
  "What are some high-protein breakfast ideas?",
  "How much fiber should I eat per day?",
  "What foods are high in iron?",
  "Suggest a balanced meal plan for weight loss",
];

export default function ChatPage() {
  const dispatch = useAppDispatch();

  // Committed chat history from Redux — persisted across page reloads via redux-persist.
  // Only updated once a full exchange (user + assistant) completes successfully.
  const persistedMessages = useAppSelector(selectMessages);

  // Refs for scrolling to the bottom of the message list and auto-resizing the textarea.
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // The user's message for the current in-progress exchange. null means no exchange is streaming.
  // Kept in local state (not Redux) so a failed request doesn't pollute the persisted history.
  const [streamingUser, setStreamingUser] = useState<string | null>(null);

  // Accumulates the assistant's response text as chunks arrive from the stream.
  // Replaced chunk-by-chunk; committed to Redux only when the stream finishes cleanly.
  const [streamingAssistant, setStreamingAssistant] = useState("");

  const [error, setError] = useState<string | null>(null);

  const role = useAppSelector(selectUserRole);
  const favoritedFoods = useAppSelector(selectFavoritedFoods);
  const favoritedFoodNames = favoritedFoods.map(
    (food: FavoriteItem) => food.description,
  );

  // Merges persisted history with the in-progress streaming exchange for rendering.
  // When not streaming (streamingUser === null), just shows the committed Redux messages.
  // When streaming, appends the live user + assistant messages so the UI updates in real time.
  const displayMessages = useMemo<Message[]>(
    () =>
      streamingUser !== null
        ? [
            ...persistedMessages,
            { role: "user", content: streamingUser },
            { role: "assistant", content: streamingAssistant },
          ]
        : persistedMessages,
    [persistedMessages, streamingUser, streamingAssistant],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    setStreamingUser(content);
    setStreamingAssistant("");
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setError(null);
    setIsLoading(true);

    const messagesToSend = [...persistedMessages, { role: "user", content }];

    try {
      const finalContent = await streamChatResponse(
        messagesToSend,
        role,
        favoritedFoodNames,
        (accumulated) => setStreamingAssistant(accumulated),
      );
      dispatch(addExchange({ user: content, assistant: finalContent }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setStreamingUser(null);
      setStreamingAssistant("");
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Messages area */}
      <div className={styles.messages}>
        {displayMessages.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>What can I help you with?</p>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className={styles.suggestion}
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.messageList}>
            {displayMessages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.message} ${msg.role === "user" ? styles.user : styles.assistant}`}
              >
                <div className={styles.bubble}>
                  {msg.content === "" && isLoading ? (
                    <span className={styles.thinking}>
                      <span />
                      <span />
                      <span />
                    </span>
                  ) : msg.role === "assistant" ? (
                    <div className='prose'>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className={styles.inputArea}>
        <div className={styles.inputContainer}>
          {displayMessages.length > 0 && (
            <button
              className={styles.newChatBtn}
              onClick={() => dispatch(clearMessages())}
              title='New chat'
            >
              ↺
            </button>
          )}
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 200) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder='Ask about nutrition, meal planning, dietary advice...'
            disabled={isLoading}
          />
          <button
            className={styles.sendBtn}
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            aria-label='Send'
          >
            <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' />
            </svg>
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <p className={styles.hint}>Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

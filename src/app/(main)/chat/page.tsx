"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  addExchange,
  clearMessages,
  selectMessages,
  type Message,
} from "@/store/slices/chat/chatSlice";
import { selectUserRole } from "@/store/slices/user/userSlice";
import { selectFavoritedFoods } from "@/store/slices/favorites/favoritesSlice";
import type { FavoriteItem } from "@/lib/types/usda";
import { streamChatResponse } from "@/lib/apis/chat-api";
import ChatMessage from "@/components/ChatMessage/ChatMessage";
import ChatInput from "@/components/ChatInput/ChatInput";
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

  const bottomRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // The user's message for the current in-progress exchange. null means no exchange is pending.
  // Kept in local state (not Redux) so a failed request doesn't pollute the persisted history.
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);

  // Accumulates the assistant's response text as chunks arrive from the stream.
  // Replaced chunk-by-chunk; committed to Redux only when the stream finishes cleanly.
  const [streamingPartialReply, setStreamingPartialReply] = useState("");

  const [error, setError] = useState<string | null>(null);

  const role = useAppSelector(selectUserRole);
  const favoritedFoods = useAppSelector(selectFavoritedFoods);
  const favoritedFoodNames = favoritedFoods.map(
    (food: FavoriteItem) => food.description,
  );

  // Merges persisted history with the in-progress streaming exchange for rendering.
  // When not pending (pendingUserMessage === null), just shows the committed Redux messages.
  // When pending, appends the live user + assistant messages so the UI updates in real time.
  const displayMessages = useMemo<Message[]>(
    () =>
      pendingUserMessage !== null
        ? [
            ...persistedMessages,
            { role: "user", content: pendingUserMessage },
            { role: "assistant", content: streamingPartialReply },
          ]
        : persistedMessages,
    [persistedMessages, pendingUserMessage, streamingPartialReply],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    setPendingUserMessage(content);
    setStreamingPartialReply("");
    setInput("");
    setError(null);
    setIsLoading(true);

    const messagesToSend = [...persistedMessages, { role: "user", content }];

    try {
      const finalContent = await streamChatResponse(
        messagesToSend,
        role,
        favoritedFoodNames,
        (accumulated) => setStreamingPartialReply(accumulated),
      );
      dispatch(addExchange({ user: content, assistant: finalContent }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setPendingUserMessage(null);
      setStreamingPartialReply("");
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
              <ChatMessage
                key={i}
                role={msg.role}
                content={msg.content}
                isLoading={isLoading}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        onNewChat={() => dispatch(clearMessages())}
        isLoading={isLoading}
        showNewChat={displayMessages.length > 0}
        error={error}
      />
    </div>
  );
}

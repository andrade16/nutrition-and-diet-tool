"use client";

import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectUserRole } from "@/store/slices/userSlice";
import { selectFavoritedFoods } from "@/store/slices/favoritesSlice";
import type { FavoriteItem } from "@/lib/types/usda";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const role = useAppSelector(selectUserRole);
  const favoritedFoods = useAppSelector(selectFavoritedFoods);
  const favoritedFoodNames = favoritedFoods.map(
    (food: FavoriteItem) => food.description,
  );

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Append an empty assistant message — we'll fill it in as the stream arrives
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: updatedMessages,
        favoritedFoods: favoritedFoodNames,
        role,
      }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: (next[next.length - 1]?.content ?? "") + chunk,
        };
        return next;
      });
    }

    setIsLoading(false);
  }

  return (
    <div>
      {/* Message list */}
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.content === "" && (
          <p>Thinking...</p>
        )}
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder='Ask about nutrition, meal planning, dietary advice...'
        disabled={isLoading}
      />
      <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
        Send
      </button>

      {messages.length > 0 && (
        <button onClick={() => setMessages([])}>New Chat</button>
      )}
    </div>
  );
}

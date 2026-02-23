import type { Message } from "@/store/slices/chat/chatSlice";

export async function streamChatResponse(
  messages: Message[],
  role: string | null,
  favoritedFoods: string[],
  onChunk: (accumulated: string) => void,
): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, role, favoritedFoods }),
  });

  if (!res.ok) {
    throw new Error(`Chat API error: ${res.status} ${res.statusText}`);
  }

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let finalContent = "";

  while (true) {
    const { done, value } = await reader!.read();

    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    finalContent += chunk;
    onChunk(finalContent);
  }

  return finalContent;
}

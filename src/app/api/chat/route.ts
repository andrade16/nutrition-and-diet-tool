import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  const { messages, role, favoritedFoods } = await req.json();
  console.log("Received chat request with role:", role);
  console.log("Favorited foods:", favoritedFoods);
  console.log("Messages:", messages);

  const systemPrompt = buildSystemPrompt(role, favoritedFoods); // sets context and instructions for the ai

  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages as MessageParam[], // back and forth messages between user and ai
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable);
}

function buildSystemPrompt(
  role: string | null,
  favoritedFoods: string[],
): string {
  const base =
    role === "dietitian"
      ? "You are a clinical dietitian assistant. Use precise nutritional terminology, reference DRIs, and provide evidence-based guidance."
      : "You are a friendly nutrition assistant. Give practical, easy-to-understand dietary advice.";

  const context =
    favoritedFoods.length > 0
      ? `\n\nThe user has saved these foods to their favorites: ${favoritedFoods.join(", ")}. You can reference these when relevant.`
      : "";

  return base + context;
}

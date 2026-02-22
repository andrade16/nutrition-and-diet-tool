import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addExchange: (
      state,
      action: PayloadAction<{ user: string; assistant: string }>,
    ) => {
      state.messages.push({ role: "user", content: action.payload.user });
      state.messages.push({
        role: "assistant",
        content: action.payload.assistant,
      });
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addExchange, clearMessages } = chatSlice.actions;

export const selectMessages = (state: RootState) => state.chat.messages;

export default chatSlice.reducer;

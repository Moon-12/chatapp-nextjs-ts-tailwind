import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Message {
  id?: number;
  message: string;
  createdBy: string;
  createdAt: Timestamp;
}

export interface ChatState {
  chatData: Message[] | null;
}

const initialState: ChatState = {
  chatData: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setPreviousChats: (state, action) => {
      state.chatData = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      if (state.chatData) {
        state.chatData.push(action.payload);
      } else {
        state.chatData = [action.payload];
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPreviousChats, addMessage } = chatSlice.actions;

export default chatSlice.reducer;

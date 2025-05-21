import { createSlice } from "@reduxjs/toolkit";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Message {
  id?: number;
  message: string;
  createdBy: string;
  createdAt: Timestamp;
}

export interface ChatState {
  chatData: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chatData: [],
  loading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setPreviousChats: (state, action) => {
      state.chatData = action.payload;
    },
    setNewChat: (state, action) => {
      state.chatData.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPreviousChats, setNewChat } = chatSlice.actions;

export default chatSlice.reducer;

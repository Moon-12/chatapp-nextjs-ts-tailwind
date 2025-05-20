import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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

//can be used with http (if not using socket)

export const sendMessage = createAsyncThunk(
  "chat/postMessage",
  async (message: Message, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/postMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const responseData = await response.json();
      return responseData.data; // Assuming API returns the saved message
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        sendMessage.fulfilled,
        (state, action: PayloadAction<Message>) => {
          state.loading = false;
          if (state.chatData) {
            state.chatData.push(action.payload);
          } else {
            state.chatData = [action.payload];
          }
        }
      )
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setPreviousChats, setNewChat } = chatSlice.actions;

export default chatSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Message {
  id?: number;
  message: string;
  createdBy: string;
  createdAt: Timestamp;
  groupId: number;
}

export interface ChatState {
  chatData: Message[];
  loading: boolean;
  error: {} | null;
}

const initialState: ChatState = {
  chatData: [],
  loading: false,
  error: null,
};

export const fetchPreviousChatsByGroupId = createAsyncThunk<
  Message[], // return type
  number, // argument to the thunk (we're not passing any)
  { rejectValue: string } // reject type
>(
  "chatSlice/fetchPreviousChatsByGroupIdByGroupId",
  async (groupId, { rejectWithValue }) => {
    // console.log("token" + sessionStorage.getItem("SERVER_KEY"));
    try {
      const payload = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": sessionStorage.getItem("SERVER_KEY") || "",
        },
      };
      const response = await fetch(
        `${sessionStorage.getItem(
          "API_BASE_URL"
        )}/getAllPreviousMessages/${groupId}`,
        payload
      );

      const responseData = await response.json();
      if (response.ok) {
        return responseData.data;
      } else {
        return rejectWithValue(
          "message" in responseData
            ? responseData.message
            : response.status.toString()
        );
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch chats");
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
      .addCase(fetchPreviousChatsByGroupId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreviousChatsByGroupId.fulfilled, (state, action) => {
        state.loading = false;
        state.chatData = action.payload;
      })
      .addCase(fetchPreviousChatsByGroupId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// Action creators are generated for each case reducer function
export const { setPreviousChats, setNewChat } = chatSlice.actions;

export default chatSlice.reducer;

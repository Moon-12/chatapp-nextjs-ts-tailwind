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
  error: string | null;
  chatGroupId: number | null;
}

const initialState: ChatState = {
  chatData: [],
  loading: false,
  error: null,
  chatGroupId: null,
};

interface FetchChatsResponse {
  data: Message[];
  groupId: number;
}

export const fetchPreviousChatsByGroupId = createAsyncThunk<
  FetchChatsResponse, // return type
  { groupId: number; loggedInUser: string }, // argument to the thunk (we're not passing any)
  { rejectValue: string } // reject type
>(
  "chatSlice/fetchPreviousChatsByGroupId",
  async ({ groupId, loggedInUser }, { rejectWithValue }) => {
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
        )}/getAllPreviousMessages/${groupId}/${loggedInUser}`,
        payload
      );

      const responseData = await response.json();
      if (response.ok) {
        return { data: responseData.data, groupId };
      } else {
        return rejectWithValue(
          "message" in responseData
            ? responseData.message
            : response.status.toString()
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch chats");
      } else {
        throw new Error("An unknown error occurred while loading chats");
      }
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setPreviousChats: (
      state,
      action: { payload: { data: Message[]; groupId: number } }
    ) => {
      state.chatData = action.payload.data;
      state.chatGroupId = action.payload.groupId;
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
        state.chatData = action.payload.data;
        state.chatGroupId = action.payload.groupId;
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

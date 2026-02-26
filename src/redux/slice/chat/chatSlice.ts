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
  error: { message: string; status: number } | null;
  chatGroupId: number | null;
  sendMessageStatus: string;
}

const initialState: ChatState = {
  chatData: [],
  loading: false,
  error: null,
  chatGroupId: null,
  sendMessageStatus: "",
};

interface FetchChatsResponse {
  data: Message[];
  groupId: number;
}

interface sendMessageResponse {
  message: string;
}

export const sendMessage = createAsyncThunk<
  sendMessageResponse, // return type
  { message: Message }, // argument to the thunk (we're not passing any)
  { rejectValue: { message: string; status: number } } // reject type
>("chatSlice/sendMessage", async ({ message }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${sessionStorage.getItem("API_BASE_URL")}/postMessageToGroup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      },
    );

    const responseData = await response.json();
    if (response.ok) {
      return { message: responseData.message };
    } else {
      return rejectWithValue(
        "message" in responseData
          ? responseData.message
          : response.status.toString(),
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Failed to fetch chats");
    } else {
      throw new Error("An unknown error occurred while loading chats");
    }
  }
});

export const fetchPreviousChatsByGroupId = createAsyncThunk<
  FetchChatsResponse, // return type
  { groupId: number }, // argument to the thunk (we're not passing any)
  { rejectValue: { message: string; status: number } } // reject type
>(
  "chatSlice/fetchPreviousChatsByGroupId",
  async ({ groupId }, { rejectWithValue }) => {
    const response = await fetch(
      `/chat-app/api/getAllPreviousMessages?&group_id=${groupId}`,
    );
    const responseJson = await response.json();
    if (!response.ok) {
      return rejectWithValue({
        message: responseJson.message,
        status: response.status,
      });
    }

    return {data:responseJson.data,groupId};
  },
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setPreviousChats: (
      state,
      action: { payload: { data: Message[]; groupId: number } },
    ) => {
      state.chatData = action.payload.data;
      state.chatGroupId = action.payload.groupId;
    },
    setNewChat: (state, action) => {
      state.chatData.push(action.payload);
    },
    clearError(state) {
      state.error = null;
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
        state.error = action.payload || {
          message: "Something went wrong",
          status: 500,
        };
      });
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.sendMessageStatus = action.payload.message;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Something went wrong",
          status: 500,
        };
      });
  },
});

// Action creators are generated for each case reducer function
export const { setPreviousChats, setNewChat, clearError } = chatSlice.actions;

export default chatSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface chatGroup {
  id: number;
  name: string;
  activeAccess: string;
}

export interface ChatGroupState {
  chatGroupData: chatGroup[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatGroupState = {
  chatGroupData: [],
  loading: false,
  error: null,
};

export const fetchAllChatGroups = createAsyncThunk<
  chatGroup[], // return type
  void, // argument to the thunk (we're not passing any)
  { rejectValue: string } // reject type
>("chatGroupSlice/fetchAllChatGroups", async (_, { rejectWithValue }) => {
  // console.log("token" + sessionStorage.getItem("SERVER_KEY"));
   const response = await fetch("/chat-app/api/getAllChatGroups");

    const responseJson = await response.json();
    if (!response.ok) {
      return rejectWithValue(responseJson.message);
    }
    return responseJson.data;
});

export const chatGroupSlice = createSlice({
  name: "chatGroup",
  initialState,
  reducers: {
    setChatGroups: (state, action) => {
      state.chatGroupData = action.payload;
    },
    updateGroupAccessStatus: (state, action) => {
      const { groupId, newStatus } = action.payload;
      const group = state.chatGroupData.find((grp) => grp.id === groupId);
      if (group) {
        group.activeAccess = newStatus;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllChatGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllChatGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.chatGroupData = action.payload;
      })
      .addCase(fetchAllChatGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// Action creators are generated for each case reducer function
export const { setChatGroups, updateGroupAccessStatus, clearError } =
  chatGroupSlice.actions;

export default chatGroupSlice.reducer;

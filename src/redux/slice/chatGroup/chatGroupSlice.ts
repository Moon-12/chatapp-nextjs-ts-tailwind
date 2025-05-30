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
  { loggedInUser: string }, // argument to the thunk (we're not passing any)
  { rejectValue: string } // reject type
>(
  "chatGroupSlice/fetchAllChatGroups",
  async ({ loggedInUser }, { rejectWithValue }) => {
    // console.log("token" + sessionStorage.getItem("SERVER_KEY"));
    try {
      const response = await fetch(
        `${sessionStorage.getItem(
          "API_BASE_URL"
        )}/getAllChatGroups?user_id=${loggedInUser}`
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
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch groups");
      } else {
        throw new Error("An unknown error occurred while loading groups");
      }
    }
  }
);

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
export const { setChatGroups, updateGroupAccessStatus } =
  chatGroupSlice.actions;

export default chatGroupSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface chatGroup {
  id?: number;
  name: string;
}

export interface ChatGroupState {
  chatGroupData: chatGroup[];
  loading: boolean;
  error: {} | null;
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
  try {
    const payload = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": "testchatapp",
      },
    };
    console.log(payload);
    const response = await fetch(
      `${sessionStorage.getItem("API_BASE_URL")}/getAllChatGroups`,
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
    return rejectWithValue(error.message || "Failed to fetch groups");
  }
});

export const chatGroupSlice = createSlice({
  name: "chatGroup",
  initialState,
  reducers: {
    setChatGroups: (state, action) => {
      state.chatGroupData = action.payload;
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
export const { setChatGroups } = chatGroupSlice.actions;

export default chatGroupSlice.reducer;

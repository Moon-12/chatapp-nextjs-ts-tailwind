import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface joinGroupState {
  joinGroupStatus: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: joinGroupState = {
  joinGroupStatus: null,
  loading: false,
  error: null,
};

export const joinGroup = createAsyncThunk<
  string, // return type
  { groupId: number }, // argument to the thunk (we're not passing any)
  { rejectValue: string } // reject type
>("joinGroupSlice/joinGroup", async ({ groupId }, { rejectWithValue }) => {
  // consle.log("token" + sessionStorage.getItem("SERVER_KEY"));

  const response = await fetch("/chat-app/api/joinGroup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ groupId }),
  });

  const data = await response.json();
  console.log("/chat-app/api/joinGroup", data);

  if (!response.ok) {
    return rejectWithValue(data.message || "Failed to join group");
  }

  return data.message;
});

export const joinGroupSlice = createSlice({
  name: "chatGroup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(joinGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.joinGroupStatus = action.payload;
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// Action creators are generated for each case reducer function

export default joinGroupSlice.reducer;

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
  { loggedInUser: string; groupId: number }, // argument to the thunk (we're not passing any)
  { rejectValue: string } // reject type
>(
  "joinGroupSlice/joinGroup",
  async ({ loggedInUser, groupId }, { rejectWithValue }) => {
    // console.log("token" + sessionStorage.getItem("SERVER_KEY"));
    try {
      const response = await fetch(
        `${sessionStorage.getItem("API_BASE_URL")}/joinGroup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUser, groupId }),
        }
      );

      const responseData = await response.json();
      if (response.ok) {
        return responseData.message;
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

import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  loggedInUser: string | null;
  loading: boolean;
  error: {} | null;
}

const initialState: UserState = {
  loggedInUser: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoggedInUser } = userSlice.actions;

export default userSlice.reducer;

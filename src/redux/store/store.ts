import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../slice/chat/chatSlice";
import chatGroupReducer from "../slice/chatGroup/chatGroupSlice";
import joinGroupReducer from "../slice/joinGroup/joinGroupSlice";
import userReducer from "../slice/user/userSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  chat: chatReducer,
  chatGroup: chatGroupReducer,
  user: userReducer,
  joinGroup: joinGroupReducer,
  // other reducers..
});

export const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../slice/chat/chatSlice";
import chatGroupReducer from "../slice/chatGroup/chatGroupSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    chatGroup: chatGroupReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

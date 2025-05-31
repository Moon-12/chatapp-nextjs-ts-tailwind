import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../slice/chat/chatSlice";
import chatGroupReducer from "../slice/chatGroup/chatGroupSlice";
import joinGroupReducer from "../slice/joinGroup/joinGroupSlice";
import userReducer from "../slice/user/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  chat: chatReducer,
  chatGroup: chatGroupReducer,
  user: userReducer,
  joinGroup: joinGroupReducer,
  // other reducers...
});

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["user"], // persist only this reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// useStomp.ts
"use client";
import { Message, setNewChat } from "@/redux/slice/chat/chatSlice";
import {
  initializeStompClient,
  cleanupStompClient,
  sendMessage,
} from "@/socket/stompClient";
import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

export const useStomp = () => {
  const dispatch = useDispatch();

  const messageCallback = useCallback(
    (message: Message) => {
      dispatch(setNewChat(message));
    },
    [dispatch]
  );

  useEffect(() => {
    initializeStompClient(messageCallback);
    return () => cleanupStompClient(messageCallback);
  }, [messageCallback]);

  return { sendMessage: useCallback(sendMessage, []) };
};

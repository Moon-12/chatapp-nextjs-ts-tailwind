"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Message, setPreviousChats } from "@/redux/slice/chat/chatSlice";

const InitialDataLoader = ({ initialData }: { initialData: Message[] }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData) {
      dispatch(setPreviousChats(initialData));
    }
  }, [dispatch, initialData]);

  return null;
};

export default InitialDataLoader;

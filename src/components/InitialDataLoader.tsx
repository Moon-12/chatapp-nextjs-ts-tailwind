"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Message, setPreviousChats } from "@/redux/slice/chat/chatSlice";

const InitialDataLoader = ({
  initialData,
  url,
}: {
  initialData: Message[];
  url: string;
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    sessionStorage.setItem("SOCKET_URL", url);
  }, []);

  useEffect(() => {
    if (initialData) {
      dispatch(setPreviousChats(initialData));
    }
  }, [dispatch, initialData]);

  return null;
};

export default InitialDataLoader;

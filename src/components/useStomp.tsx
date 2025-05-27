// hooks/useStomp.ts
import { Message, setNewChat } from "@/redux/slice/chat/chatSlice";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SockJS from "sockjs-client";

export const useStomp = () => {
  const [stompClient, setStompClient] = useState<Client | undefined>(undefined);
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = new SockJS(
      `${sessionStorage.getItem("API_BASE_URL")}/activeMessageListener`
    );
    const stompClient = new Client({
      webSocketFactory: () => socket,
    });
    stompClient.activate();

    stompClient.onConnect = () => {
      setStompClient(stompClient);
      stompClient.subscribe("/topic/chat", (message) => {
        dispatch(setNewChat(JSON.parse(message.body)));
      });
    };

    stompClient.onWebSocketError = function (event) {
      throw new Error(event);
      // Handle WebSocket error
    };
  }, []);

  const sendMessage = (message: Message) => {
    stompClient?.publish({
      destination: "/app/postMessage",
      body: JSON.stringify(message),
    });
  };
  return { sendMessage };
};

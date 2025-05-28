// lib/stompClient.ts
import { Message } from "@/redux/slice/chat/chatSlice";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const stompSingleton = {
  client: null as Client | null,
  subscription: null as StompSubscription | null,
  connected: false,
  referenceCount: 0,
  callbacks: new Set<(message: Message) => void>(),
};

export const initializeStompClient = (callback: (message: Message) => void) => {
  stompSingleton.referenceCount += 1;
  stompSingleton.callbacks.add(callback);

  if (stompSingleton.client && stompSingleton.connected) {
    return;
  }

  const socket = new SockJS(
    `${sessionStorage.getItem("API_BASE_URL")}/activeMessageListener`
  );
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    // debug: (str) => console.log("[STOMP DEBUG]:", str),
  });

  client.onConnect = () => {
    //console.log("STOMP connected");
    stompSingleton.connected = true;
    if (!stompSingleton.subscription) {
      stompSingleton.subscription = client.subscribe(
        "/topic/chat",
        (message: IMessage) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            //console.log("Received message:", parsedMessage);
            stompSingleton.callbacks.forEach((cb) => cb(parsedMessage));
          } catch (error) {
            console.error("Failed to parse message:", error);
          }
        }
      );
      console.log("Subscribed to /topic/chat");
    }
  };

  client.onStompError = () => {
    //console.error("STOMP error:", frame.headers["message"]);
    stompSingleton.connected = false;
  };

  client.onWebSocketError = () => {
    //console.error("WebSocket error:", event);
    stompSingleton.connected = false;
  };

  client.onDisconnect = () => {
    //console.log("STOMP disconnected");
    stompSingleton.connected = false;
    if (stompSingleton.subscription) {
      stompSingleton.subscription.unsubscribe();
      stompSingleton.subscription = null;
      // console.log("Unsubscribed from /topic/chat");
    }
  };

  client.activate();
  stompSingleton.client = client;
};

export const sendMessage = (message: Message) => {
  if (stompSingleton.client?.connected) {
    stompSingleton.client.publish({
      destination: "/app/postMessage",
      body: JSON.stringify(message),
    });
    // console.log("Message sent:", message);
  } else {
    // console.warn("STOMP client not connected.");
  }
};

export const cleanupStompClient = (callback: (message: Message) => void) => {
  stompSingleton.callbacks.delete(callback);
  stompSingleton.referenceCount -= 1;
  if (stompSingleton.referenceCount === 0 && stompSingleton.client) {
    stompSingleton.client.deactivate();
    stompSingleton.client = null;
    stompSingleton.connected = false;
    stompSingleton.subscription = null;
    // console.log("STOMP client deactivated and cleaned up");
  }
};

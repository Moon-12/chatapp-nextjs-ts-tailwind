"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { sendMessage } from "@/redux/slice/chat/chatSlice";

export default function Chat({ myCreatedBy }: { myCreatedBy: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => state.chat.chatData);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = {
        message: input,
        createdBy: myCreatedBy,
        createdAt: Date.now(),
      };
      dispatch(sendMessage(newMessage));
      setInput("");
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100">
      <div className="bg-green-600 text-white p-4 text-center">
        <h1 className="text-xl font-bold">Chat App</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages &&
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.createdBy === myCreatedBy ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-end space-x-2">
                {msg.createdBy !== myCreatedBy && (
                  <div className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                    {msg.createdBy}
                  </div>
                )}
                <div
                  className={`${
                    msg.createdBy === myCreatedBy
                      ? "bg-blue-500"
                      : "bg-green-500"
                  } text-white p-3 rounded-lg max-w-xs relative ${
                    msg.createdBy === myCreatedBy
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
                {msg.createdBy === myCreatedBy && (
                  <div className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                    You
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTimestamp(msg.createdAt)}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && handleSend(e)
            }
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            disabled={!myCreatedBy}
            onClick={handleSend}
            className={`${
              !myCreatedBy && "cursor-not-allowed opacity-40"
            } bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

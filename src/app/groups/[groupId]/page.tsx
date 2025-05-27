"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useStomp } from "@/components/useStomp";

export default function ChatPage() {
  const initialMessages = useSelector(
    (state: RootState) => state.chat.chatData
  );
  const loggedInUser = useSelector(
    (state: RootState) => state.user.loggedInUser
  );
  const [inputText, setInputText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useStomp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [initialMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      const newMessage = {
        message: inputText,
        createdBy: loggedInUser,
        createdAt: Date.now(),
      };
      sendMessage(newMessage);
      setInputText("");
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
      <div className="bg-[#c9e5c0] text-white p-4 text-center">
        <h1 className="text-xl font-bold">Chat App</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {initialMessages.length > 0 ? (
          initialMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.createdBy === loggedInUser ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-end space-x-2">
                {msg.createdBy !== loggedInUser && (
                  <div className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                    {msg.createdBy}
                  </div>
                )}
                <div
                  className={`${
                    msg.createdBy === loggedInUser
                      ? "bg-blue-500"
                      : "bg-green-500"
                  } text-white p-3 rounded-lg max-w-xs relative ${
                    msg.createdBy === loggedInUser
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
                {msg.createdBy === loggedInUser && (
                  <div className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                    You
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTimestamp(msg.createdAt)}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No new messages, say Hello to get started
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputText(e.target.value)
            }
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && handleSend(e)
            }
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            disabled={!inputText || !loggedInUser}
            onClick={handleSend}
            className={`${
              (!loggedInUser || !inputText) && "cursor-not-allowed opacity-40"
            } bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

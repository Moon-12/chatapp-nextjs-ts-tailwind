"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { addMessage } from "@/redux/slice/chat/chatSlice";

export default function Chat() {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.chatData);
  const [input, setInput] = useState<string>("");
  const [mycreatedBy, setMycreatedBy] = useState<string>("Ashwi");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // onInit(){
  //   setSendId(()=>fetch("username","password"));
  // }
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
        createdBy: mycreatedBy,
        createdAt: Date.now(),
      };
      dispatch(addMessage(newMessage));
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100">
      <div className="bg-green-600 text-white p-4 text-center">
        <h1 className="text-xl font-bold"> Chat App</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages &&
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.createdBy === mycreatedBy ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  msg.createdBy === mycreatedBy ? "bg-blue-500" : "bg-green-500"
                } text-white p-3 rounded-lg max-w-xs`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white ">
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
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

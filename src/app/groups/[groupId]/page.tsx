"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useAppDispatch } from "@/redux/hooks";
import {
  fetchPreviousChatsByGroupId,
  sendMessage,
  setNewChat,
  clearError,
} from "@/redux/slice/chat/chatSlice";
import { useParams } from "next/navigation";
import isAuth from "@/components/isAuth";
import { toast } from "react-toastify";
import { FaEllipsisV, FaArrowLeft } from "react-icons/fa";
import { clearSession } from "@/utils/getUserSession";

const ChatPage = () => {
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null); // Ref for the three dots button
  const menuRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ groupId: string }>();
  const groupId =
    params.groupId && !isNaN(parseInt(params.groupId, 10))
      ? parseInt(params.groupId, 10)
      : null;
  const { chatData: initialMessages, error } = useSelector(
    (state: RootState) => state.chat
  );

  const loggedInUser = useSelector(
    (state: RootState) => state.user.loggedInUser
  );
  const [inputText, setInputText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const { sendMessage } = useStomp();
  const dispatch = useAppDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const connectToSSE = (eventSource: EventSource) => {
    // Handle chat messages (default message event)
    eventSource.onmessage = (event) => {
      console.log("tweet", event.data);
    };

    // Handle new message event
    eventSource.addEventListener("newMessage", (event) => {
      dispatch(setNewChat(JSON.parse(event.data)));
    });

    eventSource.onerror = () => {
      eventSource.close();
      throw new Error("connection error");
    };
  };

  useEffect(() => {
    if (groupId && loggedInUser) {
      dispatch(fetchPreviousChatsByGroupId({ groupId, loggedInUser }));

      // Connect to SSE endpoint
      const eventSource = new EventSource(
        `${sessionStorage.getItem(
          "API_BASE_URL"
        )}/getLatestMessage?group_id=${groupId}&user_id=${loggedInUser}`
      );
      connectToSSE(eventSource);

      // Cleanup on component unmount
      return () => {
        eventSource.close();
      };
    }
  }, [groupId, loggedInUser, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [initialMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && loggedInUser && groupId) {
      const newMessage = {
        message: inputText,
        createdBy: loggedInUser,
        createdAt: Date.now(),
        groupId,
      };
      dispatch(sendMessage({ message: newMessage }));
      setInputText("");
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100">
      <div className="bg-[#006241] text-white p-4 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="text-white text-lg font-bold"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold sticky">Chat App</h1>

        <div className="relative ml-3">
          <button
            type="button"
            className="p-1 text-white focus:outline-none"
            aria-expanded="false"
            aria-haspopup="true"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            ref={menuButtonRef}
          >
            <FaEllipsisV size={18} />
          </button>

          {/* Menu inside same relative container */}
          {showProfileMenu && (
            <div
              id="user-menu"
              className="absolute right-0 z-10 rounded-md w-30  origin-top-right bg-white py-1 shadow-lg focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              ref={menuRef}
            >
              <button
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                onClick={clearSession}
              >
                Logout
              </button>
            </div>
          )}
        </div>
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
                      ? "bg-gray-300 text-black"
                      : "bg-[#006241] text-white "
                  } p-3 rounded-lg max-w-xs relative ${
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
            } bg-[#006241] text-white px-4 py-2 rounded-lg hover:bg-[#006241]-600`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default isAuth(ChatPage);

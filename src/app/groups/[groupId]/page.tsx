"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useAppDispatch } from "@/redux/hooks";
import {
  fetchPreviousChatsByGroupId,
  sendMessage,
  setNewChat,
} from "@/redux/slice/chat/chatSlice";
import { useParams } from "next/navigation";
import { FaEllipsisV, FaArrowLeft } from "react-icons/fa";
import LoadingComponent from "@/app/loading";
import { useAppSession } from "@/context/SessionContext";

const ChatPage = () => {
  const { session, status } = useAppSession();
  const loggedInUser = session?.user?.email || "";
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null); // Ref for the three dots button
  const menuRef = useRef<HTMLDivElement>(null);
  const params = useParams<{ groupId: string }>();
  const groupId =
    params.groupId && !isNaN(parseInt(params.groupId, 10))
      ? parseInt(params.groupId, 10)
      : null;
  const {
    chatData: initialMessages,
    error,
    loadingInitial,
  } = useSelector((state: RootState) => state.chat);

  const [inputText, setInputText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const { sendMessage } = useStomp();
  const dispatch = useAppDispatch();
  const fatalErrorRef = useRef(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!groupId) return;

    fatalErrorRef.current = false; // reset on groupId change

    dispatch(fetchPreviousChatsByGroupId({ groupId })).then((result) => {
      // If fetch failed with a fatal error, mark it
      if (fetchPreviousChatsByGroupId.rejected.match(result)) {
        const status = result.payload?.status;
    if (status && status >= 400 && status < 500) {
          fatalErrorRef.current = true; // tops SSE from reconnecting
        }
      }
    });

    let eventSource: EventSource;
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let isUnmounted = false; // tracks if component is gone

    const connect = () => {
      if (isUnmounted) return; // don't reconnect if user navigated away

      eventSource = new EventSource(
        `/chat-app/api/sse/messages?group_id=${groupId}`,
      );

      eventSource.onopen = () => {
        console.log("SSE connected");
      };

      eventSource.addEventListener("newMessage", (event) => {
        dispatch(setNewChat(JSON.parse(event.data)));
      });

      eventSource.onerror = (err) => {
        console.warn("SSE dropped, reconnecting in 3s...", err);
        eventSource.close(); //clean up the dead connection

        if (!isUnmounted && !fatalErrorRef.current) {
          reconnectTimeout = setTimeout(connect, 3000); //try again in 3s
        }
      };
    };

    connect(); // initial connection

    return () => {
      isUnmounted = true; // prevent reconnect after unmount
      clearTimeout(reconnectTimeout); // cancel any pending reconnect
      eventSource?.close(); // clean up open connection
    };
  }, [groupId, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [initialMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && groupId) {
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

  if (error) {
    let title = "Error";
    let message = error.message;

    if (error.status === 401) {
      title = "Not Logged In";
      message = "Please log in to access this chat.";
    }

    if (error.status === 403) {
      title = "Not Authorized";
      message = "You are not allowed to access this chat group.";
    }

    if (error.status === 404) {
      title = "Group Not Found";
      message = "This chat group does not exist.";
    }

    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm">
          <h2 className="text-xl font-semibold text-red-600 mb-2">{title}</h2>
          <p className="text-gray-600">{message}</p>

          <button
            onClick={() => window.history.back()}
            className="mt-6 bg-[#006241] text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loadingInitial ? (
          <div className="flex items-center justify-center h-full">
            <LoadingComponent />
          </div>
        ) : initialMessages && initialMessages.length > 0 ? (
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
            disabled={!inputText}
            onClick={handleSend}
            className={`${
              !inputText && "cursor-not-allowed opacity-40"
            } bg-[#006241] text-white px-4 py-2 rounded-lg hover:bg-[#006241]-600`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

"use client";

import { useState, useEffect } from "react";
import Chat from "./chat";
import { login } from "@/app/actions/login";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const ModalPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Show modal when component mounts
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleSubmit = () => {
    // Close modal handler
    login(password)
      .then((res) => {
        if (res.isSuccess) {
          //close modal
          setIsOpen(false);
          toast.success(res.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <Chat myCreatedBy={inputValue} />
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Welcome to Group Chat
            </h2>
            <p className="text-gray-600 mb-4">UserName</p>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-600 mb-4">Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Name"
              className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSubmit}
              disabled={!password || !inputValue}
              className={`${
                (!inputValue || !password) && "cursor-not-allowed opacity-40"
              } w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200`}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalPopup;

"use client";

import { useState, useEffect } from "react";
import Chat from "./chat";

const ModalPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  // Show modal when component mounts
  useEffect(() => {
    setIsOpen(true);
  }, []);

  // Close modal handler
  const closeModal = (): void => {
    setIsOpen(false);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Welcome to Group Chat
            </h2>
            <p className="text-gray-600 mb-4">Enter your name</p>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={closeModal}
              disabled={!inputValue}
              className={`${
                !inputValue && "cursor-not-allowed opacity-40"
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

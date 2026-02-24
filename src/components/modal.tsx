"use client";

import { useState, useEffect } from "react";
import { login } from "@/app/actions/login";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Image from "next/image";
import backgroundBlur from "../../assets/images/blurBackground.png";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { setLoggedInUser } from "@/redux/slice/user/userSlice";

const ModalPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Show modal when component mounts
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleSubmit = () => {
    sessionStorage.setItem("SERVER_KEY", password);
    // Close modal handler
    login(password)
      .then((res) => {
        if (res.isSuccess) {
          //close modal
          setIsOpen(false);
          toast.success(res.message);
          dispatch(setLoggedInUser(inputValue));
          router.push("/groups");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Login Error", {
          autoClose: 3000,
        });
      });
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <div className="flex h-screen max-w-md mx-auto bg-gray-100">
        <Image
          src={backgroundBlur}
          alt="Background"
          sizes="100vw"
          className="object-center"
          priority
        />
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent ">
          <div className="bg-white bg-opacity-10 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
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
              placeholder="Password"
              className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSubmit}
              disabled={!password || !inputValue}
              className={`${
                (!inputValue || !password) && "cursor-not-allowed opacity-40"
              } w-full bg-[#00A877] text-white py-2 px-4 rounded hover:bg-[#006241] transition duration-200`}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalPopup;

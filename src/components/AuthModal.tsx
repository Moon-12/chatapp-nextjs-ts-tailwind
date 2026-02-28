"use client";

import { useEffect, useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import Image from "next/image";
import backgroundBlur from "../../assets/images/blurBackground.png";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { InputField } from "./InputField";

import { useRouter } from "next/navigation";
import { useAppSession } from "@/context/SessionContext";
import logo from "../../assets/images/chat_logo.png";

const AuthModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigated = useRef(false);
  const router = useRouter();
  const { status } = useAppSession();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
  });
  useEffect(() => {
    console.log("welcome page inside effect");
    if (status === "authenticated" && !navigated.current) {
      navigated.current = true; // mark as navigated
      router.push("/groups"); // navigate once
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validation
  const validate = () => {
    if (!form.email || !form.password || (!isLogin && !form.userName)) {
      toast.error("Please fill all required fields");
      return false;
    }
    if (!isLogin && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!isLogin && form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    if (!validate()) return;
    e.preventDefault();

    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) toast.error(res.error);
    else {
      toast.success("Login successful");
      setIsOpen(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    if (!validate()) return;
    e.preventDefault();

    try {
      const res = await fetch(`/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.userName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) toast.error(data.message || "Signup failed");
      else {
        toast.success("Signup successful! Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background Image */}
      <div className="flex h-screen max-w-md mx-auto relative">
        <Image
          src={backgroundBlur}
          alt="Background"
          sizes="100vw"
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg" />
      </div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl max-w-md w-full p-6 relative">
          {/* Title */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Image src={logo} alt="Grouply logo" width={32} height={32} />
            <h1 className="text-2xl font-bold text-gray-800">Grouply</h1>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <form
            onSubmit={isLogin ? handleLogin : handleSignup}
            className="flex flex-col gap-5"
          >
            {/* Username */}
            {!isLogin && (
              <InputField
                label="Username"
                name="userName"
                value={form.userName}
                onChange={handleChange}
              />
            )}

            {/* Email */}
            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />

            {/* Password */}
            <div className="relative mt-5">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder=" "
                value={form.password}
                onChange={handleChange}
                required
                className="
                peer w-full px-4 pt-6 pb-2
                bg-white/60 border border-gray-300
                rounded-xl focus:outline-none
                focus:ring-2 focus:ring-[#00A877]
                focus:border-[#00A877]
                transition-all
              "
              />
              <label
                className="
              absolute left-4 top-2 text-sm text-gray-500
              peer-placeholder-shown:top-4
              peer-placeholder-shown:text-base
              peer-placeholder-shown:text-gray-400
              peer-focus:top-2
              peer-focus:text-sm
              peer-focus:text-[#00A877]
              transition-all duration-200
            "
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500 hover:text-black"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
              w-full mt-8
              bg-gradient-to-r from-[#00A877] to-[#006241]
              text-white py-3 rounded-xl
              font-semibold shadow-lg
              hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200
              flex justify-center items-center gap-2
            "
            >
              {isLogin ? "Login" : "Sign Up"}
              {loading && <FaSpinner className="animate-spin h-4 w-4" />}
            </button>
          </form>
          {/* Switch Mode */}
          <p className="text-center mt-6 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#00A877] font-semibold cursor-pointer ml-1 hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthModal;

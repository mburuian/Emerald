"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type LoginModalProps = {
  onCloseAction: () => void;
};

export default function LoginModal({ onCloseAction }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔐 Email/Password login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onCloseAction();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login error:", err.message);
        setError("Invalid email or password.");
      } else {
        console.error("Unknown login error:", err);
        setError("Something went wrong.");
      }
    }
  };

  // 🔐 Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onCloseAction();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Google login error:", err.message);
        alert("Google login failed: " + err.message);
      } else {
        console.error("Google login error:", err);
        alert("Google login failed due to an unknown error.");
      }
    }
  };

  // 🔐 Password reset
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email above to receive a password reset link.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Error: " + err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#6a4a2e]">🔐 Secure Login</h2>
          <button
            onClick={onCloseAction}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>

        <div className="mb-4 text-right">
          <button
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#6a4a2e] hover:bg-[#4b2e19] text-white py-2 rounded text-lg font-semibold transition"
        >
          Login
        </button>

        <div className="my-6 text-center text-gray-400">or continue with</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

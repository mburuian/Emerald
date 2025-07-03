"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  const router = useRouter();

  const checkUsernameAvailability = async (name: string) => {
    setUsernameChecking(true);
    try {
      const q = query(collection(db, "users"), where("username", "==", name.trim()));
      const snapshot = await getDocs(q);
      setIsUsernameAvailable(snapshot.empty);
    } catch (err) {
      console.error("Error checking username:", err);
      setIsUsernameAvailable(null);
    }
    setUsernameChecking(false);
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (value.trim().length >= 3) {
      await checkUsernameAvailability(value);
    } else {
      setIsUsernameAvailable(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUsernameAvailable === false) {
      alert("Username is already taken. Please choose another.");
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        fullName: fullName.trim(),
        username: username.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        role: email.trim() === ADMIN_EMAIL ? "admin" : "user",
        createdAt: new Date(),
      });

      router.push(email.trim() === ADMIN_EMAIL ? "/admin/blog-post" : "/blog");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error occurred.";
      alert("Registration failed: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#fefefe] to-[#f5f5f5] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-[#4b2e19] mb-6">Create Your Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6a4a2e]"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Username</label>
            <input
              type="text"
              placeholder="yourname123"
              minLength={3}
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6a4a2e]"
              value={username}
              onChange={handleUsernameChange}
              required
            />
            {usernameChecking && <p className="text-sm text-yellow-500 mt-1">Checking availability...</p>}
            {isUsernameAvailable === true && <p className="text-sm text-green-600 mt-1">✅ Username is available</p>}
            {isUsernameAvailable === false && <p className="text-sm text-red-600 mt-1">❌ Username already taken</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              placeholder="07xx xxx xxx"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6a4a2e]"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6a4a2e]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#6a4a2e]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || isUsernameAvailable === false}
            className="w-full bg-[#6a4a2e] text-white py-2 rounded hover:bg-[#4b2e19] transition font-medium"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

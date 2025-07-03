"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import LoginModal from "./LoginModal";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      const adminEmail = ADMIN_EMAIL?.toLowerCase().trim();
      const userEmail = currentUser?.email?.toLowerCase().trim();

      console.log("Logged in as:", userEmail);
      console.log("Admin should be:", adminEmail);

      if (userEmail && adminEmail && userEmail === adminEmail) {
        setRole("admin");
      } else if (userEmail) {
        setRole("user");
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setRole(null);
    router.push("/");
  };

  return (
    <>
      <nav className="bg-[#6a4a2e] text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Emerald</Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/#About" className="hover:text-gray-300">About</Link>
            <Link href="/#services" className="hover:text-gray-300">Services</Link>
            <Link href="/blog" className="hover:text-gray-300">Blog</Link>

            {role === "admin" && (
  <>
    <Link href="/admin" className="hover:text-gray-300">Admin</Link>
    <Link href="/certificate" className="hover:text-gray-300">Certificate</Link>
  </>
)}


            {user ? (
              <div className="relative group">
                <button className="hover:text-gray-300">Profile ▾</button>
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg hidden group-hover:block z-50">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={() => setShowLoginModal(true)} className="hover:text-gray-300">Login</button>
                <Link href="/register" className="hover:text-gray-300">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2 px-4">
            <Link href="/" className="block hover:text-gray-300">Home</Link>
            <Link href="/about" className="block hover:text-gray-300">About</Link>
            <Link href="/services" className="block hover:text-gray-300">Services</Link>
            <Link href="/blog" className="block hover:text-gray-300">Blog</Link>

            {role === "admin" && (
  <>
    <Link href="/admin" className="hover:text-gray-300">Admin</Link>
    <Link href="/certificate" className="hover:text-gray-300">Certificate</Link>
  </>
)}

            {user ? (
              <>
                <Link href="/profile" className="block hover:text-gray-300">Profile</Link>
                <button onClick={handleLogout} className="block text-left w-full hover:text-gray-300">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => setShowLoginModal(true)} className="block hover:text-gray-300">Login</button>
                <Link href="/register" className="block hover:text-gray-300">Register</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onCloseAction={() => setShowLoginModal(false)} />
      )}
    </>
  );
}

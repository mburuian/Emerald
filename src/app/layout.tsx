// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { AuthProvider } from './components/authcontext';
import Navbar from './components/Navbar';
import Link from 'next/link';



export const metadata: Metadata = {
  title: 'Emerald Counselling',
  description: 'Transforming lives through compassionate support.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between bg-white text-gray-800 font-sans">
        <AuthProvider>
          {/* Header Section */}
<header className="relative bg-[#4b2e19] text-white shadow-md min-h-screen">
  <Navbar /> {/* Add this line here */}
  <div className="grid grid-cols-1 md:grid-cols-3 h-full min-h-screen">
    <div
      className="col-span-2 bg-cover bg-center h-full"
      style={{ backgroundImage: "url('/ChatGPT Image Jul 2, 2025, 02_42_23 PM.png')" }}
    >
      <div className="h-full w-full bg-black/30"></div>
    </div>

    <div className="flex flex-col justify-center px-16 bg-[#6a4a2e] text-[#f9e6c2] relative">
      <h1 className="text-3xl font-extrabold tracking-wide leading-tight font-serif mb-6 pt-12">
        <span className="text-[#d6a756]">E</span>merald{" "}
        <span className="text-[#d6a756]">C</span>ounselling
      </h1>
      <p className="text-base font-light leading-relaxed font-body max-w-lg">
        You’re not alone — this is your first step towards healing.<br />
        Our team is here to support, listen, and walk with you every step of the way.
      </p>
    </div>
  </div>
</header>


         

<section className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 text-center py-12 px-6 border-b border-yellow-200">
  <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-800 drop-shadow-md">
    Transforming Lives Through Compassionate Support
  </h2>
  <p className="mt-4 max-w-xl mx-auto text-gray-700 text-base md:text-lg leading-relaxed">
    Discover how Emerald Counselling empowers your mental wellness journey with personalized, affordable, and empathetic care.
  </p>
  <div className="mt-8 flex justify-center">
   
 <Link href="/booksession">
  <button className="mt-10 bg-yellow-700 text-white font-semibold px-8 py-3 rounded-md shadow-lg hover:bg-yellow-800 transition">
    Get Started
  </button>
</Link>

  </div>
</section>


          {/* Main content */}
          <main className="flex-grow px-4 py-8 container mx-auto">
            {children}
          </main>

         <footer className="bg-amber-900 text-amber-100 px-6 py-10">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
    
    {/* Logo or Title */}
    <div className="text-center md:text-left">
      <h4 className="text-xl font-bold font-serif text-white">Emerald Counselling</h4>
      <p className="text-sm mt-1">Healing begins here.</p>
    </div>

    {/* Contact Info */}
    <div className="text-center">
      <p className="text-sm">Contact us:</p>
      <a
        href="mailto:emeraldcounselling722@gmail.com"
        className="underline hover:text-yellow-400 block transition-colors duration-200"
      >
        emeraldcounselling722@gmail.com
      </a>
    
    </div>

    {/* Social Media */}
    <div className="text-center">
      <p className="text-sm mb-2">Connect with us</p>
      <div className="flex justify-center md:justify-start space-x-4 text-xl">
        <a
          href="https://wa.me/254716565814"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-400 transition"
          aria-label="WhatsApp"
        >
          <FaWhatsapp />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition"
          aria-label="Facebook"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-300 transition"
          aria-label="Twitter"
        >
          <FaTwitter />
        </a>
      </div>
    </div>
  </div>

  {/* Bottom note */}
  <div className="border-t border-amber-700 mt-8 pt-4 text-center text-xs text-amber-300">
    © {new Date().getFullYear()} Emerald Counselling. All rights reserved.
  </div>
</footer>
        </AuthProvider>
      </body>
    </html>
  );
}

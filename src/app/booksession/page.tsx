"use client";

import { useState } from "react";
import emailjs from "emailjs-com";

export default function BookSession() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      if (result.status === 200) {
        setSent(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("EmailJS Error:", err);
      setError("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Book a Session</h1>
        <p className="text-center text-gray-600 mb-6">
          Each session costs <span className="font-semibold">Ksh 1,000</span>
        </p>

        {sent ? (
          <p className="text-green-600 text-center">✔️ Message sent successfully! We’ll get back to you.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Your Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded text-black"
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded text-black"
            />
            <textarea
              name="message"
              placeholder="Optional Message (e.g. preferred time)"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded text-black"
              required
            />
            {error && <p className="text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? "Sending..." : "Submit Booking"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

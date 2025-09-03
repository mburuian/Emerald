"use client";
import { useState } from "react";

export default function PaymentInstructions() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);

    setTimeout(() => setCopiedField(null), 2000); // Reset after 2s
  };

  const paybill = "247247";
  const accountNumber = "0716 56 58 14";
  const amount = "Ksh 1,000";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          💳 Payment Instructions
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please complete your payment before the session.
        </p>

        {/* Payment Card */}
        <div className="space-y-5">
          {/* Amount */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="font-semibold text-gray-700">Amount:</span>
            <span className="text-green-600 font-bold">{amount}</span>
          </div>

          {/* PayBill */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-semibold text-gray-700">PayBill:</p>
              <p className="text-gray-800 text-lg font-bold">{paybill}</p>
            </div>
            <button
              onClick={() => handleCopy(paybill, "paybill")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition"
            >
              {copiedField === "paybill" ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-semibold text-gray-700">Account Number:</p>
              <p className="text-gray-800 text-lg font-bold">{accountNumber}</p>
            </div>
            <button
              onClick={() => handleCopy(accountNumber, "account")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition"
            >
              {copiedField === "account" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800 text-sm">
            💡 <b>Tip:</b> After making the payment, please wait for confirmation.
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-6 flex justify-center">
          <a
            href="/booksession"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-5 rounded-lg transition"
          >
            ← Back to Booking
          </a>
        </div>
      </div>
    </main>
  );
}

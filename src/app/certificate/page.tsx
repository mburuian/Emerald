"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";

export default function CertificateGenerator() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [date, setDate] = useState('');
  const certificateRef = useRef<HTMLDivElement>(null);

  const getMessage = () => {
    return `In recognition of the successful completion of the marital counselling program. Your commitment, openness, and dedication to nurturing your relationship have been commendable. May this journey strengthen your bond and lead to a harmonious future together.`;
  };

  const downloadPDF = () => {
    if (!certificateRef.current) return;
    html2canvas(certificateRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("certificate.pdf");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-6">
      {/* Inputs Section */}
      <div className="mb-6 max-w-4xl mx-auto bg-white p-6 rounded shadow-lg border border-green-600">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold font-[Cinzel] text-green-800">Certificate Generator</h2>
          <p className="text-gray-600 italic">Fill in the details below</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Recipient Name 1"
            className="border-2 border-green-700 p-2 w-full text-black italic rounded shadow-sm font-medium"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
          />
          <input
            type="text"
            placeholder="Recipient Name 2 (if any)"
            className="border-2 border-green-700 p-2 w-full text-black italic rounded shadow-sm font-medium"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <input
            type="date"
            className="border-2 border-green-700 p-2 w-full text-black italic rounded shadow-sm font-medium"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button
          onClick={downloadPDF}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded mt-6 shadow-md transition"
        >
          Download Certificate
        </button>
      </div>

      {/* Certificate Display */}
      <div
        className="relative max-w-5xl mx-auto bg-white p-12 text-center border-8 border-green-800 rounded-xl shadow-lg"
        ref={certificateRef}
      >
        <Image
          src="/ChatGPT Image Jul 2, 2025, 02_42_23 PM.png"
          alt="Emerald Logo"
          width={200}
          height={100}
          className="mx-auto mb-3"
        />
        <h1 className="text-5xl font-bold mb-2">EMERALD COUNSELLING</h1>
        <p className="text-md text-[#9B4800] tracking-widest font-[Cinzel]">EMERALD GUIDING MINDS. HEALING HEARTS.</p>
        <h1 className="text-5xl mt-4 font-bold text-green-900 tracking-wider">CERTIFICATE</h1>
        <p className="text-2xl font-bold text-gray-800 tracking-widest mt-1">OF COMPLETION</p>

        <p className="italic text-[#9B4800] text-lg mt-4 font-[Playfair Display]">Is Proudly Presented To</p>

        <h2 className="text-4xl text-red-800 italic font-[Great Vibes] mt-4">{name1 || "Recipient Name 1"}</h2>
        {name2 && (
          <>
            <p className="text-xl font-serif mt-1">&</p>
            <h2 className="text-4xl text-red-800 italic font-[Great Vibes]">{name2}</h2>
          </>
        )}

        <div className="border-t-2 border-dashed border-green-700 my-6 w-1/2 mx-auto"></div>

        <p className="mt-6 text-lg max-w-4xl mx-auto italic font-serif text-gray-700 leading-relaxed">
          {getMessage()}
        </p>

        <div className="flex justify-between items-center mt-12">
          <div className="text-left">
            <p className="border-t border-red-800 w-32 mx-auto"></p>
            <p className="text-sm mt-1 font-serif">
              {date ? date.split("-").reverse().join("-") : "01-07-2025"}
            </p>
          </div>
          <div className="w-16 h-16 mx-auto bg-[url('/seal-placeholder.png')] bg-contain bg-no-repeat" />
          <div className="text-right">
            <p className="border-t border-black w-32 mx-auto"></p>
            <p className="text-sm mt-1 font-serif">Counselor</p>
          </div>
        </div>
      </div>
    </div>
  );
}

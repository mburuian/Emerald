import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const bookingRef = await addDoc(collection(db, "bookings"), {
      name,
      email,
      phone,
      message,
      status: "pending",
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true, bookingId: bookingRef.id });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

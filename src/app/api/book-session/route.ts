import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

// ✅ Strongly type the booking request body
interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export async function POST(req: Request) {
  try {
    // ✅ Explicitly cast the parsed JSON to BookingRequest
    const body = (await req.json()) as BookingRequest;
    const { name, email, phone, message } = body;

    // ✅ Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Save booking in Firestore
    const bookingRef = await addDoc(collection(db, "bookings"), {
      name,
      email,
      phone,
      message: message || "",
      status: "pending",
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true, bookingId: bookingRef.id });
  } catch (error: unknown) {
    // ✅ Type-safe error handling
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }

    console.error("Booking API Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

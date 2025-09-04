import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const fileEntry = formData.get("file");

    // ✅ Ensure we have a valid file
    if (!(fileEntry instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No valid file provided" },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${fileEntry.name}`;

    // ✅ Upload file to Supabase bucket
    const { error: uploadError } = await supabase.storage
      .from("blog_media")
      .upload(fileName, fileEntry);

    if (uploadError) throw uploadError;

    // ✅ Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("blog_media")
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to generate file URL");
    }

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    });
  } catch (error: unknown) {
    let message = "Upload failed";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("Upload API Error:", message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import multer from "multer";
import { promisify } from "util";
import stream from "stream";

const pipeline = promisify(stream.pipeline);

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs"; // Required for file uploads

export async function POST(req: Request) {
  try {
    // Get the form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: "emerald-blogs" }, // Folder name in Cloudinary
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      const readable = new stream.PassThrough();
      readable.end(buffer);
      readable.pipe(uploadStream);
    });

    return NextResponse.json({
      success: true,
      url: (result as any).secure_url,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}

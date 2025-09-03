"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FiImage, FiMusic } from "react-icons/fi";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

export default function AdminBlogPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  // ✅ Protect admin route
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        router.push("/");
      }
    });
    return () => unsub();
  }, [router]);

  // ✅ Upload file to Supabase
  const uploadToSupabase = async (file: File) => {
    try {
      setUploadProgress(10);
      const fileName = `${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("blog_media") // ✅ Make sure this bucket exists
        .upload(fileName, file);

      if (error) throw error;

      // ✅ Get public URL correctly
      const { data: publicUrlData } = supabase.storage
        .from("blog_media")
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to fetch file URL");
      }

      setUploadProgress(100);
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file. Check Supabase bucket permissions.");
      return null;
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // ✅ Handle blog submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    setLoading(true);

    try {
      let imageUrl: string | null = null;
      let audioUrl: string | null = null;

      if (imageFile) imageUrl = await uploadToSupabase(imageFile);
      if (audioFile) audioUrl = await uploadToSupabase(audioFile);

      // ✅ Insert blog into Supabase table
      const { error } = await supabase.from("blogs").insert([
        {
          title: title.trim(),
          content: content.trim(),
          image_url: imageUrl,
          audio_url: audioUrl,
          likes: 0,
        },
      ]);

      if (error) throw error;

      alert("🎉 Blog posted successfully!");
      setTitle("");
      setContent("");
      setImageFile(null);
      setAudioFile(null);
      router.push("/blog");
    } catch (err: any) {
      console.error("Blog post failed:", err);
      alert(`Failed to post blog: ${err?.message || err}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">
        Admin: Post a New Blog
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white shadow-md rounded p-6 space-y-4"
      >
        {/* Title */}
        <div>
          <label className="block text-black mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded text-black"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-black mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border rounded text-black"
          />
        </div>

        {/* File Inputs */}
        <div className="flex items-center gap-6 text-black text-xl">
          <label className="cursor-pointer flex items-center gap-2">
            <FiImage />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </label>

          <label className="cursor-pointer flex items-center gap-2">
            <FiMusic />
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* File Previews */}
        {imageFile && <p className="text-sm text-black">🖼 {imageFile.name}</p>}
        {audioFile && <p className="text-sm text-black">🎵 {audioFile.name}</p>}

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <p className="text-sm text-black">
            Uploading… {Math.round(uploadProgress)}%
          </p>
        )}
        {uploadProgress === 100 && (
          <p className="text-sm text-green-600">Upload done ✓</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#6a4a2e] text-white px-6 py-2 rounded hover:bg-[#4b2e19] transition"
        >
          {loading ? "Posting..." : "Post Blog"}
        </button>
      </form>
    </div>
  );
}

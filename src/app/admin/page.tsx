"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, storage, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { FiImage, FiMusic, FiLink } from "react-icons/fi";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        router.push("/"); // Redirect if not admin
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleFileUpload = async (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Title and content are required");
    setLoading(true);

    try {
      let imageUrl = "";
      let audioUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Image upload failed");

        const data = await res.json();
        imageUrl = data.url;
      }

      if (audioFile) {
        audioUrl = await handleFileUpload(audioFile, "audios");
      }

      await addDoc(collection(db, "blogPosts"), {
        title,
        content,
        imageUrl,
        audioUrl,
        createdAt: serverTimestamp(),
        likes: 0,
      });

      alert("Blog posted successfully!");
      setTitle("");
      setContent("");
      setImageFile(null);
      setAudioFile(null);
      setUploadProgress(0);
      router.push("/blog");
    } catch (error) {
      console.error("Blog post failed:", error);
      alert("Failed to post blog");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">Admin: Post a New Blog</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white shadow-md rounded p-6 space-y-4"
      >
        <div>
          <label className="block text-black mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded text-black"
          />
        </div>

        <div>
          <label className="block text-black mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border rounded text-black"
          ></textarea>
        </div>

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

          <button type="button" title="Link support coming soon" className="cursor-not-allowed text-black opacity-40">
            <FiLink />
          </button>
        </div>

        {imageFile && (
          <p className="text-sm text-black">🖼 Selected image: {imageFile.name}</p>
        )}
        {audioFile && (
          <p className="text-sm text-black">🎵 Selected audio: {audioFile.name}</p>
        )}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <p className="text-sm text-black">Uploading: {Math.round(uploadProgress)}%</p>
        )}

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

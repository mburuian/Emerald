"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  increment,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import CommentSection from "@/app/components/commentssection";
import {
  Facebook,
  Twitter,
  Send,
  ClipboardCopy,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: Timestamp;
  likes: number;
  likedBy: string[];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const router = useRouter();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        if (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          setRole("admin");
        } else {
          setRole("user");
        }
      } else {
        setUserId(null);
        setRole(null);
      }
    });

    const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<BlogPost, "id">),
        }))
      );
    });

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
    };
  }, []);

  const handleLike = async (post: BlogPost) => {
    if (!userId || post.likedBy?.includes(userId)) return;

    const postRef = doc(db, "blogPosts", post.id);
    await updateDoc(postRef, {
      likes: increment(1),
      likedBy: [...(post.likedBy || []), userId],
    });
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "blogPosts", postId));
      alert("Post deleted.");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const handleEdit = (postId: string) => {
    router.push(`/edit-post/${postId}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">📝 Blog Page</h1>

      {posts.map((post) => {
        const postUrl = `${SITE_URL}/blog#${post.id}`;
        const encodedUrl = encodeURIComponent(postUrl);
        const encodedTitle = encodeURIComponent(post.title);

        return (
          <div
            key={post.id}
            id={post.id}
            className="p-4 border rounded shadow bg-white space-y-4"
          >
            <h2 className="text-xl font-semibold text-black">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>

            {post.imageUrl && (
              <div className="relative w-full h-64 rounded overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            )}

            {post.audioUrl && (
              <audio controls className="w-full mt-2">
                <source src={post.audioUrl} />
                Your browser does not support the audio element.
              </audio>
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={() => handleLike(post)}
                className={`${
                  post.likedBy?.includes(userId || "")
                    ? "text-gray-400"
                    : "text-blue-600"
                } hover:underline`}
                disabled={post.likedBy?.includes(userId || "")}
              >
                👍 {post.likes}
              </button>

              <span className="text-sm text-gray-500">
                {post.createdAt?.toDate?.().toLocaleString()}
              </span>
            </div>

            <div className="text-black">
              <CommentSection postId={post.id} showUsername={true} />
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
              <a
                href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                <Send size={16} /> WhatsApp
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                <Facebook size={16} /> Facebook
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600"
              >
                <Twitter size={16} /> Twitter
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(postUrl);
                  alert("Link copied to clipboard!");
                }}
                className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                <ClipboardCopy size={16} /> Copy Link
              </button>
            </div>

            {role === "admin" && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(post.id)}
                  className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

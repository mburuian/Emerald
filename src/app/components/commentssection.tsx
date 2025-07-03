"use client";

import { useEffect, useState } from "react";
import { QuerySnapshot, DocumentData } from "firebase/firestore"; 
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Comment {
  id: string; 
  text: string;
  createdAt: Timestamp | null;
  userId: string;
  username?: string;
}

interface CommentSectionProps {
  postId: string;
  showUsername?: boolean;
}

const CommentSection = ({ postId, showUsername = false }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUsername(user.displayName || "Anonymous");
      } else {
        setUserId(null);
        setUsername("");
      }
    });

    const commentsRef = collection(db, "blogPosts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const unsubscribeComments = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
  setComments(
    snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Comment, "id">),
    }))
  );
});


    return () => {
      unsubscribeAuth();
      unsubscribeComments();
    };
  }, [postId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userId) return;

    const commentsRef = collection(db, "blogPosts", postId, "comments");

    await addDoc(commentsRef, {
      text: newComment.trim(),
      createdAt: serverTimestamp(),
      userId,
      username,
    });

    setNewComment("");
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Comments</h3>
      <form onSubmit={handleCommentSubmit} className="mb-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded mb-2"
          rows={2}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          disabled={!userId || !newComment.trim()}
        >
          Post
        </button>
      </form>

      <ul className="space-y-2">
        {comments.map((comment) => (
          <li key={comment.id} className="border p-2 rounded bg-gray-50">
            {showUsername && (
              <p className="text-sm font-semibold text-gray-700">
                {comment.username || "Anonymous"}
              </p>
            )}
            <p>{comment.text}</p>
            <span className="text-xs text-gray-500">
             {comment.createdAt instanceof Date
  ? comment.createdAt.toLocaleString()
  : comment.createdAt?.toDate?.()?.toLocaleString?.() || "Just now"}

            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;

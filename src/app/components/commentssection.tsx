"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  post_id: string;
  text: string;
  created_at: string;
  user_id: string;
  username?: string;
}

interface CommentSectionProps {
  postId: string;
  showUsername?: boolean;
}

const CommentSection = ({ postId, showUsername = false }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]); // ✅ Correct typing
  const [newComment, setNewComment] = useState<string>(""); // ✅ Explicit type
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  // ✅ Fetch user + comments on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Get user details
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setUsername(user.user_metadata?.full_name || "Anonymous");
      }

      // Fetch existing comments
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        setComments(data || []);
      }
    };

    fetchInitialData();

    // ✅ Real-time subscription for new comments
    const channel = supabase
      .channel("realtime-comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          setComments((prev) => [...prev, payload.new as Comment]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  // ✅ Handle submitting a new comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;
    if (!userId) {
      alert("Please log in to comment.");
      return;
    }

    const { error } = await supabase.from("comments").insert([
      {
        post_id: postId,
        text: newComment.trim(),
        user_id: userId,
        username: username || "Anonymous",
      },
    ]);

    if (error) {
      console.error("Error adding comment:", error);
      alert("Failed to post comment. Please try again.");
    } else {
      setNewComment(""); // ✅ Reset after posting
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-semibold mb-3">Comments</h3>

      {/* ✅ Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mb-4">
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

      {/* ✅ Comments List */}
      <ul className="space-y-3">
        {comments && comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment: Comment) => (
            <li key={comment.id} className="border p-3 rounded bg-gray-50">
              {showUsername && (
                <p className="text-sm font-semibold text-gray-700">
                  {comment.username || "Anonymous"}
                </p>
              )}
              <p className="text-gray-800">{comment.text}</p>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CommentSection;

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Blog {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  author?: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Fetch blogs from Supabase
  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching blogs:", error);
    else setBlogs(data || []);

    setLoading(false);
  };

  // ✅ Load blogs & check admin login
  useEffect(() => {
    fetchBlogs();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Delete blog from DB & update state
  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      alert("You do not have permission to delete blogs.");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    } else {
      // Remove from local state immediately
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      setSelectedBlog(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
          Our Latest Blogs
        </h1>

        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs available yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white shadow-lg rounded-xl overflow-hidden transition transform hover:scale-[1.02] hover:shadow-2xl duration-300"
              >
                {blog.image_url && (
                  <div className="relative w-full h-48">
                    <Image
                      src={blog.image_url}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2 text-gray-900">{blog.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 line-clamp-3">
                    {blog.content.length > 150
                      ? blog.content.substring(0, 150) + "..."
                      : blog.content}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                      Read More
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Full-Screen Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-800 shadow"
            >
              ✕
            </button>

            {selectedBlog.image_url && (
              <div className="relative w-full h-64 rounded-t-2xl overflow-hidden">
                <Image
                  src={selectedBlog.image_url}
                  alt={selectedBlog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">
                {selectedBlog.title}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                By {selectedBlog.author || "Admin"} •{" "}
                {new Date(selectedBlog.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-800 leading-relaxed">{selectedBlog.content}</p>

              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

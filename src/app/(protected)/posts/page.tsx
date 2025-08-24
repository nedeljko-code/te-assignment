"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/app/components/PostCasrd";

export default function Posts() {
  type Post = {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    content: string;
    published: boolean;
    authorId: string;
  };

  const r = useRouter();
  const [post, setPost] = useState({ title: "", content: "" });
  const ch = (k: keyof typeof post) => (e: any) =>
    setPost({ ...post, [k]: e.target.value });
  const [posts, setPosts] = useState<Post[]>([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("te_token") : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("te_token") : null;
    if (!token) return r.replace("/auth/login");
    const payload = { title: post.title, content: post.content };
    const res = await fetch("/api/te/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const ct = res.headers.get("content-type") || "";
    const text = await res.text();
    const data = ct.includes("json")
      ? (() => {
          try {
            return JSON.parse(text);
          } catch {
            return null;
          }
        })()
      : null;

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("te_token");
        return r.replace("/auth/login");
      }
      alert(data?.message || text || `Error ${res.status}`);
      return;
    }
  };

  async function loadPosts() {
    const res = await fetch("/api/te/posts", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      cache: "no-store",
    });

    if (res.status === 401) {
      localStorage.removeItem("te_token");
      r.replace("/auth/login");
      return;
    }

    const ct = res.headers.get("content-type") || "";
    const text = await res.text();
    const json = ct.includes("json")
      ? (() => {
          try {
            return JSON.parse(text);
          } catch {
            return null;
          }
        })()
      : null;

    // Backend may return either an array or { data: [...] }
    const list = Array.isArray(json) ? json : json?.data ?? [];
    setPosts(list as Post[]);
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 space-y-3">
        <input
          type="text"
          value={post.title}
          onChange={ch("title")}
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
        />
        <textarea
          value={post.content}
          onChange={ch("content")}
          required
          rows={4}
          className="w-full border rounded px-3 py-2"
          placeholder="Content"
        />
        <button type="submit" className="rounded bg-black text-white px-4 py-2">
          Create
        </button>
      </form>
      {posts.map((p) => (
        <PostCard
          key={p.id}
          id={p.id}
          title={p.title}
          content={p.content}
          createdAt={p.createdAt}
          published={p.published}
          authorId={p.authorId}
        />
      ))}
    </>
  );
}

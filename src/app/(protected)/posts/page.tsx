"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/app/components/PostCard";

export default function Posts() {
  // Tipovi iz tvog BE odgovora
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

  // Forma za kreiranje
  const [post, setPost] = useState({ title: "", content: "" });
  const ch = (k: keyof typeof post) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setPost({ ...post, [k]: e.target.value });

  // Lista + search
  const [posts, setPosts] = useState<Post[]>([]);
  const [q, setQ] = useState("");

  // Helper: logout + redirect
  const logoutAndRedirect = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
    } finally {
      r.replace("/auth/login");
    }
  };

  // Učitavanje liste
  async function loadPosts() {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const res = await fetch("/api/te/posts", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      cache: "no-store",
    });

    if (res.status === 401) {
      logoutAndRedirect();
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

    // Backend može vratiti niz ili { data: [...] }
    const list = Array.isArray(json) ? json : json?.data ?? [];
    setPosts(list as Post[]);
  }

  // Mount: ako nema tokena – login; inače učitaj
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      r.replace("/auth/login");
      return;
    }
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Kreiranje posta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
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
        logoutAndRedirect();
        return;
      }
      alert((data && (data.message || data.error)) || text || `Error ${res.status}`);
      return;
    }

    // Uspeh: osveži listu i resetuj formu
    await loadPosts();
    setPost({ title: "", content: "" });
  };

  // Filtriranje (client-side)
  const query = q.trim().toLowerCase();
  const list = query
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          (p.content || "").toLowerCase().includes(query)
      )
    : posts;

  return (
    <>
      {/* Forma za kreiranje */}
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

      {/* Search */}
      <div className="max-w-sm mx-auto p-6 pt-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="w-full rounded border px-3 py-2"
        />
      </div>

      {/* Lista postova */}
      {list.map((p) => (
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
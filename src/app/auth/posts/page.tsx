'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Posts(){
const r = useRouter();
const [post, setPost] = useState({title: "", content: ""})
const ch = (k : keyof typeof post) => (e: any) => setPost({...post,[k]:e.target.value})

const handleSubmit =async (e: React.FormEvent) =>{
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("te_token") : null;
    if (!token) return r.replace("/auth/login");
    const payload = {title:post.title,content: post.content}
    const  res = await fetch('/api/te/posts',{
        method: "POST",
        headers: {"Content-Type":"application/json","Authorization": `Bearer ${token}`},
        body: JSON.stringify(payload),
        cache: "no-store"
    })
    
    const ct = res.headers.get("content-type") || "";
    const text = await res.text();
    const data = ct.includes("json") ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null;

    if (!res.ok) {
      if (res.status === 401) { localStorage.removeItem("te_token"); return r.replace("/auth/login"); }
      alert(data?.message || text || `Error ${res.status}`);
      return;
    }
    

}

 return (
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
      <button type="submit" className="rounded bg-black text-white px-4 py-2">Create</button>
    </form>
  );

}

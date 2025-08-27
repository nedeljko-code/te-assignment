"use client";
import { useEffect, useState } from "react";
import PostCard from "@/app/components/PostCard";

export default function UserPostsPage({ params }: { params: { userId: string } }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
  const token = localStorage.getItem("accessToken") || "";

  fetch(`/api/te/posts/user/${params.userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  })
    .then(async (r) => {
      if (r.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        location.href = "/auth/login";
        return [];
      }
      const data = await r.json();
      return Array.isArray(data) ? data : data?.data ?? [];
    })
    .then(setItems)
    .catch(console.error);
}, [params.userId]);

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
      {items.map(p => (
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
    </div>
  );
}
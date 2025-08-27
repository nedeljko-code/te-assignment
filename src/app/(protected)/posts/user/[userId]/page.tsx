"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostCard from "@/app/components/PostCard";

export default function UserPostsPage() {
  type Post = {
    id: string;
    createdAt?: string;
    title: string;
    content: string;
    published?: boolean;
    authorId: string;
  };

  const { userId } = useParams<{ userId: string }>();
  const r = useRouter();

  const [items, setItems] = useState<Post[]>([]);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("accessToken") || "";

    fetch(`/api/te/posts/user/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userId");
          r.replace("/auth/login");
          return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : data?.data ?? [];
      })
      .then(setItems)
      .catch(console.error);
  }, [userId, r]);

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
      {items.map((p) => (
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

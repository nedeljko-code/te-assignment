import { NextRequest } from "next/server";
const API_BASE = (process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ userId: string }> } // ← Promise here
) {
  const { userId } = await ctx.params; // ← await the params

  const res = await fetch(`${API_BASE}/posts/user/${userId}`, {
    headers: { Authorization: req.headers.get("authorization") ?? "" },
    cache: "no-store",
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
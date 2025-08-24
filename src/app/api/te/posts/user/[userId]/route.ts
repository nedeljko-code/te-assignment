import type { NextRequest } from "next/server";
const API_BASE = (process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/,"");

export async function GET(req: NextRequest, ctx: { params: { userId: string } }) {
  const { userId } = ctx.params;
  const res = await fetch(`${API_BASE}/posts/user/${userId}`, {
    headers: { Authorization: req.headers.get("authorization") ?? "" },
    cache: "no-store",
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
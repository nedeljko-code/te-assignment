import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";  // ⬅️ use API_BASE

export async function POST(req: NextRequest) {
  const body = await req.json();
  const url = `${API_BASE.replace(/\/$/, "")}/auth/signup`; // ⬅️ build URL

  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
  });
}
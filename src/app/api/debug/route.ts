import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE || "";
    
    const root = base.replace(/\/api\/?$/, "");

    if (!root) {
      return NextResponse.json(
        { ok: false, reason: "API_BASE missing", seen: process.env.NEXT_PUBLIC_API_BASE },
        { status: 500 }
      );
    }

    const url = `${root}/api-json`;
    console.log("DEBUG url =", url, "API_BASE =", base);

    const r = await fetch(url, { cache: "no-store" });
    const text = await r.text();

    return NextResponse.json(
      { ok: r.ok, status: r.status, length: text.length, base, url },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("DEBUG error:", e);
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
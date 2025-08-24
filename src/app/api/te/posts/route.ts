import { NextRequest} from "next/server";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE || "").replace(/\/$/,"");


export async function POST(req: NextRequest){
    
    const body = await req.json().catch(()=>null);
    const res = await fetch(`${API_BASE}/posts`,{
        method: "POST",
        headers: {"Content-type": "application/json",
        Authorization: req.headers.get("authorization") ?? ""},
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store"
    })
    const text = await res.text();
    return new Response(text,
        {
            status: res.status, 
            headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" }
        });
}
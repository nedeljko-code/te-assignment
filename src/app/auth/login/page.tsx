"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage(){
    const[p , setP] = useState({email: "", password:""})
    const r = useRouter();
    const ch = (k: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setP({ ...p, [k]: e.target.value });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {  email: p.email, password: p.password};
        const res = await fetch("/api/te/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return alert(data?.message || `Error ${res.status}`);

const accessToken = data?.accessToken || data?.token || data?.jwt;
const refreshToken = data?.refreshToken || "";
const userId = data?.user?.id || data?.userId || "";

if (accessToken) localStorage.setItem("accessToken", accessToken);
if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
if (userId) localStorage.setItem("userId", userId);
localStorage.removeItem("te_token");

r.replace("/posts"); 
    }
    return(
        
    <form onSubmit={onSubmit} className="max-w-sm mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Login</h1>
      
      <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={p.email} onChange={ch("email")} required />
      <input className="w-full border rounded px-3 py-2" type="password" placeholder="Lozinka" value={p.password} onChange={ch("password")} required />
      
      <button className="w-full rounded bg-black text-white py-2">Submit</button>
    </form>
  );
    
}
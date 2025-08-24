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
    if (!res.ok) return alert(`Error ${res.status}`);
    const token = (data as any).token || (data as any).accessToken || (data as any).jwt;
    if (token) localStorage.setItem("te_token", token);
    r.replace("/posts"); 
    }
    return(
        
    <form onSubmit={onSubmit} className="max-w-sm mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Sign up</h1>
      
      <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={p.email} onChange={ch("email")} required />
      <input className="w-full border rounded px-3 py-2" type="password" placeholder="Lozinka" value={p.password} onChange={ch("password")} required />
      
      <button className="w-full rounded bg-black text-white py-2">Submit</button>
    </form>
  );
    
}
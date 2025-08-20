"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const r = useRouter();
  const [f, setF] = useState({ name:"", email:"", password:"", confirm:"" });
  const ch = (k: keyof typeof f) => (e: any) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name: f.name, email: f.email, password: f.password, password_confirmation: f.confirm };
    const res = await fetch("/api/te/auth/signup", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return alert(`Greška ${res.status}`);
    const token = (data as any).token || (data as any).accessToken || (data as any).jwt;
    if (token) localStorage.setItem("te_token", token);
    r.replace("/posts"); // ili /auth/login?registered=1
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Sign up</h1>
      <input className="w-full border rounded px-3 py-2" placeholder="Ime" value={f.name} onChange={ch("name")} required />
      <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={f.email} onChange={ch("email")} required />
      <input className="w-full border rounded px-3 py-2" type="password" placeholder="Lozinka" value={f.password} onChange={ch("password")} required />
      <input className="w-full border rounded px-3 py-2" type="password" placeholder="Potvrda lozinke" value={f.confirm} onChange={ch("confirm")} required />
      <button className="w-full rounded bg-black text-white py-2">Kreiraj nalog</button>
    </form>
  );
}
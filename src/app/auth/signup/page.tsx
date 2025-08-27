"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const r = useRouter();
  const [f, setF] = useState({
    firstname: "",
    email: "",
    password: "",
    lastname: "",
  });
  const ch = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      firstname: f.firstname,
      email: f.email,
      password: f.password,
      lastname: f.lastname,
    };
    const res = await fetch("/api/te/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Sign up</h1>

      <input
        className="w-full border rounded px-3 py-2"
        type="email"
        placeholder="Email"
        value={f.email}
        onChange={ch("email")}
        required
      />
      <input
        className="w-full border rounded px-3 py-2"
        type="password"
        placeholder="Password"
        value={f.password}
        onChange={ch("password")}
        required
      />
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Name"
        value={f.firstname}
        onChange={ch("firstname")}
        required
      />
      <input
        className="w-full border rounded px-3 py-2"
        type="Name"
        placeholder="Last name"
        value={f.lastname}
        onChange={ch("lastname")}
        required
      />
      <button className="w-full rounded bg-black text-white py-2">
        Create{" "}
      </button>
    </form>
  );
}

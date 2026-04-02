"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SERIF = "var(--font-playfair), Georgia, serif";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--off-white)" }}>
      <div className="w-full max-w-[400px] px-6">
        <div className="text-center mb-10">
          <h1
            className="text-[48px] font-bold tracking-[-0.03em] leading-[0.95] mb-3"
            style={{ fontFamily: SERIF, color: "var(--text-primary)" }}
          >
            Weekly Alpha
          </h1>
          <p className="text-[15px] font-medium" style={{ color: "var(--green)" }}>
            Private fund intelligence
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 rounded-[12px]" style={{ background: "#fff", border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <label className="text-[13px] font-semibold block mb-2" style={{ color: "var(--text-primary)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter access password"
              autoFocus
              className="w-full h-[48px] px-4 text-[15px] rounded-[6px] outline-none transition-all mb-4"
              style={{
                border: error ? "1.5px solid #DC2626" : "1.5px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
            {error && (
              <p className="text-[13px] mb-3" style={{ color: "#DC2626" }}>
                Incorrect password. Try again.
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full h-[48px] text-[14px] font-semibold rounded-[6px] transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--green-deep)", color: "#fff" }}
            >
              {loading ? "..." : "Enter"}
            </button>
          </div>
        </form>

        <p className="text-center text-[12px] mt-6" style={{ color: "var(--text-muted)" }}>
          &copy; 2026 Weekly Alpha. Institutional access only.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

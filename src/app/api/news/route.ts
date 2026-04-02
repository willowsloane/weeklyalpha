import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // cache 1 hour

const SERPER_KEY = () => process.env.NEXT_PUBLIC_SERPER_API_KEY || process.env.SERPER_API_KEY || "";

const NEWS_QUERIES = [
  "private equity fund 2026",
  "venture capital fundraise 2026",
  "private credit default 2026",
  "real estate fund investment 2026",
  "infrastructure fund data center 2026",
  "secondaries continuation vehicle 2026",
  "LP allocation alternative investments 2026",
];

export async function GET() {
  const key = SERPER_KEY();
  if (!key) {
    return NextResponse.json({ articles: [], error: "No SERPER_API_KEY" });
  }

  const allArticles: any[] = [];

  // Pick 3 random queries to keep it fresh each time
  const shuffled = NEWS_QUERIES.sort(() => Math.random() - 0.5).slice(0, 3);

  for (const query of shuffled) {
    try {
      const res = await fetch("https://google.serper.dev/news", {
        method: "POST",
        headers: { "X-API-KEY": key, "Content-Type": "application/json" },
        body: JSON.stringify({ q: query, num: 5 }),
      });
      if (res.ok) {
        const data = await res.json();
        for (const item of data.news || []) {
          allArticles.push({
            title: item.title || "",
            snippet: item.snippet || "",
            source: item.source || "",
            date: item.date || "",
            link: item.link || "",
            imageUrl: item.imageUrl || null,
          });
        }
      }
      await new Promise((r) => setTimeout(r, 150));
    } catch { /* skip */ }
  }

  // Dedupe by title, prefer ones with images, take top 8
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    const key = a.title.toLowerCase().slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort: ones with images first, then by date
  unique.sort((a, b) => {
    if (a.imageUrl && !b.imageUrl) return -1;
    if (!a.imageUrl && b.imageUrl) return 1;
    return 0;
  });

  return NextResponse.json({ articles: unique.slice(0, 8) });
}

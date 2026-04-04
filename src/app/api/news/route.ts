import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SEARCHAPI_KEY = () => process.env.SEARCHAPI_API_KEY || "";

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
  const key = SEARCHAPI_KEY();
  if (!key) {
    return NextResponse.json({ articles: [], error: "No SEARCHAPI_API_KEY" });
  }

  const allArticles: any[] = [];

  // Pick 3 random queries to keep it fresh each time
  const shuffled = NEWS_QUERIES.sort(() => Math.random() - 0.5).slice(0, 3);

  for (const query of shuffled) {
    try {
      const url = new URL("https://www.searchapi.io/api/v1/search");
      url.searchParams.set("engine", "google_news");
      url.searchParams.set("q", query);
      url.searchParams.set("num", "5");
      url.searchParams.set("api_key", key);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        for (const item of data.news_results || []) {
          allArticles.push({
            title: item.title || "",
            snippet: item.snippet || "",
            source: item.source?.name || item.source || "",
            date: item.date || "",
            link: item.link || "",
            imageUrl: item.thumbnail || null,
          });
        }
      }
      await new Promise((r) => setTimeout(r, 150));
    } catch { /* skip */ }
  }

  // Dedupe by title, prefer ones with images, take top 8
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    const k = a.title.toLowerCase().slice(0, 50);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  unique.sort((a, b) => {
    if (a.imageUrl && !b.imageUrl) return -1;
    if (!a.imageUrl && b.imageUrl) return 1;
    return 0;
  });

  return NextResponse.json({ articles: unique.slice(0, 8) });
}

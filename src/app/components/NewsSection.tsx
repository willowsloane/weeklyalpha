"use client";

import { useEffect, useState } from "react";
import { FadeUp, StaggerCards, StaggerChild } from "./Animations";

const SERIF = "var(--font-playfair), Georgia, serif";

interface NewsArticle {
  title: string;
  snippet: string;
  source: string;
  date: string;
  link: string;
  imageUrl: string | null;
}

function timeLabel(dateStr: string): string {
  if (!dateStr) return "";
  // Serper returns relative dates like "2 hours ago", "3 days ago"
  return dateStr;
}

export function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--green)" }} />
            <p className="text-[13px] font-semibold tracking-[0.1em] uppercase" style={{ color: "var(--green)" }}>Loading Market News...</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] rounded-[8px] mb-4" style={{ background: "var(--off-white)" }} />
                <div className="h-4 rounded mb-2" style={{ background: "var(--off-white)", width: "80%" }} />
                <div className="h-3 rounded" style={{ background: "var(--off-white)", width: "60%" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  // Split: first 2 are large, rest are small
  const heroArticles = articles.filter((a) => a.imageUrl).slice(0, 2);
  const smallArticles = articles.filter((a) => !heroArticles.includes(a)).slice(0, 6);

  return (
    <section className="py-16 md:py-24" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <FadeUp>
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} />
                <p className="text-[13px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--green)" }}>Market Intelligence</p>
              </div>
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-[-0.025em] leading-[1.1]" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
                Private Markets News
              </h2>
            </div>
            <p className="hidden md:block text-[13px] font-semibold" style={{ color: "var(--text-secondary)" }}>
              Updated hourly
            </p>
          </div>
        </FadeUp>

        {/* Hero row — 2 big articles with images */}
        {heroArticles.length > 0 && (
          <StaggerCards className="grid md:grid-cols-2 gap-6 mb-8">
            {heroArticles.map((article) => (
              <StaggerChild key={article.link}>
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="aspect-[16/9] rounded-[8px] overflow-hidden mb-4 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.imageUrl!}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-1 rounded-[3px]" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(8px)" }}>
                        {article.source}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-[19px] font-bold tracking-[-0.01em] leading-[1.3] mb-2 group-hover:underline" style={{ color: "var(--text-primary)" }}>
                    {article.title}
                  </h3>
                  <p className="text-[14px] leading-[1.55] mb-2" style={{ color: "var(--text-body)" }}>
                    {article.snippet.slice(0, 140)}{article.snippet.length > 140 ? "..." : ""}
                  </p>
                  <p className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
                    {article.source} &middot; {timeLabel(article.date)}
                  </p>
                </a>
              </StaggerChild>
            ))}
          </StaggerCards>
        )}

        {/* Divider */}
        <div className="mb-8" style={{ height: "1px", background: "var(--border-light)" }} />

        {/* Small articles grid */}
        {smallArticles.length > 0 && (
          <StaggerCards className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {smallArticles.map((article) => (
              <StaggerChild key={article.link}>
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="group flex gap-4">
                  {article.imageUrl && (
                    <div className="w-24 h-24 rounded-[6px] overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold leading-[1.3] mb-1.5 group-hover:underline" style={{ color: "var(--text-primary)" }}>
                      {article.title.length > 80 ? article.title.slice(0, 80) + "..." : article.title}
                    </h4>
                    <p className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
                      {article.source} &middot; {timeLabel(article.date)}
                    </p>
                  </div>
                </a>
              </StaggerChild>
            ))}
          </StaggerCards>
        )}
      </div>
    </section>
  );
}

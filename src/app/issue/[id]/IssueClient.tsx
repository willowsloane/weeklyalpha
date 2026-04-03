"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { FeaturedIssue } from "@/lib/data";

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO = "var(--font-mono), 'IBM Plex Mono', monospace";

// ── Animated bar ──────────────────────────────────────────────────────
function Bar({ label, value, maxValue, displayValue, color, delay = 0 }: {
  label: string; value: number; maxValue: number; displayValue: string; color: string; delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const pct = Math.min(100, Math.max(3, (value / maxValue) * 100));
  return (
    <div ref={ref} className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold" style={{ color: "#1A1714" }}>{label}</span>
        <span className="text-[15px] font-bold" style={{ color, fontFamily: MONO }}>{displayValue}</span>
      </div>
      <div className="h-[10px] rounded-full overflow-hidden" style={{ background: "#E8E5E0" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
        />
      </div>
    </div>
  );
}

// ── Big metric ────────────────────────────────────────────────────────
function BigMetric({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="text-center">
      <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: "#7A7672" }}>{label}</p>
      <p className="text-[42px] md:text-[56px] font-bold tracking-[-0.03em] leading-none" style={{ color: "#064E37", fontFamily: MONO }}>{value}</p>
      {sub && <p className="text-[12px] font-medium mt-2" style={{ color: "#4A4744" }}>{sub}</p>}
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function IssueClient({ issue }: { issue: FeaturedIssue }) {
  const peerMax = Math.max(
    issue.irrNetBps ? issue.irrNetBps / 100 : 0,
    issue.peerIrrQ3 || 0,
    issue.peerIrrMedian || 0,
    20
  ) * 1.15;

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm" style={{ borderBottom: "1px solid #E8E5E0" }}>
        <div className="max-w-[900px] mx-auto px-6 h-[52px] flex items-center justify-between">
          <Link href="/" className="text-[18px] font-bold tracking-[-0.01em]" style={{ fontFamily: SERIF, color: "#1A1714" }}>Weekly Alpha</Link>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-[13px] font-semibold" style={{ color: "#4A4744" }}>All Issues</Link>
            <Link href="#subscribe" className="text-[12px] font-semibold px-4 py-1.5 rounded-[4px]" style={{ background: "#064E37", color: "#fff" }}>Subscribe</Link>
          </div>
        </div>
      </nav>

      {/* Hero image */}
      <div className="max-w-[900px] mx-auto px-6 pt-8">
        <div className="relative aspect-[2.5/1] rounded-[14px] overflow-hidden">
          <Image src={issue.imageUrl} alt={issue.fundName} fill className="object-cover" sizes="900px" priority />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.05) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-[4px]" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(12px)" }}>{issue.strategyLabel}</span>
              {issue.vintageYear && <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>{issue.vintageYear} Vintage</span>}
            </div>
            <h1 className="text-[26px] md:text-[34px] font-bold tracking-[-0.02em] leading-[1.1]" style={{ fontFamily: SERIF, color: "#fff" }}>{issue.fundName}</h1>
          </div>
        </div>
      </div>

      <article className="max-w-[900px] mx-auto px-6">

        {/* ── Date + read time ── */}
        <div className="flex items-center gap-3 py-6" style={{ borderBottom: "1px solid #E8E5E0" }}>
          <span className="text-[13px] font-semibold" style={{ color: "#4A4744" }}>{formatDate(issue.weekOf)}</span>
          <span style={{ color: "#E8E5E0" }}>&middot;</span>
          <span className="text-[13px] font-medium" style={{ color: "#7A7672" }}>2 min read</span>
        </div>

        {/* ── THE BIG NUMBER ── */}
        {issue.irrNet && (
          <div className="py-14 text-center">
            <BigMetric
              value={issue.irrNet}
              label="Net IRR"
              sub={issue.irrPercentile ? `Top ${100 - issue.irrPercentile}% of ${issue.strategyLabel} funds` : undefined}
            />
          </div>
        )}

        {/* ── Performance strip ── */}
        <div className="flex flex-wrap justify-center gap-0 rounded-[12px] overflow-hidden mb-10" style={{ border: "1px solid #E8E5E0" }}>
          {[
            issue.irrNet && { label: "Net IRR", value: issue.irrNet },
            issue.tvpi && { label: "TVPI", value: issue.tvpi },
            issue.dpi && { label: "DPI", value: issue.dpi },
            issue.fundSize && { label: "Fund Size", value: issue.fundSize },
            issue.carry && { label: "Carry", value: issue.carry },
          ].filter(Boolean).map((m: any, i: number, arr: any[]) => (
            <div
              key={m.label}
              className="flex-1 min-w-[120px] py-5 px-4 text-center"
              style={{
                background: i % 2 === 0 ? "#F5F3EF" : "#FAFAF8",
                borderRight: i < arr.length - 1 ? "1px solid #E8E5E0" : "none",
              }}
            >
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-1.5" style={{ color: "#7A7672" }}>{m.label}</p>
              <p className="text-[22px] font-bold tracking-[-0.02em] leading-none" style={{ color: "#064E37", fontFamily: MONO }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* ── Peer comparison bars ── */}
        {issue.irrNetBps != null && issue.peerIrrMedian != null && (
          <div className="p-7 rounded-[12px] mb-10" style={{ background: "#F5F3EF", border: "1px solid #E8E5E0" }}>
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase mb-6" style={{ color: "#7A7672" }}>
              IRR vs {issue.strategyLabel} Peer Group
            </p>
            <Bar label={issue.fundName.length > 30 ? issue.fundName.slice(0, 28) + "..." : issue.fundName} value={issue.irrNetBps / 100} maxValue={peerMax} displayValue={(issue.irrNetBps / 100).toFixed(1) + "%"} color="#064E37" delay={0} />
            {issue.peerIrrQ3 && <Bar label="Top Quartile" value={issue.peerIrrQ3} maxValue={peerMax} displayValue={issue.peerIrrQ3.toFixed(1) + "%"} color="#0A7B55" delay={0.1} />}
            {issue.peerIrrMedian && <Bar label="Median" value={issue.peerIrrMedian} maxValue={peerMax} displayValue={issue.peerIrrMedian.toFixed(1) + "%"} color="#9CA3AF" delay={0.2} />}
            {issue.peerIrrQ1 && <Bar label="Bottom Quartile" value={issue.peerIrrQ1} maxValue={peerMax} displayValue={issue.peerIrrQ1.toFixed(1) + "%"} color="#D1D5DB" delay={0.3} />}
          </div>
        )}

        {/* ── Divider ── */}
        <div style={{ height: "1px", background: "#E8E5E0", margin: "8px 0 32px" }} />

        {/* ── Body content (The Story + At A Glance from Gemini) ── */}
        {issue.bodyHtml && (
          <div
            style={{ color: "#2D2A26", fontSize: "17px", lineHeight: "1.8", letterSpacing: "-0.003em" }}
            dangerouslySetInnerHTML={{ __html: issue.bodyHtml }}
          />
        )}

        {/* ── CTA: Want to be featured? ── */}
        <div className="my-14 p-8 rounded-[14px] text-center" style={{ background: "#064E37" }}>
          <h3 className="text-[24px] md:text-[30px] font-bold tracking-[-0.02em] mb-3" style={{ fontFamily: SERIF, color: "#fff" }}>
            Want your fund featured?
          </h3>
          <p className="text-[15px] mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
            Upload your deck and get in front of qualified LPs. One fund featured every week.
          </p>
          <a href="#submit" className="inline-flex items-center gap-2 text-[14px] font-semibold px-7 py-3.5 rounded-[6px]" style={{ background: "#fff", color: "#064E37" }}>
            Submit Your Fund
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>

        {/* ── Subscribe ── */}
        <div id="subscribe" className="py-12 text-center">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: "#064E37" }}>Next Issue</p>
          <h3 className="text-[24px] md:text-[30px] font-bold tracking-[-0.02em] mb-3" style={{ fontFamily: SERIF, color: "#1A1714" }}>
            Don&apos;t miss the next feature
          </h3>
          <p className="text-[15px] mb-7 max-w-[380px] mx-auto" style={{ color: "#4A4744" }}>
            One fund. Every Monday. Performance data, peer benchmarks, market context.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[400px] mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 h-[48px] px-4 text-[14px] rounded-[6px] outline-none" style={{ border: "1.5px solid #E8E5E0", color: "#1A1714" }} />
            <button className="h-[48px] px-6 text-[13px] font-semibold rounded-[6px] shrink-0" style={{ background: "#064E37", color: "#fff" }}>Subscribe Free</button>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: "1px solid #E8E5E0" }}>
        <div className="max-w-[900px] mx-auto px-6 flex items-center justify-between">
          <span className="text-[15px] font-bold" style={{ fontFamily: SERIF, color: "#1A1714" }}>Weekly Alpha</span>
          <p className="text-[12px]" style={{ color: "#7A7672" }}>&copy; 2026 Weekly Alpha</p>
        </div>
      </footer>

      {/* Article typography overrides */}
      <style>{`
        article h2 { font-family: ${SERIF}; font-size: 22px; font-weight: 700; color: #1A1714; margin: 32px 0 14px; letter-spacing: -0.01em; }
        article p { margin: 0 0 18px; }
        article strong { color: #1A1714; font-weight: 700; }
        article table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        article th { text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #7A7672; border-bottom: 2px solid #E8E5E0; }
        article td { padding: 12px 16px; font-size: 15px; border-bottom: 1px solid #F0EDE8; color: #1A1714; }
        article td:first-child { color: #7A7672; font-size: 13px; font-weight: 600; }
        article td:last-child { font-weight: 600; }
      `}</style>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { FeaturedIssue } from "@/lib/data";

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO = "var(--font-mono), 'IBM Plex Mono', monospace";

function Bar({ label, value, maxValue, displayValue, color, delay = 0 }: {
  label: string; value: number; maxValue: number; displayValue: string; color: string; delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const pct = Math.min(100, Math.max(3, (value / maxValue) * 100));
  return (
    <div ref={ref} className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] font-semibold" style={{ color: "#1A1714" }}>{label}</span>
        <span className="text-[14px] font-bold" style={{ color, fontFamily: MONO }}>{displayValue}</span>
      </div>
      <div className="h-[6px] rounded-[3px] overflow-hidden" style={{ background: "#E8E5E0" }}>
        <motion.div className="h-full rounded-[3px]" style={{ background: color }}
          initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }} />
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function IssueClient({ issue }: { issue: FeaturedIssue }) {
  const peerMax = Math.max(issue.irrNetBps ? issue.irrNetBps / 100 : 0, issue.peerIrrQ3 || 0, 20) * 1.15;

  // Metrics for the strip (exclude IRR — it's the big number)
  const stripMetrics = [
    issue.tvpi && { label: "TVPI", value: issue.tvpi },
    issue.dpi && { label: "DPI", value: issue.dpi },
    issue.fundSize && { label: "Fund Size", value: issue.fundSize },
    issue.carry && { label: "Carry", value: issue.carry },
    issue.hurdle && { label: "Hurdle", value: issue.hurdle },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm" style={{ borderBottom: "1px solid #E8E5E0" }}>
        <div className="max-w-[900px] mx-auto px-6 h-[48px] flex items-center justify-between">
          <Link href="/" className="text-[17px] font-bold tracking-[-0.02em]" style={{ fontFamily: SERIF, color: "#1A1714" }}>Weekly Alpha</Link>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-[13px] font-semibold" style={{ color: "#4A4744" }}>All Issues</Link>
            <Link href="#subscribe" className="text-[12px] font-semibold px-4 py-1.5 rounded-[4px]" style={{ background: "#064E37", color: "#fff" }}>Subscribe</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-[900px] mx-auto px-6 pt-8">
        <div className="relative aspect-[2/1] rounded-[8px] overflow-hidden">
          <Image src={issue.imageUrl} alt={issue.fundName} fill className="object-cover" sizes="900px" priority />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0) 100%)" }} />
          {issue.irrNet && (
            <div className="absolute top-5 right-6 text-right">
              <p className="text-[32px] font-bold tracking-[-0.03em] leading-none" style={{ color: "rgba(255,255,255,0.9)", fontFamily: MONO }}>{issue.irrNet}</p>
              <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Net IRR</p>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-[4px]" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>{issue.strategyLabel}</span>
              {issue.vintageYear && <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>{issue.vintageYear} Vintage</span>}
              {issue.fundSize && <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>{issue.fundSize}</span>}
            </div>
            <h1 className="text-[28px] md:text-[38px] font-bold tracking-[-0.025em] leading-[1.08]" style={{ fontFamily: SERIF, color: "#fff" }}>{issue.fundName}</h1>
          </div>
        </div>
      </div>

      <article className="max-w-[900px] mx-auto px-6">

        {/* Date */}
        <div className="flex items-center gap-3 py-5">
          <span className="text-[13px] font-semibold" style={{ color: "#4A4744" }}>{formatDate(issue.weekOf)}</span>
          {issue.gpName && (
            <>
              <span style={{ color: "#E8E5E0" }}>&mdash;</span>
              <span className="text-[13px] font-medium" style={{ color: "#7A7672" }}>{issue.gpName}</span>
            </>
          )}
        </div>

        {/* ══════ THE PERFORMANCE CARD ══════ */}
        <div className="rounded-[8px] overflow-hidden mb-14" style={{ border: "1px solid #E8E5E0", background: "#fff" }}>

          {/* Big IRR */}
          {issue.irrNet && (
            <div className="py-10 text-center" style={{ borderBottom: "1px solid #E8E5E0" }}>
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color: "#7A7672" }}>Net IRR</p>
              <p className="text-[36px] md:text-[48px] tracking-[-0.04em] leading-none" style={{ color: "#064E37", fontFamily: MONO, fontWeight: 500 }}>{issue.irrNet}</p>
              {issue.irrPercentile != null && (
                <p className="text-[12px] font-medium mt-3" style={{ color: "#4A4744" }}>
                  {issue.irrPercentile}th percentile — {issue.strategyLabel}{issue.vintageYear ? `, ${issue.vintageYear} vintage` : ""}
                </p>
              )}
            </div>
          )}

          {/* Metrics grid */}
          {stripMetrics.length > 0 && (
            <div className="grid" style={{ gridTemplateColumns: `repeat(${stripMetrics.length}, 1fr)`, borderBottom: "1px solid #E8E5E0" }}>
              {stripMetrics.map((m, i) => (
                <div key={m.label} className="py-5 px-4 text-center" style={{ borderRight: i < stripMetrics.length - 1 ? "1px solid #E8E5E0" : "none" }}>
                  <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-1.5" style={{ color: "#7A7672" }}>{m.label}</p>
                  <p className="text-[20px] font-bold tracking-[-0.02em] leading-none" style={{ color: "#1A1714", fontFamily: MONO }}>{m.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Peer bars */}
          {issue.irrNetBps != null && issue.peerIrrMedian != null && (
            <div className="px-7 py-7">
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-5" style={{ color: "#7A7672" }}>
                IRR vs {issue.strategyLabel} Peers
              </p>
              <Bar label={issue.fundName} value={issue.irrNetBps / 100} maxValue={peerMax} displayValue={(issue.irrNetBps / 100).toFixed(1) + "%"} color="#064E37" delay={0} />
              {issue.peerIrrQ3 && <Bar label="Top Quartile" value={issue.peerIrrQ3} maxValue={peerMax} displayValue={issue.peerIrrQ3.toFixed(1) + "%"} color="#9CA3AF" delay={0.08} />}
              {issue.peerIrrMedian && <Bar label="Median" value={issue.peerIrrMedian} maxValue={peerMax} displayValue={issue.peerIrrMedian.toFixed(1) + "%"} color="#C4C0BC" delay={0.16} />}
              {issue.peerIrrQ1 && <Bar label="Bottom Quartile" value={issue.peerIrrQ1} maxValue={peerMax} displayValue={issue.peerIrrQ1.toFixed(1) + "%"} color="#E8E5E0" delay={0.24} />}
            </div>
          )}
        </div>

        {/* ══════ THE STORY (from Gemini) ══════ */}
        {issue.bodyHtml && (
          <div className="max-w-[680px] mx-auto mb-14"
            style={{ color: "#2D2A26", fontSize: "17px", lineHeight: "1.8", letterSpacing: "-0.003em" }}
            dangerouslySetInnerHTML={{ __html: issue.bodyHtml }}
          />
        )}

        {/* ══════ WANT TO BE FEATURED? ══════ */}
        <div className="rounded-[8px] overflow-hidden mb-14" style={{ background: "#064E37", borderTop: "3px solid #0A7B55" }}>
          <div className="p-8 md:p-10 text-center">
            <h3 className="text-[22px] md:text-[26px] font-bold tracking-[-0.02em] mb-3" style={{ fontFamily: SERIF, color: "#fff" }}>
              Want your fund featured?
            </h3>
            <p className="text-[14px] mb-2" style={{ color: "rgba(255,255,255,0.65)" }}>
              Upload your deck and get in front of qualified LPs. One fund featured every Monday.
            </p>
            <p className="text-[12px] italic mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              Funds featured in Weekly Alpha see 3x more LP inquiries
            </p>
            <a href="#submit" className="inline-block text-[14px] font-semibold px-7 py-3 rounded-[6px]" style={{ background: "#fff", color: "#064E37" }}>
              Submit Your Deck
            </a>
          </div>
        </div>

        {/* Subscribe */}
        <div id="subscribe" className="py-10 text-center">
          <h3 className="text-[22px] md:text-[26px] font-bold tracking-[-0.02em] mb-3" style={{ fontFamily: SERIF, color: "#1A1714" }}>
            Don&apos;t miss the next feature
          </h3>
          <p className="text-[14px] mb-6 max-w-[360px] mx-auto" style={{ color: "#4A4744" }}>
            One fund. Every Monday. Performance data and market context.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[380px] mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 h-[46px] px-4 text-[14px] rounded-[4px] outline-none" style={{ border: "1.5px solid #E8E5E0", color: "#1A1714", background: "#fff" }} />
            <button className="h-[46px] px-6 text-[13px] font-semibold rounded-[4px] shrink-0" style={{ background: "#064E37", color: "#fff" }}>Subscribe</button>
          </div>
        </div>
      </article>

      <footer className="py-7" style={{ borderTop: "1px solid #E8E5E0" }}>
        <div className="max-w-[900px] mx-auto px-6 flex items-center justify-between">
          <span className="text-[14px] font-bold" style={{ fontFamily: SERIF, color: "#1A1714" }}>Weekly Alpha</span>
          <p className="text-[11px]" style={{ color: "#7A7672" }}>&copy; 2026 Weekly Alpha</p>
        </div>
      </footer>

      <style>{`
        article h2 { font-family: ${SERIF}; font-size: 20px; font-weight: 700; color: #1A1714; margin: 48px 0 14px; letter-spacing: -0.01em; }
        article p { margin: 0 0 16px; }
        article strong { color: #1A1714; font-weight: 700; }
        article table { width: 100%; border-collapse: collapse; margin: 8px 0; border-radius: 8px; overflow: hidden; }
        article th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #7A7672; border-bottom: 2px solid #E8E5E0; background: #F5F3EF; }
        article td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #F0EDE8; }
        article td:first-child { color: #7A7672; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
        article td:last-child { font-weight: 600; color: #1A1714; font-family: ${MONO}; font-variant-numeric: tabular-nums; }
        @media print { nav, #subscribe, footer, [style*="064E37"][style*="border-top"] { display: none; } }
      `}</style>
    </div>
  );
}

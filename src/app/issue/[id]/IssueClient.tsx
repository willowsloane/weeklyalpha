"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import type { FeaturedIssue } from "@/lib/data";
import { ordinal, pctColor, pctBg, C } from "@/lib/format";
import { FundHeroImage } from "@/app/components/FundHeroImage";

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO = "var(--font-mono), 'IBM Plex Mono', monospace";

/* ── Extract Bull & Bear from bodyHtml ── */
function extractBullBear(html: string): { bull: string; bear: string; bodyWithout: string } {
  // Try to find bull/bear section and extract it
  const bullBearPatterns = [
    // h2 "Bull and Bear" or "Bull & Bear" followed by content until next h2 or end
    /(<h2[^>]*>Bull\s*(?:and|&amp;|&)\s*Bear<\/h2>)([\s\S]*?)(?=<h2|$)/i,
  ];

  let bull = "", bear = "", bodyWithout = html;

  for (const pattern of bullBearPatterns) {
    const match = html.match(pattern);
    if (match) {
      const section = match[0];
      bodyWithout = html.replace(section, "");

      // Extract bull and bear content
      const bullMatch = section.match(/bull\s*case[^<]*<\/(?:p|strong)>\s*([\s\S]*?)(?=bear\s*case|$)/i)
        || section.match(/<strong>Bull\s*Case<\/strong>\s*([\s\S]*?)(?=<strong>Bear|<p[^>]*><strong>Bear|$)/i)
        || section.match(/Bull\s*Case\s*<\/h3>\s*([\s\S]*?)(?=Bear|$)/i);
      const bearMatch = section.match(/bear\s*case[^<]*<\/(?:p|strong)>\s*([\s\S]*?)$/i)
        || section.match(/<strong>Bear\s*Case<\/strong>\s*([\s\S]*?)$/i)
        || section.match(/Bear\s*Case\s*<\/h3>\s*([\s\S]*?)$/i);

      if (bullMatch) bull = bullMatch[1]?.replace(/<\/?[^>]+(>|$)/g, "").trim() || "";
      if (bearMatch) bear = bearMatch[1]?.replace(/<\/?[^>]+(>|$)/g, "").trim() || "";

      // Fallback: split on "Bear Case" if regex didn't catch it
      if (!bull && !bear) {
        const text = section.replace(/<\/?[^>]+(>|$)/g, "").replace(/Bull\s*(?:and|&)\s*Bear/i, "");
        const parts = text.split(/Bear\s*Case/i);
        if (parts.length >= 2) {
          bull = parts[0].replace(/Bull\s*Case/i, "").trim();
          bear = parts[1].trim();
        }
      }
      break;
    }
  }

  return { bull, bear, bodyWithout };
}

/* ── Distribution strip ── */
function DistributionStrip({ issue }: { issue: FeaturedIssue }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const fundIrr = issue.irrNetBps != null ? issue.irrNetBps / 100 : null;
  if (fundIrr == null || issue.peerIrrMedian == null) return null;

  const min = issue.peerIrrMin ?? Math.min(fundIrr, issue.peerIrrQ1 ?? fundIrr) - 2;
  const max = issue.peerIrrMax ?? Math.max(fundIrr, issue.peerIrrQ3 ?? fundIrr) + 2;
  const range = max - min || 1;
  const pos = (v: number) => Math.max(2, Math.min(98, ((v - min) / range) * 100));

  const markers = [
    issue.peerIrrQ1 != null && { label: "Q1", value: issue.peerIrrQ1 },
    issue.peerIrrMedian != null && { label: "Median", value: issue.peerIrrMedian },
    issue.peerIrrQ3 != null && { label: "Q3", value: issue.peerIrrQ3 },
  ].filter(Boolean) as { label: string; value: number }[];

  const fundPct = pos(fundIrr);
  const accent = issue.irrPercentile != null ? pctColor(issue.irrPercentile) : C.accent;

  return (
    <div ref={ref} className="px-7 pt-7 pb-9">
      <div className="flex items-center justify-between mb-8">
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: C.subtle }}>IRR vs {issue.strategyLabel} Peers</p>
        {issue.peerCount > 0 && <p className="text-[11px] font-medium" style={{ color: C.muted }}>{issue.peerCount} funds · ±2 vintage years</p>}
      </div>
      <div className="relative h-[20px] mb-1">
        {markers.map((m) => (
          <div key={m.label} className="absolute flex flex-col items-center" style={{ left: `${pos(m.value)}%`, transform: "translateX(-50%)" }}>
            <span className="text-[9px] font-semibold uppercase tracking-[0.06em]" style={{ color: C.muted }}>{m.label}</span>
          </div>
        ))}
      </div>
      <div className="relative h-[10px] mb-1">
        <div className="absolute inset-x-0 top-[4px] h-[2px] rounded-full" style={{ background: C.borderLight }} />
        {issue.peerIrrQ1 != null && issue.peerIrrQ3 != null && (
          <motion.div className="absolute top-0 h-full rounded-[4px]" style={{ left: `${pos(issue.peerIrrQ1)}%`, background: C.border }}
            initial={{ width: 0 }} animate={inView ? { width: `${pos(issue.peerIrrQ3) - pos(issue.peerIrrQ1)}%` } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }} />
        )}
        {markers.map((m, i) => (
          <motion.div key={m.label} className="absolute top-0 rounded-full" style={{ left: `${pos(m.value)}%`, transform: "translateX(-50%)", width: 2, background: C.peerBar }}
            initial={{ height: 0 }} animate={inView ? { height: 10 } : {}} transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }} />
        ))}
        <motion.div className="absolute top-1/2" style={{ left: `${fundPct}%`, transform: "translate(-50%, -50%)", zIndex: 10 }}
          initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}>
          <div className="rounded-full" style={{ width: 14, height: 14, background: accent, border: "2.5px solid #fff", boxShadow: `0 0 0 1px ${accent}30, 0 2px 6px ${accent}20` }} />
        </motion.div>
      </div>
      <div className="relative h-[18px] mb-2">
        {markers.map((m) => (
          <div key={m.label} className="absolute flex flex-col items-center" style={{ left: `${pos(m.value)}%`, transform: "translateX(-50%)" }}>
            <span className="text-[10px] font-bold tabular-nums" style={{ color: C.subtle, fontFamily: MONO }}>{m.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <motion.div className="flex items-center gap-2 mt-3" initial={{ opacity: 0, y: 4 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.3, delay: 0.6 }}>
        <div className="w-[10px] h-[10px] rounded-full shrink-0" style={{ background: accent }} />
        <span className="text-[12px] font-semibold" style={{ color: accent }}>{issue.fundName}</span>
        <span className="text-[13px] font-bold tabular-nums" style={{ color: accent, fontFamily: MONO }}>{fundIrr.toFixed(1)}%</span>
      </motion.div>
    </div>
  );
}

/* ── Bar fallback ── */
function Bar({ label, value, maxValue, displayValue, color, delay = 0 }: {
  label: string; value: number; maxValue: number; displayValue: string; color: string; delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const pct = Math.min(100, Math.max(3, (value / maxValue) * 100));
  return (
    <div ref={ref} className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] font-semibold" style={{ color: C.primary }}>{label}</span>
        <span className="text-[14px] font-bold tabular-nums" style={{ color, fontFamily: MONO }}>{displayValue}</span>
      </div>
      <div className="h-[6px] rounded-[3px] overflow-hidden" style={{ background: C.border }}>
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
  const hasDistribution = issue.peerIrrQ1 != null && issue.peerIrrMedian != null && issue.peerIrrQ3 != null;

  const stripMetrics = [
    issue.tvpi && { label: "TVPI", value: issue.tvpi },
    issue.dpi && { label: "DPI", value: issue.dpi },
    issue.fundSize && { label: "Fund Size", value: issue.fundSize },
    issue.mgmtFee && { label: "Mgmt Fee", value: issue.mgmtFee },
    issue.carry && { label: "Carry", value: issue.carry },
    issue.hurdle && { label: "Hurdle", value: issue.hurdle },
  ].filter(Boolean) as { label: string; value: string }[];

  const accent = issue.irrPercentile != null ? pctColor(issue.irrPercentile) : C.accent;

  // Extract bull/bear from body to render separately at top
  const { bull, bear, bodyWithout } = useMemo(() => extractBullBear(issue.bodyHtml || ""), [issue.bodyHtml]);

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-[900px] mx-auto px-6 h-[48px] flex items-center justify-between">
          <Link href="/" className="text-[17px] font-bold tracking-[-0.02em]" style={{ fontFamily: SERIF, color: C.primary }}>Weekly Alpha</Link>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-[13px] font-semibold" style={{ color: C.secondary }}>All Issues</Link>
            <Link href="#subscribe" className="text-[12px] font-semibold px-4 py-1.5 rounded-[4px]" style={{ background: C.accent, color: "#fff" }}>Subscribe</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-[900px] mx-auto px-6 pt-10">
        <FundHeroImage strategy={issue.strategyLabel} fundName={issue.fundName} gradient={issue.gradient} vintageYear={issue.vintageYear} fundSize={issue.fundSize} />
      </div>

      <article className="max-w-[900px] mx-auto px-6">

        {/* Date + GP */}
        <div className="flex items-center gap-3 py-7">
          <span className="text-[13px] font-semibold" style={{ color: C.secondary }}>{formatDate(issue.weekOf)}</span>
          {issue.gpName && (<><span style={{ color: C.border }}>&mdash;</span><span className="text-[13px] font-medium" style={{ color: C.subtle }}>{issue.gpName}</span></>)}
          {issue.dataAsOf && (<><span style={{ color: C.border }}>&mdash;</span><span className="text-[12px] font-medium" style={{ color: C.muted }}>Data as of {issue.dataAsOf}</span></>)}
        </div>

        {/* ══════ PERFORMANCE CARD ══════ */}
        <div className="rounded-[8px] overflow-hidden mb-10" style={{ border: `1px solid ${C.border}`, background: C.surface }}>
          {issue.irrNet && (
            <div className="py-14 text-center" style={{ borderBottom: `1px solid ${C.border}` }}>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: C.subtle }}>Net IRR</p>
              <p className="text-[44px] md:text-[60px] tracking-[-0.04em] leading-none" style={{ color: accent, fontFamily: MONO, fontWeight: 500 }}>{issue.irrNet}</p>
              {issue.irrPercentile != null && issue.peerCount >= 5 && (
                <div className="mt-5 inline-flex items-center gap-2.5">
                  <span className="text-[11px] font-bold tracking-[0.04em] uppercase px-3 py-1 rounded-[4px]" style={{ background: pctBg(issue.irrPercentile), color: accent }}>
                    {ordinal(issue.irrPercentile)} percentile
                  </span>
                  <span className="text-[11px] font-medium" style={{ color: C.muted }}>
                    {issue.strategyLabel}{issue.vintageYear ? ` · ${issue.vintageYear} vintage` : ""} · {issue.peerCount} peers
                  </span>
                </div>
              )}
              {issue.irrPercentile != null && issue.peerCount > 0 && issue.peerCount < 5 && (
                <p className="text-[11px] font-medium mt-4" style={{ color: C.muted }}>
                  {issue.strategyLabel}{issue.vintageYear ? `, ${issue.vintageYear} vintage` : ""} · {issue.peerCount} peers (limited data)
                </p>
              )}
            </div>
          )}

          {/* Metrics grid or inline */}
          {stripMetrics.length >= 3 && (
            <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.min(stripMetrics.length, 6)}, 1fr)`, borderBottom: `1px solid ${C.border}` }}>
              {stripMetrics.map((m, i) => (
                <div key={m.label} className="py-6 px-3 text-center" style={{ borderRight: i < stripMetrics.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <p className="text-[9px] font-semibold tracking-[0.1em] uppercase mb-2" style={{ color: C.subtle }}>{m.label}</p>
                  <p className="text-[20px] font-bold tracking-[-0.02em] leading-none tabular-nums" style={{ color: C.primary, fontFamily: MONO }}>{m.value}</p>
                </div>
              ))}
            </div>
          )}
          {stripMetrics.length > 0 && stripMetrics.length < 3 && (
            <div className="flex items-center justify-center gap-6 py-5" style={{ borderBottom: `1px solid ${C.border}` }}>
              {stripMetrics.map((m) => (
                <span key={m.label} className="text-[13px]" style={{ color: C.secondary }}>
                  <span className="font-medium">{m.label}: </span>
                  <span className="font-bold tabular-nums" style={{ fontFamily: MONO, color: C.primary }}>{m.value}</span>
                </span>
              ))}
            </div>
          )}

          {/* Peer viz */}
          {hasDistribution ? (
            <DistributionStrip issue={issue} />
          ) : issue.irrNetBps != null && issue.peerIrrMedian != null && issue.peerCount >= 5 ? (
            <div className="px-7 py-8">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: C.subtle }}>IRR vs {issue.strategyLabel} Peers</p>
                <p className="text-[11px] font-medium" style={{ color: C.muted }}>{issue.peerCount} peers</p>
              </div>
              <Bar label={issue.fundName} value={issue.irrNetBps / 100} maxValue={peerMax} displayValue={(issue.irrNetBps / 100).toFixed(1) + "%"} color={accent} delay={0} />
              {issue.peerIrrQ3 && <Bar label="Top Quartile" value={issue.peerIrrQ3} maxValue={peerMax} displayValue={issue.peerIrrQ3.toFixed(1) + "%"} color={C.peerBar} delay={0.08} />}
              {issue.peerIrrMedian && <Bar label="Median" value={issue.peerIrrMedian} maxValue={peerMax} displayValue={issue.peerIrrMedian.toFixed(1) + "%"} color={C.peerBarLight} delay={0.16} />}
              {issue.peerIrrQ1 && <Bar label="Bottom Quartile" value={issue.peerIrrQ1} maxValue={peerMax} displayValue={issue.peerIrrQ1.toFixed(1) + "%"} color={C.border} delay={0.24} />}
            </div>
          ) : issue.peerCount > 0 && issue.peerCount < 5 ? (
            <div className="px-7 py-6">
              <p className="text-[12px]" style={{ color: C.muted }}>
                Limited peer data — only {issue.peerCount} comparable {issue.strategyLabel.toLowerCase()} fund{issue.peerCount === 1 ? "" : "s"} in our database for this vintage window. Peer benchmarking requires 5+ funds for meaningful comparison.
              </p>
            </div>
          ) : null}

          {/* Methodology footnote */}
          <div className="px-7 pb-5">
            <p className="text-[10px]" style={{ color: C.muted }}>
              Percentile rank calculated vs. {issue.strategyLabel.toLowerCase()} funds within ±2 vintage years.
              {issue.peerCount > 0 && ` Peer group: ${issue.peerCount} funds.`}
              {issue.dataAsOf && ` Performance data as of ${issue.dataAsOf}.`}
              {" "}Source: Weekly Alpha fund database.
            </p>
          </div>
        </div>

        {/* ══════ BULL & BEAR — RIGHT AFTER PERFORMANCE CARD ══════ */}
        {(bull || bear) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {bull && (
              <div className="rounded-[8px] p-6" style={{ background: "#E8F5EE", border: "1px solid #C6E7D4" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: C.accent }} />
                  <p className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: C.accent }}>Bull Case</p>
                </div>
                <p className="text-[14px] leading-[1.7]" style={{ color: C.body }}>{bull}</p>
              </div>
            )}
            {bear && (
              <div className="rounded-[8px] p-6" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#DC2626" }} />
                  <p className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: "#DC2626" }}>Bear Case</p>
                </div>
                <p className="text-[14px] leading-[1.7]" style={{ color: C.body }}>{bear}</p>
              </div>
            )}
          </div>
        )}

        {/* ══════ ARTICLE BODY (Story + Market Context + At a Glance) ══════ */}
        {bodyWithout && (
          <div className="max-w-[640px] mx-auto mb-16"
            style={{ color: C.body, fontSize: "17px", lineHeight: "1.8", letterSpacing: "-0.003em" }}
            dangerouslySetInnerHTML={{ __html: bodyWithout }}
          />
        )}

        {/* ══════ SUBMIT CTA ══════ */}
        <div className="rounded-[8px] overflow-hidden mb-16 flex" style={{ border: `1px solid ${C.border}`, background: C.surface }}>
          <div className="w-1.5 shrink-0" style={{ background: C.accent }} />
          <div className="p-8 md:p-10">
            <h3 className="text-[20px] md:text-[22px] font-bold tracking-[-0.02em] mb-2" style={{ fontFamily: SERIF, color: C.primary }}>Want your fund featured?</h3>
            <p className="text-[14px] mb-5" style={{ color: C.secondary }}>Upload your deck and get in front of qualified LPs. One fund featured every Monday.</p>
            <a href="#submit" className="inline-block text-[13px] font-semibold px-6 py-2.5 rounded-[4px]" style={{ background: C.accent, color: "#fff" }}>Submit Your Deck</a>
          </div>
        </div>

        {/* Subscribe */}
        <div id="subscribe" className="py-16 text-center">
          <h3 className="text-[22px] md:text-[26px] font-bold tracking-[-0.02em] mb-3" style={{ fontFamily: SERIF, color: C.primary }}>Don&apos;t miss the next feature</h3>
          <p className="text-[14px] mb-8 max-w-[360px] mx-auto" style={{ color: C.secondary }}>One fund. Every Monday. Performance data and market context.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[380px] mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 h-[46px] px-4 text-[14px] rounded-[4px] outline-none" style={{ border: `1.5px solid ${C.border}`, color: C.primary, background: C.surface }} />
            <button className="h-[46px] px-6 text-[13px] font-semibold rounded-[4px] shrink-0" style={{ background: C.accent, color: "#fff" }}>Subscribe</button>
          </div>
        </div>
      </article>

      <footer className="py-8" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-[900px] mx-auto px-6 flex items-center justify-between">
          <span className="text-[14px] font-bold" style={{ fontFamily: SERIF, color: C.primary }}>Weekly Alpha</span>
          <p className="text-[11px]" style={{ color: C.subtle }}>&copy; 2026 Weekly Alpha</p>
        </div>
      </footer>

      <style>{`
        article h2 { font-family: ${SERIF}; font-size: 22px; font-weight: 700; color: ${C.primary}; margin: 40px 0 16px; letter-spacing: -0.02em; border-bottom: 2px solid ${C.accent}; padding-bottom: 8px; display: inline-block; }
        article h2:first-child { margin-top: 0; }
        article p { margin: 0 0 18px; }
        article strong { color: ${C.accent}; font-weight: 700; }
        article ul { list-style: none; padding: 0; margin: 0 0 24px; }
        article li { font-size: 15px; line-height: 1.7; padding: 10px 0 10px 16px; border-bottom: 1px solid ${C.borderLight}; position: relative; }
        article li::before { content: ""; position: absolute; left: 0; top: 16px; width: 4px; height: 4px; border-radius: 50%; background: ${C.accent}; }
        article table { width: 100%; border-collapse: collapse; margin: 8px 0; border-radius: 8px; overflow: hidden; }
        article th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: ${C.subtle}; border-bottom: 2px solid ${C.border}; background: ${C.cream}; }
        article td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid ${C.borderLight}; }
        article td:first-child { color: ${C.subtle}; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; width: 40%; }
        article td:last-child { font-weight: 600; color: ${C.primary}; font-family: ${MONO}; font-variant-numeric: tabular-nums; }
        @media print { nav, #subscribe, footer { display: none; } }
      `}</style>
    </div>
  );
}

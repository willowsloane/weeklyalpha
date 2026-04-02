"use client";

import Link from "next/link";
import Image from "next/image";
import { FadeUp } from "../../components/Animations";
import { PercentileGauge, PeerComparisonChart, FeeComparison, MetricStrip } from "../../components/FundCharts";
import type { FeaturedIssue } from "@/lib/data";

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO = "var(--font-mono), 'IBM Plex Mono', monospace";

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4 px-5" style={{ borderRight: "1px solid var(--border-light)" }}>
      <p className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="text-[22px] font-bold tracking-[-0.02em] leading-none" style={{ color: "var(--text-primary)", fontFamily: MONO }}>{value}</p>
    </div>
  );
}

export function IssueClient({ issue }: { issue: FeaturedIssue }) {
  const stats = [
    issue.irrNet && { label: "Net IRR", value: issue.irrNet },
    issue.tvpi && { label: "TVPI", value: issue.tvpi },
    issue.dpi && { label: "DPI", value: issue.dpi },
    issue.fundSize && { label: "Fund Size", value: issue.fundSize },
    issue.carry && { label: "Carry", value: issue.carry },
    issue.hurdle && { label: "Hurdle", value: issue.hurdle },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="min-h-screen" style={{ background: "var(--white)" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-[860px] mx-auto px-6 h-[52px] flex items-center justify-between">
          <Link href="/" className="text-[17px] font-bold tracking-[-0.01em]" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
            Weekly Alpha
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>All Issues</Link>
            <Link href="#subscribe" className="text-[12px] font-semibold px-4 py-1.5 rounded-[4px]" style={{ background: "var(--green-deep)", color: "#fff" }}>Subscribe</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-[860px] mx-auto px-6 pt-8">
        <FadeUp>
          <div className="relative aspect-[3/1] md:aspect-[2.5/1] rounded-[12px] overflow-hidden">
            <Image src={issue.imageUrl} alt={issue.fundName} fill className="object-cover" sizes="860px" priority />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.05) 100%)" }} />
            {issue.irrNet && (
              <div className="absolute top-6 right-6 text-right">
                <p className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>Net IRR</p>
                <p className="text-[36px] font-bold tracking-[-0.03em] leading-none" style={{ color: "rgba(255,255,255,0.95)", fontFamily: MONO }}>{issue.irrNet}</p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-[3px]" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(12px)" }}>{issue.strategyLabel}</span>
                {issue.vintageYear && <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>{issue.vintageYear} Vintage</span>}
                {issue.fundSize && <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>{issue.fundSize}</span>}
              </div>
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-[-0.02em] leading-[1.1]" style={{ fontFamily: SERIF, color: "#fff" }}>{issue.fundName}</h2>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* Article */}
      <article className="max-w-[860px] mx-auto px-6">
        {/* Header */}
        <FadeUp delay={0.1}>
          <header className="pt-10 pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-[3px]" style={{ background: "var(--green-pale)", color: "var(--green-deep)" }}>
                {issue.strategyLabel}
              </span>
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{formatDate(issue.weekOf)}</span>
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>5 min read</span>
            </div>
            <h1
              className="text-[34px] md:text-[50px] font-bold tracking-[-0.03em] leading-[1.06] mb-5"
              style={{ fontFamily: SERIF, color: "var(--text-primary)" }}
            >
              {issue.subject}
            </h1>
            <p className="text-[18px] md:text-[20px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
              {issue.previewText}
            </p>
          </header>
        </FadeUp>

        {/* Stats bar */}
        {stats.length > 0 && (
          <FadeUp delay={0.15}>
            <div className="py-2 my-8 grid" style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 6)}, 1fr)`, border: "1px solid var(--border)", borderRadius: "8px", background: "var(--off-white)" }}>
              {stats.map((s) => (
                <StatBlock key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          </FadeUp>
        )}

        {/* Fund identity */}
        <FadeUp delay={0.2}>
          <div className="flex items-center gap-4 py-6 mb-2" style={{ borderBottom: "1px solid var(--border-light)" }}>
            <div className="w-10 h-10 rounded-[6px] flex items-center justify-center text-[14px] font-bold" style={{ background: issue.gradient, color: "#fff" }}>
              {issue.fundName.charAt(0)}
            </div>
            <div>
              <p className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>{issue.fundName}</p>
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                {issue.gpName ? `${issue.gpName} · ` : ""}{issue.strategyLabel}{issue.vintageYear ? ` · ${issue.vintageYear} vintage` : ""}
              </p>
            </div>
          </div>
        </FadeUp>

        {/* ── Visual Charts ── */}

        {/* Percentile gauges */}
        {issue.irrPercentile != null && (
          <FadeUp delay={0.25}>
            <div className="flex flex-wrap justify-center gap-10 py-8 my-6 rounded-[10px]" style={{ background: "#F5F3EF", border: "1px solid #E8E5E0" }}>
              {issue.irrNet && issue.irrPercentile != null && (
                <PercentileGauge value={issue.irrNet} label="Net IRR" percentile={issue.irrPercentile} />
              )}
              {issue.tvpi && issue.tvpiX100 && (
                <PercentileGauge value={issue.tvpi} label="TVPI" percentile={75} />
              )}
              {issue.dpi && issue.dpiX100 && (
                <PercentileGauge value={issue.dpi} label="DPI" percentile={60} />
              )}
            </div>
          </FadeUp>
        )}

        {/* Peer comparison bar chart */}
        {issue.irrNetBps != null && issue.peerIrrMedian != null && (
          <FadeUp delay={0.3}>
            <div className="my-6">
              <PeerComparisonChart
                fundIrr={issue.irrNetBps / 100}
                peerQ1={issue.peerIrrQ1}
                peerMedian={issue.peerIrrMedian}
                peerQ3={issue.peerIrrQ3}
                fundLabel={issue.fundName.length > 25 ? issue.fundName.slice(0, 22) + "..." : issue.fundName}
              />
            </div>
          </FadeUp>
        )}

        {/* Fee comparison */}
        {issue.mgmtFeeBps != null && (
          <FadeUp delay={0.35}>
            <div className="my-6">
              <FeeComparison items={[
                { label: "Management Fee", fundValue: issue.mgmtFeeBps ? issue.mgmtFeeBps / 100 : null, peerValue: issue.peerFeeMedian, unit: "%", lowerIsBetter: true },
                { label: "Carried Interest", fundValue: issue.carryBps ? issue.carryBps / 100 : null, peerValue: 20, unit: "%", lowerIsBetter: true },
                { label: "Hurdle Rate", fundValue: issue.hurdleBps ? issue.hurdleBps / 100 : null, peerValue: 8, unit: "%", lowerIsBetter: false },
              ]} />
            </div>
          </FadeUp>
        )}

        {/* Divider before body */}
        <div className="my-8" style={{ height: "1px", background: "#E8E5E0" }} />

        {/* Body content */}
        <FadeUp delay={0.4}>
          {(issue.bodyHtml) ? (
            <div
              className="py-8"
              style={{
                color: "var(--text-body)",
                fontSize: "17px",
                lineHeight: "1.8",
                letterSpacing: "-0.003em",
              }}
              dangerouslySetInnerHTML={{ __html: issue.bodyHtml }}
            />
          ) : (
            <div className="py-20 text-center rounded-[10px] my-8" style={{ background: "var(--off-white)", border: "1px solid var(--border-light)" }}>
              <p className="text-[16px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Full analysis generating</p>
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>The agent pipeline is producing content for this issue. Check back shortly.</p>
            </div>
          )}
        </FadeUp>

        {/* Divider */}
        <div className="my-8" style={{ height: "1px", background: "var(--border)" }} />

        {/* Subscribe CTA */}
        <FadeUp>
          <div id="subscribe" className="py-12 text-center">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: "var(--green)" }}>Next Issue</p>
            <h3 className="text-[26px] md:text-[34px] font-bold tracking-[-0.02em] mb-3" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
              Don&apos;t miss the next feature
            </h3>
            <p className="text-[15px] mb-8 max-w-[400px] mx-auto" style={{ color: "var(--text-secondary)" }}>
              One exceptional fund. Benchmarked. Analyzed. Every Monday morning.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[420px] mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 h-[48px] px-4 text-[14px] rounded-[4px] outline-none" style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              <button className="h-[48px] px-6 text-[13px] font-semibold rounded-[4px] shrink-0" style={{ background: "var(--green-deep)", color: "#fff" }}>Subscribe Free</button>
            </div>
          </div>
        </FadeUp>
      </article>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-[860px] mx-auto px-6 flex items-center justify-between">
          <span className="text-[15px] font-bold" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>Weekly Alpha</span>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>&copy; 2026 Weekly Alpha</p>
        </div>
      </footer>

      {/* Global article typography + Gemini content overrides */}
      <style>{`
        article h2 { font-family: ${SERIF}; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin: 2.5em 0 0.8em; color: #1A1714; line-height: 1.2; }
        article h3 { font-family: ${SERIF}; font-size: 20px; font-weight: 700; letter-spacing: -0.01em; margin: 2em 0 0.6em; color: #1A1714; line-height: 1.25; }
        article p { margin: 0 0 1.3em; color: #2D2A26; }
        article strong, article b { color: #1A1714; font-weight: 700; }
        article ul, article ol { margin: 0 0 1.3em; padding-left: 1.5em; }
        article li { margin-bottom: 0.5em; }
        article blockquote { margin: 2em 0; padding: 1.2em 1.5em; border-left: 3px solid #064E37; background: #F5F3EF; border-radius: 0 8px 8px 0; font-style: normal; color: #2D2A26; }
        article table { width: 100%; border-collapse: collapse; margin: 1.5em 0; font-size: 15px; }
        article th { text-align: left; padding: 12px 14px; border-bottom: 2px solid #E8E5E0; font-weight: 700; color: #1A1714; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
        article td { padding: 12px 14px; border-bottom: 1px solid #F0EDE8; color: #2D2A26; }
        article code { font-family: ${MONO}; background: #F5F3EF; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
        article hr { border: none; height: 1px; background: #E8E5E0; margin: 2.5em 0; }
        article a { color: #064E37; text-decoration: underline; text-underline-offset: 3px; }
        /* Fix Gemini grid layouts */
        article section { margin: 0 0 2em; }
        article div[style*="grid"] { max-width: 100%; overflow: hidden; }
        article div[style*="display: grid"] { gap: 12px; }
        /* Fix bar chart widths */
        article div[style*="background-color: #064E37"], article div[style*="background: #064E37"] { min-height: 24px; border-radius: 4px; }
        article div[style*="background-color: #E8E5E0"], article div[style*="background: #E8E5E0"] { min-height: 24px; border-radius: 4px; }
        /* Risk factor styling */
        article div[style*="border-left: 3px solid #DC2626"] { padding: 12px 16px; margin-bottom: 12px; background: #FEF2F2; border-radius: 0 6px 6px 0; }
        /* Callout boxes */
        article div[style*="background-color: #F5F3EF"], article div[style*="background: #F5F3EF"] { border-radius: 8px; padding: 20px; margin: 1em 0; }
        article div[style*="background-color: #F5F3EF"] p, article div[style*="background: #F5F3EF"] p { margin-bottom: 0.6em; }
      `}</style>
    </div>
  );
}

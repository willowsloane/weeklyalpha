"use client";

import Link from "next/link";
import { FundHeroImage } from "../../components/FundHeroImage";
import { FadeUp } from "../../components/Animations";
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
          <FundHeroImage
            strategy={issue.strategyLabel}
            fundName={issue.fundName}
            gradient={issue.gradient}
            irrNet={issue.irrNet}
            tvpi={issue.tvpi}
            vintageYear={issue.vintageYear}
            fundSize={issue.fundSize}
          />
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

        {/* Body content */}
        <FadeUp delay={0.25}>
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

      {/* Global article typography */}
      <style>{`
        article h2 { font-family: ${SERIF}; font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin: 2.5em 0 0.8em; color: var(--text-primary); line-height: 1.2; }
        article h3 { font-family: ${SERIF}; font-size: 21px; font-weight: 700; letter-spacing: -0.01em; margin: 2em 0 0.6em; color: var(--text-primary); line-height: 1.25; }
        article p { margin: 0 0 1.4em; }
        article strong, article b { color: var(--text-primary); font-weight: 600; }
        article ul, article ol { margin: 0 0 1.4em; padding-left: 1.5em; }
        article li { margin-bottom: 0.5em; }
        article blockquote { margin: 2em 0; padding: 1.2em 1.5em; border-left: 3px solid var(--green-deep); background: var(--off-white); border-radius: 0 8px 8px 0; font-style: italic; color: var(--text-secondary); }
        article table { width: 100%; border-collapse: collapse; margin: 2em 0; font-size: 14px; }
        article th { text-align: left; padding: 10px 12px; border-bottom: 2px solid var(--border); font-weight: 600; color: var(--text-primary); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
        article td { padding: 10px 12px; border-bottom: 1px solid var(--border-light); color: var(--text-body); }
        article code { font-family: ${MONO}; background: var(--off-white); padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
        article hr { border: none; height: 1px; background: var(--border); margin: 2.5em 0; }
        article a { color: var(--green-deep); text-decoration: underline; text-underline-offset: 2px; }
      `}</style>
    </div>
  );
}

"use client";

import { FadeUp, StaggerCards, StaggerChild, BackgroundLines, BarAnimation } from "./Animations";
import { NewsSection } from "./NewsSection";
import type { FeaturedIssue } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO = "var(--font-mono), monospace";

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function HomeClient({ featured, pastIssues, isLive }: { featured: FeaturedIssue; pastIssues: FeaturedIssue[]; isLive: boolean }) {
  const stats = [
    { value: featured.irrNet || "—", label: "Net IRR", note: "Top Quartile" },
    { value: featured.tvpi || "—", label: "TVPI", note: featured.tvpi ? "vs peers" : "" },
    { value: featured.dpi || "—", label: "DPI", note: featured.dpi ? "Distributions" : "" },
    { value: `${featured.carry?.replace("%", "") || "20"}/${featured.hurdle?.replace("%", "") || "8"}`, label: "Carry / Hurdle", note: "Fund terms" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Top bar ── */}
      <div className="py-3 text-center" style={{ background: "var(--green-deep)", color: "rgba(255,255,255,0.9)" }}>
        <p className="text-[13px] font-medium tracking-[0.02em]">
          Smart private fund intelligence — delivered free, every Monday.{" "}
          <a href="#subscribe" className="underline font-semibold" style={{ color: "#fff" }}>Subscribe now &rarr;</a>
        </p>
      </div>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <a href="#subscribe" className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Subscribe</a>
            <a href="#preview" className="hidden md:block text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Latest Issue</a>
            <a href="#how" className="hidden md:block text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>How It Works</a>
          </div>
          <div className="flex items-center gap-6">
            <a href="#gp" className="hidden md:block text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Submit a Fund</a>
            <a href="#subscribe" className="text-[12px] font-semibold px-4 py-2 rounded-[4px] tracking-[0.02em]" style={{ background: "var(--text-primary)", color: "#fff" }}>
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero: Massive title ── */}
      <section className="relative overflow-hidden" style={{ background: "var(--off-white)" }}>
        <BackgroundLines />
        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 md:pt-24 pb-8">
          <div className="text-center">
            <FadeUp>
              <h1 className="text-[72px] md:text-[120px] lg:text-[140px] font-extrabold tracking-[-0.04em] leading-[0.9] mb-5" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
                Weekly Alpha
              </h1>
            </FadeUp>
            <FadeUp delay={0.15}>
              <p className="text-[18px] md:text-[22px] font-medium tracking-[-0.01em] mb-3" style={{ color: "var(--green)" }}>
                Private fund intelligence for LPs, allocators &amp; fund managers
              </p>
            </FadeUp>
            <FadeUp delay={0.25}>
              <p className="text-[18px] font-medium mb-10" style={{ color: "var(--text-body)" }}>
                One exceptional fund. Benchmarked. Analyzed. Every Monday.
              </p>
            </FadeUp>
            <FadeUp delay={0.35}>
              <div className="flex flex-col sm:flex-row gap-3 max-w-[440px] mx-auto mb-4">
                <input type="email" placeholder="Enter your email" className="flex-1 h-[50px] px-5 text-[15px] rounded-[4px] outline-none transition-all focus:ring-2 focus:ring-[var(--green-accent)]" style={{ background: "#fff", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                <button className="h-[50px] px-7 text-[14px] font-semibold rounded-[4px] transition-all hover:opacity-90 shrink-0" style={{ background: "var(--green-deep)", color: "#fff" }}>
                  Subscribe Free
                </button>
              </div>
              <p className="text-[14px] font-medium mb-14" style={{ color: "var(--text-secondary)" }}>
                Over 30,000 fund documents analysed &middot; Free forever
              </p>
            </FadeUp>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-10"><div style={{ height: "1px", background: "var(--border)" }} /></div>

        {/* ── Featured article ── */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 md:py-16">
          <FadeUp delay={0.1}>
            <Link href={featured.pipelineRunId !== "placeholder" ? `/issue/${featured.pipelineRunId}` : "#preview"}>
              <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center group cursor-pointer">
                <div className="aspect-[4/3] rounded-[10px] overflow-hidden relative">
                  <Image src={featured.imageUrl} alt={featured.fundName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)" }} />
                  {featured.irrNet && (
                    <div className="absolute top-5 right-5">
                      <p className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>Net IRR</p>
                      <p className="text-[32px] font-bold tracking-[-0.03em] leading-none" style={{ color: "#fff", fontFamily: MONO }}>{featured.irrNet}</p>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    {isLive && <span className="text-[10px] font-bold tracking-[0.12em] uppercase mb-2 inline-flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.6)" }}><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Live from pipeline</span>}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-1 rounded-[3px]" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(12px)" }}>{featured.strategyLabel}</span>
                      {featured.vintageYear && <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>{featured.vintageYear} vintage</span>}
                      {featured.fundSize && <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>{featured.fundSize}</span>}
                    </div>
                    <h2 className="text-[26px] md:text-[32px] font-bold tracking-[-0.02em] leading-[1.1]" style={{ fontFamily: SERIF, color: "#fff" }}>{featured.fundName}</h2>
                  </div>
                </div>

                <div>
                  <span className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase mb-5 pb-2" style={{ color: "var(--green)", borderBottom: "2px solid var(--green)" }}>Featured Analysis</span>
                  <h3 className="text-[30px] md:text-[38px] font-bold tracking-[-0.025em] leading-[1.12] mb-5 group-hover:underline" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
                    {featured.subject}
                  </h3>
                  <p className="text-[16px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
                    {featured.previewText}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] font-semibold" style={{ color: "var(--text-muted)" }}>5 min read</span>
                    <span style={{ color: "var(--border)" }}>&middot;</span>
                    <span className="text-[12px] font-semibold" style={{ color: "var(--text-muted)" }}>{formatDate(featured.weekOf)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Key stats ── */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <StaggerCards className="grid grid-cols-2 md:grid-cols-4 divide-x" style={{ borderColor: "var(--border-light)" }}>
            {stats.map((stat) => (
              <StaggerChild key={stat.label} className="py-8 px-6 md:px-10 text-center">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-2" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                <p className="text-[36px] md:text-[42px] font-bold tracking-[-0.03em] leading-none mb-1" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
                <p className="text-[12px] font-medium" style={{ color: "var(--green)" }}>{stat.note}</p>
              </StaggerChild>
            ))}
          </StaggerCards>
        </div>
      </section>

      {/* ── Recent issues ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <FadeUp>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: "var(--green)" }}>Recent Issues</p>
                <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.025em] leading-[1.08]" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
                  Past featured funds
                </h2>
              </div>
            </div>
          </FadeUp>

          <StaggerCards className="grid md:grid-cols-3 gap-8">
            {pastIssues.map((issue) => (
              <StaggerChild key={issue.id}>
                <Link href={issue.pipelineRunId.startsWith("p") ? "#" : `/issue/${issue.pipelineRunId}`}>
                  <article className="group cursor-pointer">
                    <div className="aspect-[16/10] rounded-[8px] overflow-hidden mb-5 relative transition-transform group-hover:scale-[1.005]">
                      <Image src={issue.imageUrl} alt={issue.fundName} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] font-bold tracking-[0.08em] uppercase px-2 py-1 rounded-[3px]" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(8px)" }}>{issue.strategyLabel}</span>
                      </div>
                      {issue.irrNet && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[18px] font-bold" style={{ color: "#fff", fontFamily: MONO }}>{issue.irrNet}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-[20px] font-bold tracking-[-0.015em] leading-[1.25] mb-2.5 group-hover:underline" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
                      {issue.fundName}
                    </h3>
                    <p className="text-[15px] leading-[1.6] mb-3" style={{ color: "var(--text-body)" }}>
                      {issue.previewText || `${issue.strategyLabel} fund analysis with performance data and peer benchmarks.`}
                    </p>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--text-secondary)" }}>{formatDate(issue.weekOf)}</p>
                  </article>
                </Link>
              </StaggerChild>
            ))}
          </StaggerCards>
        </div>
      </section>

      {/* ── Market News ── */}
      <NewsSection />

      {/* ── How it works ── */}
      <section id="how" style={{ background: "var(--off-white)", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 md:py-28">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "var(--green)" }}>How It Works</p>
              <h2 className="text-[32px] md:text-[48px] font-bold tracking-[-0.025em] leading-[1.08]" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
                Institutional intelligence,<br className="hidden md:block" /> delivered simply.
              </h2>
            </div>
          </FadeUp>
          <StaggerCards className="grid md:grid-cols-3 gap-10 lg:gap-16">
            {[
              { num: "01", title: "Sourced & Verified", body: "We identify private funds with compelling track records and verify performance data against public filings and LP references." },
              { num: "02", title: "Benchmarked", body: "Each fund is ranked against peers by strategy, vintage year, geography, and size — the same depth allocators pay thousands for." },
              { num: "03", title: "Delivered Monday", body: "A structured breakdown of performance, fees, terms, and our editorial take — designed to read in five minutes." },
            ].map((step) => (
              <StaggerChild key={step.num} className="text-center md:text-left">
                <span className="inline-block text-[13px] font-semibold tracking-[0.08em] mb-5" style={{ color: "var(--green)", fontFamily: MONO }}>{step.num}</span>
                <h3 className="text-[22px] font-bold tracking-[-0.015em] mb-3" style={{ color: "var(--text-primary)" }}>{step.title}</h3>
                <p className="text-[15px] leading-[1.65]" style={{ color: "var(--text-secondary)" }}>{step.body}</p>
              </StaggerChild>
            ))}
          </StaggerCards>
        </div>
      </section>

      {/* ── Benchmark preview ── */}
      <section id="preview" className="py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <FadeUp>
            <div className="text-center mb-14">
              <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "var(--green)" }}>Inside Every Issue</p>
              <h2 className="text-[32px] md:text-[48px] font-bold tracking-[-0.025em] leading-[1.08]" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
                Real benchmarks. Real data.
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="max-w-[800px] mx-auto rounded-[10px] overflow-hidden" style={{ background: "var(--off-white)", border: "1px solid var(--border)" }}>
              <div className="px-8 md:px-10 py-8">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-7" style={{ color: "var(--text-muted)" }}>
                  Peer Benchmark — {featured.strategyLabel}, {featured.vintageYear || 2022} Vintage
                </p>
                <div className="space-y-5">
                  {[
                    { label: "This Fund", pct: 82, active: true },
                    { label: "Top Quartile", pct: 75, active: false },
                    { label: "Median", pct: 50, active: false },
                    { label: "Bottom Quartile", pct: 25, active: false },
                  ].map((bar, i) => (
                    <div key={bar.label} className="flex items-center gap-5">
                      <span className="text-[13px] font-medium w-32 shrink-0" style={{ color: bar.active ? "var(--text-primary)" : "var(--text-muted)" }}>{bar.label}</span>
                      <BarAnimation width={bar.pct} active={bar.active} delay={i * 0.1} />
                      <span className="text-[13px] font-bold w-12 text-right" style={{ color: bar.active ? "var(--green-deep)" : "var(--text-muted)", fontFamily: MONO }}>{bar.pct}th</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mx-8 md:mx-10" style={{ height: "1px", background: "var(--border)" }} />
              <div className="px-8 md:px-10 py-8 grid grid-cols-2 gap-6">
                {["Performance Breakdown", "Peer Benchmarking", "Fee & Term Analysis", "Editorial Commentary"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="var(--green-pale)"/><path d="M5 8L7 10L11 6" stroke="var(--green-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="text-[14px] font-medium" style={{ color: "var(--text-body)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── For GPs ── */}
      <section id="gp" className="relative overflow-hidden py-20 md:py-28" style={{ background: "var(--green-deep)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <line x1="25%" y1="0" x2="25%" y2="100%" stroke="white" strokeWidth="0.5" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="0.5" />
            <line x1="75%" y1="0" x2="75%" y2="100%" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="max-w-[960px] mx-auto grid md:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div>
                <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "var(--green-accent)" }}>For Fund Managers</p>
                <h2 className="text-[30px] md:text-[42px] font-bold tracking-[-0.025em] leading-[1.08] mb-5" style={{ fontFamily: SERIF, color: "#fff" }}>
                  Get your fund in front of qualified LPs.
                </h2>
                <p className="text-[16px] leading-[1.65] mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
                  If you&apos;re fundraising, submit your fund for consideration. One fund is featured each week to our network of allocators and family offices.
                </p>
                <a href="#submit" className="inline-flex items-center gap-2 text-[14px] font-semibold px-7 py-3.5 rounded-[4px] transition-all hover:opacity-90" style={{ background: "#fff", color: "var(--green-deep)" }}>
                  Submit Your Fund
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </FadeUp>
            <StaggerCards className="space-y-5">
              {[
                { metric: "30,000+", label: "Fund documents analysed" },
                { metric: "52%", label: "Average open rate" },
                { metric: "100%", label: "Institutional audience" },
              ].map((stat) => (
                <StaggerChild key={stat.label}>
                  <div className="flex items-baseline justify-between pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-[34px] font-bold tracking-[-0.02em]" style={{ color: "#fff" }}>{stat.metric}</span>
                    <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</span>
                  </div>
                </StaggerChild>
              ))}
            </StaggerCards>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="subscribe" className="relative overflow-hidden py-24 md:py-36" style={{ background: "var(--off-white)" }}>
        <BackgroundLines />
        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 text-center">
          <FadeUp>
            <h2 className="text-[40px] md:text-[72px] font-bold tracking-[-0.04em] leading-[1.02] mb-6" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
              Start your Monday<br className="hidden md:block" /> with alpha.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-[17px] mb-10 max-w-[440px] mx-auto leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
              Built on analysis of over 30,000 private fund documents — institutional-grade intelligence, delivered weekly.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[460px] mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 h-[54px] px-5 text-[15px] rounded-[4px] outline-none transition-all focus:ring-2 focus:ring-[var(--green-accent)]" style={{ background: "#fff", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              <button className="h-[54px] px-8 text-[14px] font-semibold rounded-[4px] transition-all hover:opacity-90 shrink-0" style={{ background: "var(--green-deep)", color: "#fff" }}>
                Subscribe Free
              </button>
            </div>
            <p className="mt-5 text-[12px]" style={{ color: "var(--text-muted)" }}>Free forever &middot; No spam &middot; Unsubscribe anytime</p>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[18px] font-bold tracking-[-0.01em]" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>Weekly Alpha</span>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[13px]" style={{ color: "var(--text-muted)" }}>Privacy</a>
            <a href="#" className="text-[13px]" style={{ color: "var(--text-muted)" }}>Terms</a>
            <a href="#" className="text-[13px]" style={{ color: "var(--text-muted)" }}>Contact</a>
          </div>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>&copy; 2026 Weekly Alpha</p>
        </div>
      </footer>
    </div>
  );
}

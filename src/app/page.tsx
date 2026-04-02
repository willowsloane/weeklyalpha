import {
  FadeUp,
  StaggerCards,
  StaggerChild,
  BackgroundLines,
  BarAnimation,
} from "./components/Animations";

export default function Home() {
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
            <a href="#subscribe" className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>Subscribe</a>
            <a href="#preview" className="hidden md:block text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>Latest Issue</a>
            <a href="#how" className="hidden md:block text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>How It Works</a>
          </div>
          <div className="flex items-center gap-6">
            <a href="#gp" className="hidden md:block text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>Submit a Fund</a>
            <a
              href="#subscribe"
              className="text-[12px] font-semibold px-4 py-2 rounded-[4px] tracking-[0.02em]"
              style={{ background: "var(--text-primary)", color: "#fff" }}
            >
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
              <h1
                className="text-[72px] md:text-[120px] lg:text-[140px] font-extrabold tracking-[-0.04em] leading-[0.9] mb-5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
              >
                Weekly Alpha
              </h1>
            </FadeUp>
            <FadeUp delay={0.15}>
              <p
                className="text-[18px] md:text-[22px] font-medium tracking-[-0.01em] mb-3"
                style={{ color: "var(--green)" }}
              >
                Private fund intelligence for LPs, allocators & fund managers
              </p>
            </FadeUp>
            <FadeUp delay={0.25}>
              <p className="text-[15px] mb-10" style={{ color: "var(--text-muted)" }}>
                One exceptional fund. Benchmarked. Analyzed. Every Monday.
              </p>
            </FadeUp>

            {/* Email inline */}
            <FadeUp delay={0.35}>
              <div className="flex flex-col sm:flex-row gap-3 max-w-[440px] mx-auto mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-[50px] px-5 text-[15px] rounded-[4px] outline-none transition-all focus:ring-2 focus:ring-[var(--green-accent)]"
                  style={{ background: "#fff", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                />
                <button
                  className="h-[50px] px-7 text-[14px] font-semibold rounded-[4px] transition-all hover:opacity-90 shrink-0"
                  style={{ background: "var(--green-deep)", color: "#fff" }}
                >
                  Subscribe Free
                </button>
              </div>
              <p className="text-[12px] mb-14" style={{ color: "var(--text-muted)" }}>
                Join 2,400+ fund professionals &middot; Free forever
              </p>
            </FadeUp>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div style={{ height: "1px", background: "var(--border)" }} />
        </div>

        {/* ── Featured article / hero image ── */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 md:py-16">
          <FadeUp delay={0.1}>
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Image */}
              <div
                className="aspect-[4/3] rounded-[10px] overflow-hidden relative"
                style={{
                  background: "linear-gradient(135deg, #064E37 0%, #0A7B55 40%, #21759B 100%)",
                }}
              >
                {/* Decorative finance visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="320" height="240" viewBox="0 0 320 240" fill="none" className="opacity-20">
                    <path d="M20 200L60 160L100 180L140 120L180 140L220 80L260 100L300 40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 200L60 170L100 190L140 140L180 155L220 100L260 115L300 60" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
                    <circle cx="140" cy="120" r="4" fill="white" opacity="0.8"/>
                    <circle cx="220" cy="80" r="4" fill="white" opacity="0.8"/>
                    <circle cx="300" cy="40" r="4" fill="white" opacity="0.8"/>
                  </svg>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                    This Week&apos;s Feature
                  </span>
                  <h2 className="text-[28px] md:text-[36px] font-bold tracking-[-0.02em] leading-[1.1] mb-2" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#fff" }}>
                    Meridian Ventures Fund III
                  </h2>
                  <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Early-stage venture &middot; 2022 vintage &middot; $180M &middot; Top quartile IRR
                  </p>
                </div>
              </div>

              {/* Featured text */}
              <div>
                <span className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase mb-5 pb-2" style={{ color: "var(--green)", borderBottom: "2px solid var(--green)" }}>
                  Featured Analysis
                </span>
                <h3
                  className="text-[30px] md:text-[38px] font-bold tracking-[-0.025em] leading-[1.12] mb-5"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
                >
                  How Meridian&apos;s Fund III became the top-performing 2022 vintage vehicle
                </h3>
                <p className="text-[16px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
                  With a net IRR of 28.4% and TVPI of 1.8x, Meridian Ventures Fund III has quietly become one of the standout early-stage vehicles of its vintage. We break down the portfolio, the team, and what it means for LPs evaluating re-ups.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold" style={{ color: "var(--text-muted)" }}>5 min read</span>
                  </div>
                  <span style={{ color: "var(--border)" }}>&middot;</span>
                  <span className="text-[12px] font-semibold" style={{ color: "var(--text-muted)" }}>March 31, 2026</span>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Divider with key stats ── */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <StaggerCards className="grid grid-cols-2 md:grid-cols-4 divide-x" style={{ borderColor: "var(--border-light)" }}>
            {[
              { value: "28.4%", label: "Net IRR", note: "Top Quartile" },
              { value: "1.8x", label: "TVPI", note: "vs 1.4x median" },
              { value: "0.6x", label: "DPI", note: "Early distributions" },
              { value: "20/8", label: "Carry / Hurdle", note: "Standard terms" },
            ].map((stat) => (
              <StaggerChild key={stat.label} className="py-8 px-6 md:px-10 text-center">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-2" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                <p className="text-[36px] md:text-[42px] font-bold tracking-[-0.03em] leading-none mb-1" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
                <p className="text-[12px] font-medium" style={{ color: "var(--green)" }}>{stat.note}</p>
              </StaggerChild>
            ))}
          </StaggerCards>
        </div>
      </section>

      {/* ── Recent issues grid ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <FadeUp>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: "var(--green)" }}>Recent Issues</p>
                <h2
                  className="text-[32px] md:text-[42px] font-bold tracking-[-0.025em] leading-[1.08]"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
                >
                  Past featured funds
                </h2>
              </div>
              <a href="#" className="hidden md:block text-[14px] font-semibold" style={{ color: "var(--green-deep)" }}>
                View all &rarr;
              </a>
            </div>
          </FadeUp>

          <StaggerCards className="grid md:grid-cols-3 gap-8">
            {[
              {
                tag: "Private Equity",
                tagColor: "#7C3AED",
                title: "Summit Partners Growth Equity VI",
                desc: "Growth equity vehicle targeting $2B+ with a focus on technology-enabled services. 22.1% net IRR positions it firmly in the top quartile.",
                date: "Mar 24, 2026",
                gradient: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 60%, #A78BFA 100%)",
              },
              {
                tag: "Venture Capital",
                tagColor: "#059669",
                title: "Foundry Group Next Fund II",
                desc: "Boulder-based early-stage firm known for thesis-driven investing in infrastructure software. Consistent top-decile returns since 2007.",
                date: "Mar 17, 2026",
                gradient: "linear-gradient(135deg, #064E37 0%, #059669 60%, #34D399 100%)",
              },
              {
                tag: "Real Estate",
                tagColor: "#D97706",
                title: "Starwood Opportunity Fund XII",
                desc: "Opportunistic real estate fund focused on distressed assets and value-add properties across North America and Europe.",
                date: "Mar 10, 2026",
                gradient: "linear-gradient(135deg, #92400E 0%, #D97706 60%, #FCD34D 100%)",
              },
            ].map((issue) => (
              <StaggerChild key={issue.title}>
                <article className="group cursor-pointer">
                  {/* Card image */}
                  <div
                    className="aspect-[16/10] rounded-[8px] overflow-hidden mb-5 relative transition-transform group-hover:scale-[1.01]"
                    style={{ background: issue.gradient }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-15">
                      <svg width="200" height="150" viewBox="0 0 200 150" fill="none">
                        <path d="M10 130L40 100L70 115L100 70L130 90L160 50L190 30" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span
                        className="text-[11px] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-[3px]"
                        style={{ background: "rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(8px)" }}
                      >
                        {issue.tag}
                      </span>
                    </div>
                  </div>
                  {/* Card text */}
                  <h3
                    className="text-[20px] font-bold tracking-[-0.015em] leading-[1.25] mb-2.5 group-hover:underline"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
                  >
                    {issue.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] mb-3" style={{ color: "var(--text-secondary)" }}>
                    {issue.desc}
                  </p>
                  <p className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>{issue.date}</p>
                </article>
              </StaggerChild>
            ))}
          </StaggerCards>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ background: "var(--off-white)", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-20 md:py-28">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "var(--green)" }}>How It Works</p>
              <h2
                className="text-[32px] md:text-[48px] font-bold tracking-[-0.025em] leading-[1.08]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
              >
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
                <span className="inline-block text-[13px] font-semibold tracking-[0.08em] mb-5" style={{ color: "var(--green)", fontFamily: "var(--font-mono), monospace" }}>
                  {step.num}
                </span>
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
              <h2
                className="text-[32px] md:text-[48px] font-bold tracking-[-0.025em] leading-[1.08]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
              >
                Real benchmarks. Real data.
              </h2>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="max-w-[800px] mx-auto rounded-[10px] overflow-hidden" style={{ background: "var(--off-white)", border: "1px solid var(--border)" }}>
              <div className="px-8 md:px-10 py-8">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-7" style={{ color: "var(--text-muted)" }}>
                  Peer Benchmark — Early-Stage Venture, 2022 Vintage
                </p>
                <div className="space-y-5">
                  {[
                    { label: "This Fund", pct: 82, active: true },
                    { label: "Top Quartile", pct: 75, active: false },
                    { label: "Median", pct: 50, active: false },
                    { label: "Bottom Quartile", pct: 25, active: false },
                  ].map((bar, i) => (
                    <div key={bar.label} className="flex items-center gap-5">
                      <span className="text-[13px] font-medium w-32 shrink-0" style={{ color: bar.active ? "var(--text-primary)" : "var(--text-muted)" }}>
                        {bar.label}
                      </span>
                      <BarAnimation width={bar.pct} active={bar.active} delay={i * 0.1} />
                      <span className="text-[13px] font-bold w-12 text-right" style={{ color: bar.active ? "var(--green-deep)" : "var(--text-muted)", fontFamily: "var(--font-mono), monospace" }}>
                        {bar.pct}th
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-8 md:mx-10" style={{ height: "1px", background: "var(--border)" }} />

              {/* What's included */}
              <div className="px-8 md:px-10 py-8 grid grid-cols-2 gap-6">
                {[
                  "Performance Breakdown",
                  "Peer Benchmarking",
                  "Fee & Term Analysis",
                  "Editorial Commentary",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="var(--green-pale)"/>
                      <path d="M5 8L7 10L11 6" stroke="var(--green-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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
                <h2 className="text-[30px] md:text-[42px] font-bold tracking-[-0.025em] leading-[1.08] mb-5" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#fff" }}>
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
                { metric: "2,400+", label: "LP subscribers" },
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
            <h2
              className="text-[40px] md:text-[72px] font-bold tracking-[-0.04em] leading-[1.02] mb-6"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
            >
              Start your Monday<br className="hidden md:block" /> with alpha.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-[17px] mb-10 max-w-[440px] mx-auto leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
              Join 2,400+ fund professionals who start every week with institutional-grade private fund analysis.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[460px] mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-[54px] px-5 text-[15px] rounded-[4px] outline-none transition-all focus:ring-2 focus:ring-[var(--green-accent)]"
                style={{ background: "#fff", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              />
              <button
                className="h-[54px] px-8 text-[14px] font-semibold rounded-[4px] transition-all hover:opacity-90 shrink-0"
                style={{ background: "var(--green-deep)", color: "#fff" }}
              >
                Subscribe Free
              </button>
            </div>
            <p className="mt-5 text-[12px]" style={{ color: "var(--text-muted)" }}>
              Free forever &middot; No spam &middot; Unsubscribe anytime
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[18px] font-bold tracking-[-0.01em]" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}>
            Weekly Alpha
          </span>
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

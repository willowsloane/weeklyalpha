import {
  FadeUp,
  StaggerCards,
  StaggerChild,
  AnimatedTitle,
  BackgroundLines,
  BarAnimation,
} from "./components/Animations";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm" style={{ borderBottom: "1px solid var(--border-light)" }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <span
              className="text-[22px] font-bold tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
            >
              Weekly Alpha
            </span>
          </a>
          <div className="flex items-center gap-8">
            <a href="#how" className="hidden md:block text-[15px] font-medium" style={{ color: "var(--text-secondary)" }}>How It Works</a>
            <a href="#preview" className="hidden md:block text-[15px] font-medium" style={{ color: "var(--text-secondary)" }}>Preview</a>
            <a
              href="#subscribe"
              className="text-[14px] font-semibold px-5 py-2.5 rounded-[6px] transition-colors hover:opacity-90"
              style={{ background: "var(--green-deep)", color: "#fff" }}
            >
              Subscribe Free
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: "var(--off-white)" }}>
        <BackgroundLines />

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="max-w-[760px] mx-auto text-center">

            <FadeUp>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10" style={{ background: "var(--green-pale)" }}>
                <span className="w-2 h-2 rounded-full pulse-soft" style={{ background: "var(--green)" }} />
                <span className="text-[13px] font-semibold" style={{ color: "var(--green-deep)" }}>
                  Delivered every Monday
                </span>
              </div>
            </FadeUp>

            <h1
              className="text-[48px] md:text-[76px] leading-[1.02] font-bold tracking-[-0.035em] mb-8"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
            >
              <AnimatedTitle text="One fund." />
              <br />
              <AnimatedTitle text="Every week." />
            </h1>

            <FadeUp delay={0.3}>
              <p className="text-[18px] md:text-[22px] leading-[1.55] mb-12 max-w-[560px] mx-auto" style={{ color: "var(--text-body)" }}>
                Private fund analysis with real performance data, peer benchmarks, and strategic commentary — in your inbox every Monday.
              </p>
            </FadeUp>

            <FadeUp delay={0.45}>
              <div className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-[54px] px-5 text-[15px] rounded-[6px] transition-all outline-none focus:ring-2 focus:ring-[var(--green-accent)]"
                  style={{ background: "var(--white)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
                />
                <button
                  className="h-[54px] px-8 text-[15px] font-semibold rounded-[6px] transition-all hover:opacity-90 shrink-0"
                  style={{ background: "var(--green-deep)", color: "#fff" }}
                >
                  Subscribe
                </button>
              </div>
            </FadeUp>

            <FadeUp delay={0.55}>
              <p className="mt-5 text-[13px]" style={{ color: "var(--text-muted)" }}>
                Free. No spam. Unsubscribe anytime.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="py-12" style={{ borderBottom: "1px solid var(--border-light)" }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <FadeUp>
            <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-center mb-8" style={{ color: "var(--text-muted)" }}>
              Trusted by professionals at
            </p>
          </FadeUp>
          <StaggerCards className="flex flex-wrap items-center justify-center gap-x-14 gap-y-5">
            {["Blackstone", "KKR", "Tiger Global", "Sequoia", "a16z", "Bridgewater", "Apollo"].map((firm) => (
              <StaggerChild key={firm}>
                <span className="text-[15px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-muted)" }}>
                  {firm}
                </span>
              </StaggerChild>
            ))}
          </StaggerCards>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-24 md:py-36">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <FadeUp>
            <div className="text-center mb-20">
              <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "var(--green)" }}>How It Works</p>
              <h2
                className="text-[36px] md:text-[52px] font-bold tracking-[-0.025em] leading-[1.08]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
              >
                Institutional intelligence,<br className="hidden md:block" /> delivered simply.
              </h2>
            </div>
          </FadeUp>

          <StaggerCards className="grid md:grid-cols-3 gap-8 lg:gap-14">
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
                <p className="text-[16px] leading-[1.65]" style={{ color: "var(--text-secondary)" }}>{step.body}</p>
              </StaggerChild>
            ))}
          </StaggerCards>
        </div>
      </section>

      {/* ── Sample issue ── */}
      <section id="preview" style={{ background: "var(--off-white)" }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-24 md:py-36">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "var(--green)" }}>Preview</p>
              <h2
                className="text-[36px] md:text-[52px] font-bold tracking-[-0.025em] leading-[1.08]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
              >
                What you&apos;ll get.
              </h2>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div
              className="max-w-[840px] mx-auto rounded-[14px] overflow-hidden"
              style={{ background: "var(--white)", border: "1px solid var(--border)", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
            >
              {/* Header */}
              <div className="px-8 md:px-10 pt-8 md:pt-10 pb-6" style={{ borderBottom: "1px solid var(--border-light)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[12px] font-semibold tracking-[0.06em] uppercase px-3 py-1.5 rounded-[4px]" style={{ background: "var(--green-pale)", color: "var(--green-deep)" }}>
                    Issue #12
                  </span>
                  <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>March 31, 2026</span>
                </div>
                <h3
                  className="text-[28px] md:text-[36px] font-bold tracking-[-0.02em] mb-2"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
                >
                  Meridian Ventures Fund III
                </h3>
                <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
                  Early-stage venture &middot; 2022 vintage &middot; $180M target
                </p>
              </div>

              {/* Stats */}
              <StaggerCards className="grid grid-cols-2 md:grid-cols-4" style={{ borderBottom: "1px solid var(--border-light)" }}>
                {[
                  { label: "Net IRR", value: "28.4%", note: "Top Quartile" },
                  { label: "TVPI", value: "1.8x", note: "vs 1.4x median" },
                  { label: "DPI", value: "0.6x", note: "Early distributions" },
                  { label: "Carry", value: "20%", note: "8% hurdle" },
                ].map((stat, i) => (
                  <StaggerChild
                    key={stat.label}
                    className="px-6 md:px-8 py-6"
                  >
                    <div style={{ borderRight: i < 3 ? "1px solid var(--border-light)" : "none" }} className="pr-4">
                      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-2" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                      <p className="text-[30px] font-bold tracking-[-0.02em] leading-none mb-1.5" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
                      <p className="text-[12px] font-medium" style={{ color: "var(--green)" }}>{stat.note}</p>
                    </div>
                  </StaggerChild>
                ))}
              </StaggerCards>

              {/* Benchmark bars — animated */}
              <div className="px-8 md:px-10 py-8">
                <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-6" style={{ color: "var(--text-muted)" }}>
                  Peer Benchmark — Early-Stage Venture, 2022
                </p>
                <div className="space-y-4">
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
                      <span className="text-[13px] font-semibold w-12 text-right" style={{ color: bar.active ? "var(--green-deep)" : "var(--text-muted)", fontFamily: "var(--font-mono), monospace" }}>
                        {bar.pct}th
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── What's inside ── */}
      <section className="py-24 md:py-36">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <FadeUp>
            <div className="text-center mb-20">
              <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "var(--green)" }}>Every Issue</p>
              <h2
                className="text-[36px] md:text-[52px] font-bold tracking-[-0.025em] leading-[1.08]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
              >
                More than a summary.
              </h2>
            </div>
          </FadeUp>

          <StaggerCards className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
            {[
              { title: "Performance Breakdown", body: "Net IRR, TVPI, DPI, and RVPI in context — not just numbers, but what they mean relative to the market cycle." },
              { title: "Peer Benchmarking", body: "How the fund ranks against peers by strategy, vintage year, geography, and fund size. Real data, not estimates." },
              { title: "Fee & Structure Analysis", body: "Management fees, carry, hurdle rates, fund terms — compared against category norms so you know what's standard." },
              { title: "Editorial Commentary", body: "Our take on the fund's positioning, market timing, team strength, and what makes it noteworthy for allocators." },
            ].map((item) => (
              <StaggerChild key={item.title}>
                <div
                  className="p-8 rounded-[12px] transition-all hover:shadow-sm"
                  style={{ background: "var(--off-white)", border: "1px solid var(--border-light)" }}
                >
                  <h3 className="text-[18px] font-bold tracking-[-0.01em] mb-2.5" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                  <p className="text-[15px] leading-[1.65]" style={{ color: "var(--text-secondary)" }}>{item.body}</p>
                </div>
              </StaggerChild>
            ))}
          </StaggerCards>
        </div>
      </section>

      {/* ── For GPs ── */}
      <section className="relative overflow-hidden py-24 md:py-36" style={{ background: "var(--green-deep)" }}>
        {/* Subtle line decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <line x1="33%" y1="0" x2="33%" y2="100%" stroke="white" strokeWidth="0.5" />
            <line x1="66%" y1="0" x2="66%" y2="100%" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="max-w-[900px] mx-auto grid md:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div>
                <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "var(--green-accent)" }}>For Fund Managers</p>
                <h2
                  className="text-[32px] md:text-[44px] font-bold tracking-[-0.025em] leading-[1.08] mb-6"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#fff" }}
                >
                  Get featured to qualified LPs.
                </h2>
                <p className="text-[16px] leading-[1.65] mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
                  If you&apos;re fundraising, submit your fund for consideration. One fund is featured each week to our growing network of allocators and family offices.
                </p>
                <a
                  href="#submit"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold px-7 py-3.5 rounded-[6px] transition-all hover:opacity-90"
                  style={{ background: "#fff", color: "var(--green-deep)" }}
                >
                  Submit Your Fund
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </FadeUp>

            <StaggerCards className="space-y-6">
              {[
                { metric: "2,400+", label: "LP subscribers" },
                { metric: "52%", label: "Average open rate" },
                { metric: "100%", label: "Institutional audience" },
              ].map((stat) => (
                <StaggerChild key={stat.label}>
                  <div className="flex items-baseline justify-between pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <span className="text-[34px] font-bold tracking-[-0.02em]" style={{ color: "#fff" }}>{stat.metric}</span>
                    <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.45)" }}>{stat.label}</span>
                  </div>
                </StaggerChild>
              ))}
            </StaggerCards>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-24 md:py-36">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "var(--green)" }}>Coverage</p>
              <h2
                className="text-[36px] md:text-[52px] font-bold tracking-[-0.025em] leading-[1.08] mb-5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
              >
                Choose your focus.
              </h2>
              <p className="text-[16px] max-w-[460px] mx-auto" style={{ color: "var(--text-secondary)" }}>
                Select the strategies you care about. We&apos;ll tailor your weekly delivery.
              </p>
            </div>
          </FadeUp>

          <StaggerCards className="flex flex-wrap justify-center gap-4 max-w-[720px] mx-auto">
            {["Venture Capital", "Private Equity", "Crypto & Digital Assets", "Real Estate", "Credit & Fixed Income", "Infrastructure", "Secondaries"].map((cat) => (
              <StaggerChild key={cat}>
                <button
                  className="text-[14px] font-medium px-6 py-3 rounded-full transition-all hover:border-[var(--green)] hover:text-[var(--green-deep)]"
                  style={{ background: "var(--white)", border: "1.5px solid var(--border)", color: "var(--text-body)" }}
                >
                  {cat}
                </button>
              </StaggerChild>
            ))}
          </StaggerCards>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="subscribe" className="relative overflow-hidden py-24 md:py-36" style={{ background: "var(--off-white)" }}>
        <BackgroundLines />
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
          <FadeUp>
            <h2
              className="text-[40px] md:text-[64px] font-bold tracking-[-0.035em] leading-[1.05] mb-7"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}
            >
              Start getting smarter<br className="hidden md:block" /> about private funds.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-[17px] mb-12 max-w-[480px] mx-auto leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
              Join fund managers and allocators who start every Monday with institutional-grade fund analysis.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[480px] mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-[56px] px-5 text-[15px] rounded-[6px] transition-all outline-none focus:ring-2 focus:ring-[var(--green-accent)]"
                style={{ background: "var(--white)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
              />
              <button
                className="h-[56px] px-8 text-[15px] font-semibold rounded-[6px] transition-all hover:opacity-90 shrink-0"
                style={{ background: "var(--green-deep)", color: "#fff" }}
              >
                Subscribe Free
              </button>
            </div>
            <p className="mt-5 text-[13px]" style={{ color: "var(--text-muted)" }}>
              Free forever &middot; No spam &middot; Unsubscribe anytime
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10" style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[16px] font-bold tracking-[-0.01em]" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "var(--text-primary)" }}>
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

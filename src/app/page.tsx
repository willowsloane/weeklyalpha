import { NavButton } from "./components/NavButton";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--warm-white)" }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md" style={{ background: "rgba(253,252,250,0.92)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "var(--navy)" }}>
              <span className="text-sm font-bold tracking-tight" style={{ color: "var(--gold)" }}>W</span>
            </div>
            <span className="text-lg font-semibold tracking-tight" style={{ color: "var(--navy)", fontFamily: "var(--font-serif), Georgia, serif" }}>
              Weekly Alpha
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>How It Works</a>
            <a href="#sample" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Sample Issue</a>
            <a href="#subscribe" className="text-sm font-medium px-5 py-2 rounded transition-all" style={{ background: "var(--navy)", color: "var(--cream)" }}>
              Subscribe
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, var(--warm-white) 0%, var(--cream) 100%)" }} />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, var(--glow-gold) 0%, transparent 70%)" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="max-w-3xl">
            {/* Status pill */}
            <div className="fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8" style={{ background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.15)" }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--gold)" }} />
              <span className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--navy-muted)" }}>
                New issue every Monday
              </span>
            </div>

            <h1 className="fade-up fade-up-delay-1 text-4xl md:text-6xl font-bold leading-[1.08] tracking-tight mb-6" style={{ color: "var(--navy)", fontFamily: "var(--font-serif), Georgia, serif" }}>
              One exceptional fund.<br />
              Every week.
            </h1>

            <p className="fade-up fade-up-delay-2 text-lg md:text-xl leading-relaxed mb-10 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              Institutional-grade analysis of private funds — performance data, benchmarks, and strategic breakdowns delivered to your inbox.
            </p>

            {/* Signup form */}
            <div className="fade-up fade-up-delay-3 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="you@firm.com"
                className="input-glow flex-1 h-12 px-4 rounded text-sm transition-all"
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  color: "var(--navy)",
                }}
              />
              <NavButton href="#subscribe">Subscribe</NavButton>
            </div>

            {/* Trust line */}
            <p className="fade-up fade-up-delay-4 mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
              Free weekly delivery. Trusted by fund managers and allocators. No spam.
            </p>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="py-10" style={{ borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium tracking-widest uppercase text-center mb-6" style={{ color: "var(--text-muted)" }}>
            Read by professionals at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["Blackstone", "KKR", "Tiger Global", "Sequoia", "a16z", "Bridgewater"].map((firm) => (
              <span key={firm} className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                {firm}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--navy)", fontFamily: "var(--font-serif), Georgia, serif" }}>
              Institutional intelligence,<br />delivered simply.
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Every Monday, we feature one private fund with the depth and rigor of a placement memo — in a format that takes five minutes to read.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Sourced & Verified",
                description: "We identify funds with compelling track records, verify performance data, and select one standout for the week.",
              },
              {
                step: "02",
                title: "Deep Analysis",
                description: "Each fund is benchmarked against peers by strategy, vintage, and geography. No surface-level summaries.",
              },
              {
                step: "03",
                title: "Your Inbox, Monday",
                description: "A clean, structured breakdown arrives in your inbox. Performance, fees, positioning, and our take — all in one read.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card-glow gradient-border p-8 rounded-lg"
                style={{ background: "white", border: "1px solid var(--border-light)" }}
              >
                <span className="inline-block text-xs font-bold tracking-widest mb-5" style={{ color: "var(--gold)" }}>
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold mb-3 tracking-tight" style={{ color: "var(--navy)" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Issue Preview */}
      <section id="sample" className="py-20 md:py-28" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>
              Sample Issue
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--navy)", fontFamily: "var(--font-serif), Georgia, serif" }}>
              What you&apos;ll receive.
            </h2>
          </div>

          {/* Mock issue card */}
          <div className="card-glow rounded-lg overflow-hidden max-w-3xl" style={{ background: "white", border: "1px solid var(--border)" }}>
            {/* Issue header */}
            <div className="p-6 md:p-8" style={{ borderBottom: "1px solid var(--border-light)" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium tracking-wider uppercase px-2 py-1 rounded" style={{ background: "var(--gold-dim)", color: "var(--navy-muted)" }}>
                  Issue #12
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>March 31, 2026</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--navy)", fontFamily: "var(--font-serif), Georgia, serif" }}>
                Meridian Ventures Fund III
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Early-stage venture &middot; 2022 vintage &middot; $180M target
              </p>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderBottom: "1px solid var(--border-light)" }}>
              {[
                { label: "Net IRR", value: "28.4%", note: "Top Quartile" },
                { label: "TVPI", value: "1.8x", note: "vs 1.4x median" },
                { label: "DPI", value: "0.6x", note: "Early distributions" },
                { label: "Carry", value: "20%", note: "8% hurdle" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="p-5 md:p-6"
                  style={{ borderRight: i < 3 ? "1px solid var(--border-light)" : "none" }}
                >
                  <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold tracking-tight" style={{ color: "var(--navy)" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--gold)" }}>
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Benchmark visualization placeholder */}
            <div className="p-6 md:p-8">
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--text-muted)" }}>
                Peer Benchmark — Early-Stage Venture, 2022 Vintage
              </p>
              <div className="space-y-3">
                {[
                  { label: "This Fund", pct: 82, highlight: true },
                  { label: "Top Quartile", pct: 75, highlight: false },
                  { label: "Median", pct: 50, highlight: false },
                  { label: "Bottom Quartile", pct: 25, highlight: false },
                ].map((bar) => (
                  <div key={bar.label} className="flex items-center gap-4">
                    <span className="text-xs font-medium w-28 shrink-0" style={{ color: bar.highlight ? "var(--navy)" : "var(--text-muted)" }}>
                      {bar.label}
                    </span>
                    <div className="flex-1 h-6 rounded-sm overflow-hidden" style={{ background: "var(--cream)" }}>
                      <div
                        className="h-full rounded-sm transition-all"
                        style={{
                          width: `${bar.pct}%`,
                          background: bar.highlight
                            ? "linear-gradient(90deg, var(--navy) 0%, var(--navy-muted) 100%)"
                            : "var(--border)",
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold w-10 text-right" style={{ color: bar.highlight ? "var(--navy)" : "var(--text-muted)" }}>
                      {bar.pct}th
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>
              Every Issue Includes
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--navy)", fontFamily: "var(--font-serif), Georgia, serif" }}>
              More than a summary.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Performance Breakdown",
                description: "Net IRR, TVPI, DPI, and RVPI with context — not just numbers, but what they mean relative to the market.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17L8 10L12 13L17 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                title: "Peer Benchmarking",
                description: "How the fund ranks against its peers by strategy, vintage year, geography, and fund size.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="10" width="4" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="8" y="6" width="4" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="14" y="2" width="4" height="16" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                ),
              },
              {
                title: "Fee & Structure Analysis",
                description: "Management fees, carry, hurdle rates, and fund terms — compared against category norms.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 6V14M8 8H12M8 12H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                title: "Strategic Commentary",
                description: "Our take on the fund's positioning, market timing, and what makes it noteworthy for allocators.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H16V13H8L4 16V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card-glow flex gap-5 p-6 rounded-lg"
                style={{ background: "white", border: "1px solid var(--border-light)" }}
              >
                <div className="shrink-0 w-10 h-10 rounded flex items-center justify-center" style={{ background: "var(--gold-dim)", color: "var(--navy)" }}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1.5 tracking-tight" style={{ color: "var(--navy)" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For GPs Section */}
      <section className="py-20 md:py-28" style={{ background: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>
                For Fund Managers
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6" style={{ color: "var(--cream)", fontFamily: "var(--font-serif), Georgia, serif" }}>
                Get your fund in front of qualified LPs.
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(248,246,243,0.7)" }}>
                If you&apos;re fundraising and want institutional-quality exposure, submit your fund for consideration. One fund is featured each week to our growing network of allocators and family offices.
              </p>
              <a
                href="#submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-semibold transition-all"
                style={{ background: "var(--gold)", color: "var(--navy)" }}
              >
                Submit Your Fund
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
            <div className="space-y-4">
              {[
                { metric: "2,400+", label: "LP subscribers" },
                { metric: "52%", label: "Open rate average" },
                { metric: "100%", label: "Institutional audience" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-between py-4"
                  style={{ borderBottom: "1px solid rgba(248,246,243,0.08)" }}
                >
                  <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--cream)" }}>
                    {stat.metric}
                  </span>
                  <span className="text-sm" style={{ color: "rgba(248,246,243,0.5)" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--gold)" }}>
              Coverage
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--navy)", fontFamily: "var(--font-serif), Georgia, serif" }}>
              Select your focus.
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Tell us what you&apos;re interested in. We&apos;ll tailor your weekly delivery to match.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "Venture Capital", count: "340+ funds" },
              { name: "Private Equity", count: "280+ funds" },
              { name: "Crypto & Digital", count: "120+ funds" },
              { name: "Real Estate", count: "190+ funds" },
              { name: "Credit & Fixed", count: "150+ funds" },
            ].map((cat) => (
              <button
                key={cat.name}
                className="card-glow text-left p-5 rounded-lg transition-all"
                style={{ background: "white", border: "1px solid var(--border-light)" }}
              >
                <p className="text-sm font-semibold mb-1 tracking-tight" style={{ color: "var(--navy)" }}>
                  {cat.name}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {cat.count}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="subscribe" className="py-20 md:py-28" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: "var(--navy)", fontFamily: "var(--font-serif), Georgia, serif" }}>
            Start receiving Weekly Alpha.
          </h2>
          <p className="text-base mb-10 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            Join fund managers and allocators who rely on institutional-grade fund analysis, delivered every Monday.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@firm.com"
              className="input-glow flex-1 h-13 px-5 rounded text-sm transition-all"
              style={{
                background: "white",
                border: "1px solid var(--border)",
                color: "var(--navy)",
              }}
            />
            <button
              className="h-13 px-8 rounded text-sm font-semibold tracking-wide transition-all"
              style={{ background: "var(--navy)", color: "var(--cream)" }}
            >
              Subscribe Free
            </button>
          </div>
          <p className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
            Free forever. Unsubscribe anytime. No spam, no fluff.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ background: "var(--navy)" }}>
              <span className="text-[10px] font-bold" style={{ color: "var(--gold)" }}>W</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Weekly Alpha</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs" style={{ color: "var(--text-muted)" }}>Privacy</a>
            <a href="#" className="text-xs" style={{ color: "var(--text-muted)" }}>Terms</a>
            <a href="#" className="text-xs" style={{ color: "var(--text-muted)" }}>Contact</a>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            &copy; 2026 Weekly Alpha. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

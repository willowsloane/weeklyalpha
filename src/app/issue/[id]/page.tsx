import { getIssueById, formatStrategy } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO = "var(--font-mono), monospace";

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const issue = await getIssueById(id);

  if (!issue) notFound();

  const stats = [
    { label: "Net IRR", value: issue.irrNet },
    { label: "TVPI", value: issue.tvpi },
    { label: "DPI", value: issue.dpi },
    { label: "Fund Size", value: issue.fundSize },
    { label: "Carry", value: issue.carry },
    { label: "Hurdle", value: issue.hurdle },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen" style={{ background: "var(--white)" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-[800px] mx-auto px-6 h-[56px] flex items-center justify-between">
          <Link href="/" className="text-[18px] font-bold tracking-[-0.01em]" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
            Weekly Alpha
          </Link>
          <Link href="/" className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
            &larr; All Issues
          </Link>
        </div>
      </nav>

      {/* Hero image */}
      <div className="aspect-[3/1] md:aspect-[4/1] relative" style={{ background: issue.gradient }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg width="500" height="200" viewBox="0 0 500 200" fill="none">
            <path d="M20 180L80 130L140 150L200 90L260 110L320 60L380 80L440 30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-[800px] mx-auto px-6 pb-8 w-full">
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-[3px] mb-4 inline-block" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(8px)" }}>
              {issue.strategyLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-[800px] mx-auto px-6 py-12 md:py-16">
        {/* Header */}
        <header className="mb-10">
          <p className="text-[13px] font-medium mb-4" style={{ color: "var(--text-muted)" }}>
            {formatDate(issue.weekOf)}
          </p>
          <h1 className="text-[32px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.08] mb-4" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
            {issue.subject}
          </h1>
          <p className="text-[18px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
            {issue.previewText}
          </p>
        </header>

        {/* Fund quick facts */}
        <div className="mb-10 p-6 rounded-[10px]" style={{ background: "var(--off-white)", border: "1px solid var(--border-light)" }}>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>{issue.fundName}</h2>
            {issue.gpName && <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>by {issue.gpName}</span>}
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                <p className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: "var(--text-primary)", fontFamily: MONO }}>{s.value}</p>
              </div>
            ))}
            {issue.vintageYear && (
              <div>
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: "var(--text-muted)" }}>Vintage</p>
                <p className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: "var(--text-primary)", fontFamily: MONO }}>{issue.vintageYear}</p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-10" style={{ height: "1px", background: "var(--border)" }} />

        {/* Body content */}
        {issue.bodyHtml ? (
          <div
            className="prose prose-lg max-w-none"
            style={{ color: "var(--text-body)", lineHeight: 1.75, fontSize: "16px" }}
            dangerouslySetInnerHTML={{ __html: issue.bodyHtml }}
          />
        ) : (
          <div className="py-16 text-center rounded-[10px]" style={{ background: "var(--off-white)", border: "1px solid var(--border-light)" }}>
            <p className="text-[16px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Full analysis coming soon</p>
            <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>This issue is being generated by our agent pipeline. Check back shortly.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 p-8 rounded-[10px] text-center" style={{ background: "var(--off-white)", border: "1px solid var(--border-light)" }}>
          <h3 className="text-[22px] font-bold mb-3" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
            Get the next issue in your inbox
          </h3>
          <p className="text-[14px] mb-6" style={{ color: "var(--text-secondary)" }}>
            One fund. Every Monday. Free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[400px] mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 h-[48px] px-4 text-[14px] rounded-[4px] outline-none" style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            <button className="h-[48px] px-6 text-[14px] font-semibold rounded-[4px] shrink-0" style={{ background: "var(--green-deep)", color: "#fff" }}>Subscribe</button>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-10" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-[800px] mx-auto px-6 flex items-center justify-between">
          <span className="text-[16px] font-bold" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>Weekly Alpha</span>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>&copy; 2026 Weekly Alpha</p>
        </div>
      </footer>
    </div>
  );
}

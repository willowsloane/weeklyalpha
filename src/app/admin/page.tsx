import Link from "next/link";

const SECTIONS = [
  {
    href: "/admin/pipeline",
    title: "Pipeline",
    description: "Pipeline runs, approval workflow, scheduling, candidate scoring, quality review",
    icon: "⚙️",
  },
  {
    href: "/admin/agent",
    title: "Agent",
    description: "Private chat with the newsletter agent, activity feed, memory and learnings",
    icon: "🤖",
  },
  {
    href: "/admin/docs",
    title: "Docs",
    description: "How the 6-agent pipeline works, architecture, and system documentation",
    icon: "📄",
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--white)" }}>
      {/* Top bar */}
      <div className="py-3" style={{ background: "var(--green-deep)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[14px] font-semibold" style={{ color: "#fff" }}>Weekly Alpha Admin</span>
            <a href="/admin/docs" className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Docs</a>
            <a href="/admin/pipeline" className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Pipeline</a>
            <a href="/admin/agent" className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Agent</a>
          </div>
          <a href="/" className="text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>&larr; Back to site</a>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
        <h1 className="text-[32px] font-bold mb-2" style={{ color: "var(--green-deep)" }}>Weekly Alpha Admin</h1>
        <p className="text-[15px] mb-10" style={{ color: "var(--text-muted)" }}>
          Manage the newsletter pipeline, talk to the agent, and monitor operations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group p-6 rounded-xl transition-all hover:shadow-lg"
              style={{ background: "var(--off-white)", border: "1px solid var(--border)" }}
            >
              <div className="text-[32px] mb-3">{section.icon}</div>
              <h2 className="text-[18px] font-bold mb-1 group-hover:underline" style={{ color: "var(--green-deep)" }}>
                {section.title}
              </h2>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO = "var(--font-mono), 'IBM Plex Mono', monospace";

interface PipelineRun {
  id: string;
  week_of: string;
  status: string;
  selected_fund_metric_id: string | null;
  retry_count: number;
  error: string | null;
  started_at: string | null;
  completed_at: string | null;
  approved_at: string | null;
  created_at: string;
  research_output: { signals?: unknown[]; fundraiseActivity?: unknown[]; marketContext?: string; sourcesScanned?: number } | null;
  curator_output: { candidateCount?: number; topScore?: number } | null;
  content_output: { subject?: string; previewText?: string; tokensUsed?: number } | null;
  review_output: { passed?: boolean; factCheckScore?: number; antiVibeScore?: number; toneScore?: number; issues?: unknown[] } | null;
}

interface FeaturedFund {
  fund_name: string;
  strategy: string;
  featured_week: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#6B6B6B", bg: "#F5F3EF" },
  researching: { label: "Researching", color: "#2563EB", bg: "#EFF6FF" },
  curating: { label: "Curating", color: "#7C3AED", bg: "#F5F3FF" },
  generating: { label: "Generating", color: "#D97706", bg: "#FFFBEB" },
  reviewing: { label: "Reviewing", color: "#D97706", bg: "#FFFBEB" },
  awaiting_approval: { label: "Awaiting Approval", color: "#059669", bg: "#ECFDF5" },
  approved: { label: "Approved", color: "#064E37", bg: "#DFF5E5" },
  sent: { label: "Sent", color: "#064E37", bg: "#DFF5E5" },
  failed: { label: "Failed", color: "#DC2626", bg: "#FEF2F2" },
};

const PIPELINE_STEPS = ["researching", "curating", "generating", "reviewing", "awaiting_approval", "approved", "sent"];

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className="text-[11px] font-bold tracking-[0.06em] uppercase px-2.5 py-1 rounded-[4px] inline-block"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

function ScoreBar({ label, score, threshold }: { label: string; score: number; threshold: number }) {
  const passed = score >= threshold;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] font-medium w-20 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
      <div className="flex-1 h-5 rounded-[3px] overflow-hidden relative" style={{ background: "var(--off-white)" }}>
        <div
          className="h-full rounded-[3px] transition-all duration-500"
          style={{ width: `${score}%`, background: passed ? "var(--green-deep)" : "#DC2626" }}
        />
        {/* Threshold line */}
        <div
          className="absolute top-0 bottom-0 w-[2px]"
          style={{ left: `${threshold}%`, background: "var(--text-muted)", opacity: 0.4 }}
        />
      </div>
      <span className="text-[12px] font-bold w-10 text-right" style={{ color: passed ? "var(--green-deep)" : "#DC2626", fontFamily: MONO }}>
        {score}
      </span>
    </div>
  );
}

function PipelineProgress({ status }: { status: string }) {
  const currentIdx = PIPELINE_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {PIPELINE_STEPS.map((step, i) => {
        const isActive = step === status;
        const isPast = i < currentIdx;
        const isFuture = i > currentIdx;
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{
                background: isActive ? "var(--green-deep)" : isPast ? "var(--green-pale)" : "var(--off-white)",
                color: isActive ? "#fff" : isPast ? "var(--green-deep)" : "var(--text-muted)",
                border: isFuture ? "1px solid var(--border)" : "none",
              }}
            >
              {isPast ? "✓" : i + 1}
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div className="w-4 h-[1.5px]" style={{ background: isPast ? "var(--green-pale)" : "var(--border)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function duration(start: string | null, end: string | null): string {
  if (!start) return "—";
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  const sec = Math.round((e - s) / 1000);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

export default function PipelineDashboard() {
  const [cronEnabled, setCronEnabled] = useState(false);
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [featured, setFeatured] = useState<FeaturedFund[]>([]);
  const [candidateCounts, setCandidateCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/newsletter/status");
      const data = await res.json();
      setCronEnabled(data.cronEnabled);
      setRuns(data.runs);
      setFeatured(data.featured);
      setCandidateCounts(data.candidateCounts);
    } catch (e) {
      console.error("Failed to fetch:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // poll every 5s for live updates
    return () => clearInterval(interval);
  }, [fetchData]);

  async function toggleCron() {
    setToggling(true);
    try {
      const res = await fetch("/api/newsletter/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !cronEnabled }),
      });
      const data = await res.json();
      setCronEnabled(data.cronEnabled);
    } catch (e) {
      console.error("Toggle failed:", e);
    } finally {
      setToggling(false);
    }
  }

  const activeRun = runs.find((r) =>
    ["pending", "researching", "curating", "generating", "reviewing"].includes(r.status)
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--white)" }}>
      {/* Top bar */}
      <div className="py-3" style={{ background: "var(--green-deep)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[14px] font-semibold" style={{ color: "#fff" }}>Weekly Alpha Admin</span>
            <a href="/admin/docs" className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Docs</a>
          </div>
          <a href="/" className="text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>&larr; Back to site</a>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">

        {/* Header + Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: "var(--green)" }}>
              Pipeline Control
            </p>
            <h1 className="text-[32px] md:text-[44px] font-bold tracking-[-0.025em] leading-[1.08]" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
              Newsletter Pipeline
            </h1>
          </div>

          {/* Cron toggle */}
          <div className="flex items-center gap-4 p-4 rounded-[10px]" style={{ background: "var(--off-white)", border: "1px solid var(--border)" }}>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Weekly Cron</p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: MONO }}>Wed 6AM UTC</p>
            </div>
            <button
              onClick={toggleCron}
              disabled={toggling || loading}
              className="relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer"
              style={{ background: cronEnabled ? "var(--green-deep)" : "var(--border)" }}
            >
              <div
                className="absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-transform duration-300"
                style={{ left: cronEnabled ? "calc(100% - 25px)" : "3px" }}
              />
            </button>
            <span className="text-[12px] font-semibold w-8" style={{ color: cronEnabled ? "var(--green-deep)" : "var(--text-muted)" }}>
              {cronEnabled ? "ON" : "OFF"}
            </span>
          </div>
        </div>

        {/* Live active run banner */}
        {activeRun && (
          <div className="mb-8 p-5 rounded-[10px] flex items-center justify-between" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: "#2563EB" }} />
              <div>
                <p className="text-[14px] font-semibold" style={{ color: "#1E40AF" }}>Pipeline Running</p>
                <p className="text-[12px]" style={{ color: "#3B82F6" }}>
                  Week of {activeRun.week_of} &middot; {activeRun.status} &middot; {duration(activeRun.started_at, null)} elapsed
                </p>
              </div>
            </div>
            <PipelineProgress status={activeRun.status} />
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Runs", value: runs.length, sub: "last 8 weeks" },
            { label: "Successful", value: runs.filter((r) => r.status === "sent" || r.status === "approved" || r.status === "awaiting_approval").length, sub: "approved or sent" },
            { label: "Failed", value: runs.filter((r) => r.status === "failed").length, sub: "needs attention" },
            { label: "Featured Funds", value: featured.length, sub: "unique funds sent" },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-[10px]" style={{ background: "var(--off-white)", border: "1px solid var(--border-light)" }}>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
              <p className="text-[28px] font-bold tracking-[-0.02em] leading-none" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
              <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Pipeline runs */}
        <div className="mb-10">
          <h2 className="text-[20px] font-bold tracking-[-0.01em] mb-5" style={{ color: "var(--text-primary)" }}>Pipeline Runs</h2>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: "var(--border)", borderTopColor: "transparent" }} />
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>Loading...</p>
            </div>
          ) : runs.length === 0 ? (
            <div className="py-16 text-center rounded-[10px]" style={{ background: "var(--off-white)", border: "1px solid var(--border-light)" }}>
              <p className="text-[16px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No pipeline runs yet</p>
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>Enable the cron toggle above or trigger a manual run from Trigger.dev</p>
            </div>
          ) : (
            <div className="space-y-3">
              {runs.map((run) => {
                const isExpanded = expandedRun === run.id;
                const research = run.research_output;
                const curator = run.curator_output;
                const content = run.content_output;
                const review = run.review_output;

                return (
                  <div
                    key={run.id}
                    className="rounded-[10px] overflow-hidden transition-all"
                    style={{ background: "var(--white)", border: "1px solid var(--border)" }}
                  >
                    {/* Row header */}
                    <button
                      onClick={() => setExpandedRun(isExpanded ? null : run.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[var(--off-white)] transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <StatusBadge status={run.status} />
                        <div>
                          <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
                            Week of {run.week_of}
                          </p>
                          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                            {timeAgo(run.created_at)} &middot; {duration(run.started_at, run.completed_at)}
                            {run.retry_count > 0 && ` · ${run.retry_count} retries`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {content?.subject && (
                          <span className="hidden md:block text-[13px] max-w-[300px] truncate" style={{ color: "var(--text-secondary)" }}>
                            {content.subject}
                          </span>
                        )}
                        <svg
                          width="16" height="16" viewBox="0 0 16 16" fill="none"
                          className="transition-transform"
                          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}
                        >
                          <path d="M4 6L8 10L12 6" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="px-6 pb-6" style={{ borderTop: "1px solid var(--border-light)" }}>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">

                          {/* Research */}
                          <div className="p-4 rounded-[8px]" style={{ background: "var(--off-white)" }}>
                            <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--green)" }}>Research</p>
                            {research ? (
                              <>
                                <p className="text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>{research.sourcesScanned || 0}</p>
                                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>sources scanned</p>
                                <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                                  {(research.signals as unknown[] | undefined)?.length || 0} signals &middot; {(research.fundraiseActivity as unknown[] | undefined)?.length || 0} fundraises
                                </p>
                                {research.marketContext && (
                                  <p className="text-[11px] mt-2 leading-[1.5]" style={{ color: "var(--text-secondary)" }}>
                                    {(research.marketContext as string).slice(0, 120)}...
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Not started</p>
                            )}
                          </div>

                          {/* Curator */}
                          <div className="p-4 rounded-[8px]" style={{ background: "var(--off-white)" }}>
                            <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--green)" }}>Curator</p>
                            {curator ? (
                              <>
                                <p className="text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>{candidateCounts[run.id] || curator.candidateCount || 0}</p>
                                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>candidates scored</p>
                                <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                                  Top IRS: <span style={{ fontFamily: MONO, color: "var(--green-deep)" }}>{(curator.topScore as number)?.toFixed(2) || "—"}</span>
                                </p>
                              </>
                            ) : (
                              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Not started</p>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4 rounded-[8px]" style={{ background: "var(--off-white)" }}>
                            <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--green)" }}>Content</p>
                            {content ? (
                              <>
                                <p className="text-[13px] font-semibold leading-[1.3] mb-2" style={{ color: "var(--text-primary)" }}>
                                  {content.subject || "Untitled"}
                                </p>
                                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                  {content.tokensUsed?.toLocaleString() || 0} tokens used
                                </p>
                                {content.previewText && (
                                  <p className="text-[11px] mt-2 leading-[1.4]" style={{ color: "var(--text-secondary)" }}>
                                    {content.previewText}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Not started</p>
                            )}
                          </div>

                          {/* Review */}
                          <div className="p-4 rounded-[8px]" style={{ background: "var(--off-white)" }}>
                            <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--green)" }}>Review</p>
                            {review ? (
                              <div className="space-y-2">
                                <ScoreBar label="Fact-check" score={review.factCheckScore || 0} threshold={80} />
                                <ScoreBar label="Anti-vibe" score={review.antiVibeScore || 0} threshold={90} />
                                <ScoreBar label="Tone" score={review.toneScore || 0} threshold={70} />
                                <p className="text-[11px] font-bold mt-2" style={{ color: review.passed ? "var(--green-deep)" : "#DC2626" }}>
                                  {review.passed ? "PASSED" : "FAILED"} &middot; {(review.issues as unknown[])?.length || 0} issues
                                </p>
                              </div>
                            ) : (
                              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Not started</p>
                            )}
                          </div>
                        </div>

                        {/* Error display */}
                        {run.error && (
                          <div className="mt-4 p-4 rounded-[8px]" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                            <p className="text-[12px] font-semibold mb-1" style={{ color: "#991B1B" }}>Error</p>
                            <p className="text-[12px]" style={{ color: "#DC2626", fontFamily: MONO }}>{run.error}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Featured funds history */}
        {featured.length > 0 && (
          <div>
            <h2 className="text-[20px] font-bold tracking-[-0.01em] mb-5" style={{ color: "var(--text-primary)" }}>Featured Fund History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    <th className="text-left py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>Week</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>Fund</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  {featured.map((f, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td className="py-3 pr-4" style={{ color: "var(--text-muted)", fontFamily: MONO }}>{f.featured_week}</td>
                      <td className="py-3 px-4 font-medium" style={{ color: "var(--text-primary)" }}>{f.fund_name}</td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-semibold tracking-[0.06em] uppercase px-2 py-1 rounded-[3px]" style={{ background: "var(--green-pale)", color: "var(--green-deep)" }}>
                          {f.strategy}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

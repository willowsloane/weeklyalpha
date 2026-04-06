"use client";

import { useEffect, useState, useCallback } from "react";

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO = "var(--font-mono), 'IBM Plex Mono', monospace";

/* eslint-disable @typescript-eslint/no-explicit-any */

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
    <span className="text-[11px] font-bold tracking-[0.06em] uppercase px-2.5 py-1 rounded-[4px] inline-block" style={{ background: config.bg, color: config.color }}>
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
        <div className="h-full rounded-[3px] transition-all duration-500" style={{ width: `${score}%`, background: passed ? "var(--green-deep)" : "#DC2626" }} />
        <div className="absolute top-0 bottom-0 w-[2px]" style={{ left: `${threshold}%`, background: "var(--text-muted)", opacity: 0.4 }} />
      </div>
      <span className="text-[12px] font-bold w-10 text-right" style={{ color: passed ? "var(--green-deep)" : "#DC2626", fontFamily: MONO }}>{score}</span>
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
        const labels = ["Research", "Curate", "Generate", "Review", "Approve", "Approved", "Sent"];
        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-0.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{
                  background: isActive ? "var(--green-deep)" : isPast ? "var(--green-pale)" : "var(--off-white)",
                  color: isActive ? "#fff" : isPast ? "var(--green-deep)" : "var(--text-muted)",
                  border: isFuture ? "1px solid var(--border)" : "none",
                  boxShadow: isActive ? "0 0 0 3px rgba(6,78,55,0.15)" : "none",
                }}
              >
                {isPast ? "✓" : i + 1}
              </div>
              <span className="text-[8px] font-medium hidden md:block" style={{ color: isActive ? "var(--green-deep)" : "var(--text-muted)" }}>{labels[i]}</span>
            </div>
            {i < PIPELINE_STEPS.length - 1 && <div className="w-3 md:w-6 h-[1.5px] mb-3" style={{ background: isPast ? "var(--green-pale)" : "var(--border)" }} />}
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

function dur(start: string | null, end: string | null): string {
  if (!start) return "—";
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  const sec = Math.round((e - s) / 1000);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

export default function PipelineDashboard() {
  const [cronEnabled, setCronEnabled] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);
  const [runs, setRuns] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [candidatesByRun, setCandidatesByRun] = useState<Record<string, any[]>>({});
  const [schedule, setSchedule] = useState({ day: "3", hour: "6" });
  const [loading, setLoading] = useState(true);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const [previewRun, setPreviewRun] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/newsletter/status");
      const data = await res.json();
      setCronEnabled(data.cronEnabled);
      setAutoApprove(data.autoApprove);
      setRuns(data.runs);
      setFeatured(data.featured);
      setCandidatesByRun(data.candidatesByRun);
      setSchedule(data.schedule);
    } catch (e) {
      console.error("Fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  async function toggleCron() {
    const res = await fetch("/api/newsletter/toggle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enabled: !cronEnabled }) });
    const data = await res.json();
    setCronEnabled(data.cronEnabled);
  }

  async function toggleAutoApprove() {
    const newVal = !autoApprove;
    await fetch("/api/newsletter/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ autoApprove: newVal }) });
    setAutoApprove(newVal);
  }

  async function updateSchedule(field: string, value: string) {
    setSchedule((s) => ({ ...s, [field]: value }));
    await fetch("/api/newsletter/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: value }) });
  }

  async function handleAction(runId: string, action: string) {
    setActionLoading(runId);
    await fetch("/api/newsletter/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pipelineRunId: runId, action, notes: feedbackText }),
    });
    setFeedbackText("");
    setActionLoading(null);
    fetchData();
  }

  const activeRun = runs.find((r: any) => ["pending", "researching", "curating", "generating", "reviewing"].includes(r.status));
  const awaitingRuns = runs.filter((r: any) => r.status === "awaiting_approval");

  return (
    <div className="min-h-screen" style={{ background: "var(--white)" }}>
      {/* Top bar */}
      <div className="py-3" style={{ background: "var(--green-deep)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[14px] font-semibold" style={{ color: "#fff" }}>Weekly Alpha Admin</span>
            <a href="/admin/docs" className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Docs</a>
            <a href="/admin/pipeline" className="text-[13px] font-semibold" style={{ color: "#fff" }}>Pipeline</a>
            <a href="/admin/agent" className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Agent</a>
          </div>
          <a href="/" className="text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>&larr; Back to site</a>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">

        {/* ── Header ── */}
        <div className="mb-10">
          <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: "var(--green)" }}>Pipeline Control</p>
          <h1 className="text-[32px] md:text-[44px] font-bold tracking-[-0.025em] leading-[1.08]" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
            Newsletter Pipeline
          </h1>
        </div>

        {/* ── Schedule + Controls ── */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Cron toggle */}
          <div className="p-5 rounded-[10px]" style={{ background: "var(--off-white)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Pipeline Active</p>
              <button onClick={toggleCron} className="relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer" style={{ background: cronEnabled ? "var(--green-deep)" : "var(--border)" }}>
                <div className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-300" style={{ left: cronEnabled ? "calc(100% - 22px)" : "2px" }} />
              </button>
            </div>
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              {cronEnabled ? "Running automatically on schedule" : "Paused — no automatic runs"}
            </p>
          </div>

          {/* Schedule editor */}
          <div className="p-5 rounded-[10px]" style={{ background: "var(--off-white)", border: "1px solid var(--border)" }}>
            <p className="text-[14px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Schedule</p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-semibold tracking-[0.1em] uppercase block mb-1" style={{ color: "var(--text-muted)" }}>Day</label>
                <select
                  value={schedule.day}
                  onChange={(e) => updateSchedule("day", e.target.value)}
                  className="w-full h-8 px-2 text-[13px] rounded-[4px] outline-none cursor-pointer"
                  style={{ border: "1px solid var(--border)", color: "var(--text-primary)", background: "#fff" }}
                >
                  {DAYS.map((d, i) => <option key={i} value={String(i)}>{d}</option>)}
                </select>
              </div>
              <div className="w-20">
                <label className="text-[10px] font-semibold tracking-[0.1em] uppercase block mb-1" style={{ color: "var(--text-muted)" }}>Hour (UTC)</label>
                <select
                  value={schedule.hour}
                  onChange={(e) => updateSchedule("hour", e.target.value)}
                  className="w-full h-8 px-2 text-[13px] rounded-[4px] outline-none cursor-pointer"
                  style={{ border: "1px solid var(--border)", color: "var(--text-primary)", background: "#fff" }}
                >
                  {Array.from({ length: 24 }, (_, i) => <option key={i} value={String(i)}>{String(i).padStart(2, "0")}:00</option>)}
                </select>
              </div>
            </div>
            <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)", fontFamily: MONO }}>
              Next: {DAYS[Number(schedule.day)]} {schedule.hour.padStart(2, "0")}:00 UTC
            </p>
          </div>

          {/* Auto-approve */}
          <div className="p-5 rounded-[10px]" style={{ background: "var(--off-white)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Auto-Approve</p>
              <button onClick={toggleAutoApprove} className="relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer" style={{ background: autoApprove ? "var(--green-deep)" : "var(--border)" }}>
                <div className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-sm transition-transform duration-300" style={{ left: autoApprove ? "calc(100% - 22px)" : "2px" }} />
              </button>
            </div>
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              {autoApprove ? "Issues publish automatically if review passes" : "Requires manual approval before publishing"}
            </p>
          </div>
        </div>

        {/* ── Live run banner ── */}
        {activeRun && (
          <div className="mb-6 p-5 rounded-[10px] flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: "#2563EB" }} />
              <div>
                <p className="text-[14px] font-semibold" style={{ color: "#1E40AF" }}>Pipeline Running</p>
                <p className="text-[12px]" style={{ color: "#3B82F6" }}>
                  Week of {activeRun.week_of} &middot; {STATUS_CONFIG[activeRun.status]?.label} &middot; {dur(activeRun.started_at, null)}
                </p>
              </div>
            </div>
            <PipelineProgress status={activeRun.status} />
          </div>
        )}

        {/* ── Awaiting approval banner ── */}
        {awaitingRuns.map((run: any) => (
          <div key={run.id} className="mb-6 rounded-[10px] overflow-hidden" style={{ border: "2px solid #059669" }}>
            <div className="p-5 flex items-center justify-between" style={{ background: "#ECFDF5" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--green-deep)" }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9L7.5 12.5L14 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <p className="text-[15px] font-bold" style={{ color: "var(--green-deep)" }}>Ready for Review — Week of {run.week_of}</p>
                  <p className="text-[13px]" style={{ color: "#059669" }}>
                    {run.content_output?.subject || "Newsletter generated"} &middot; {dur(run.started_at, run.completed_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewRun(previewRun === run.id ? null : run.id)}
                className="text-[13px] font-semibold px-4 py-2 rounded-[4px]"
                style={{ background: "var(--green-deep)", color: "#fff" }}
              >
                {previewRun === run.id ? "Hide Preview" : "Review Content"}
              </button>
            </div>

            {/* Content preview + actions */}
            {previewRun === run.id && (
              <div className="p-6" style={{ borderTop: "1px solid #A7F3D0" }}>
                {/* Preview */}
                {run.content_output?.subject && (
                  <div className="mb-6">
                    <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: "var(--text-muted)" }}>Subject</p>
                    <p className="text-[18px] font-bold mb-4" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>{run.content_output.subject}</p>

                    {run.content_output.previewText && (
                      <>
                        <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: "var(--text-muted)" }}>Preview Text</p>
                        <p className="text-[14px] mb-4" style={{ color: "var(--text-secondary)" }}>{run.content_output.previewText}</p>
                      </>
                    )}

                    {/* Images found for this fund */}
                    {run.content_output.imageUrls?.length > 0 && (
                      <>
                        <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--text-muted)" }}>
                          Fund Images ({run.content_output.imageUrls.length} found) — Click to select hero image
                        </p>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                          {run.content_output.imageUrls.slice(0, 10).map((url: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => {
                                // Update selectedImageUrl in content_output
                                const updated = { ...run.content_output, selectedImageUrl: url };
                                fetch("/api/newsletter/approve", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ pipelineRunId: run.id, action: "update_image", notes: url }),
                                });
                                run.content_output.selectedImageUrl = url;
                                setRuns([...runs]);
                              }}
                              className="aspect-[16/10] rounded-[6px] overflow-hidden relative transition-all"
                              style={{
                                border: run.content_output.selectedImageUrl === url ? "3px solid var(--green-deep)" : "2px solid var(--border)",
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`Option ${i + 1}`} className="w-full h-full object-cover" />
                              {run.content_output.selectedImageUrl === url && (
                                <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--green-deep)" }}>
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        {/* Selected image preview */}
                        {run.content_output.selectedImageUrl && (
                          <div className="mb-6">
                            <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: "var(--green)" }}>Selected Hero Image</p>
                            <div className="aspect-[3/1] rounded-[8px] overflow-hidden relative max-w-[600px]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={run.content_output.selectedImageUrl} alt="Selected hero" className="w-full h-full object-cover" />
                              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
                              <div className="absolute bottom-3 left-4">
                                <span className="text-[14px] font-bold" style={{ color: "#fff" }}>{run.content_output.subject}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Rendered body */}
                    {(run.content_output.bodyHtml || run.content_output.body_html) && (
                      <>
                        <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--text-muted)" }}>Newsletter Body</p>
                        <div
                          className="p-6 rounded-[8px] max-h-[500px] overflow-y-auto text-[14px] leading-[1.7]"
                          style={{ background: "#fff", border: "1px solid var(--border)", color: "var(--text-body)" }}
                          dangerouslySetInnerHTML={{ __html: run.content_output.bodyHtml || run.content_output.body_html }}
                        />
                      </>
                    )}
                  </div>
                )}

                {/* Review scores */}
                {run.review_output && (
                  <div className="mb-6 p-4 rounded-[8px]" style={{ background: "var(--off-white)" }}>
                    <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--text-muted)" }}>Quality Scores</p>
                    <div className="space-y-2">
                      <ScoreBar label="Fact-check" score={run.review_output.factCheckScore || 0} threshold={80} />
                      <ScoreBar label="Anti-vibe" score={run.review_output.antiVibeScore || 0} threshold={90} />
                      <ScoreBar label="Tone" score={run.review_output.toneScore || 0} threshold={70} />
                    </div>
                    {run.review_output.issues?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[11px] font-semibold mb-1" style={{ color: "var(--text-muted)" }}>{run.review_output.issues.length} issues found:</p>
                        {run.review_output.issues.slice(0, 5).map((issue: any, i: number) => (
                          <p key={i} className="text-[12px]" style={{ color: issue.severity === "blocker" ? "#DC2626" : "var(--text-secondary)" }}>
                            {issue.severity === "blocker" ? "⨯" : "⚠"} {issue.description}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback + actions */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-semibold block mb-2" style={{ color: "var(--text-primary)" }}>
                      Notes for the agents (optional — they&apos;ll use this to improve)
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="e.g., 'Tone is too casual — make it more like a Cambridge Associates memo' or 'Add more specific peer comparison data'"
                      className="w-full h-24 p-3 text-[14px] rounded-[6px] outline-none resize-none"
                      style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleAction(run.id, "approve")}
                      disabled={actionLoading === run.id}
                      className="text-[13px] font-semibold px-6 py-2.5 rounded-[4px] transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ background: "var(--green-deep)", color: "#fff" }}
                    >
                      {actionLoading === run.id ? "..." : "Approve & Publish"}
                    </button>
                    <button
                      onClick={() => handleAction(run.id, "request_changes")}
                      disabled={actionLoading === run.id || !feedbackText.trim()}
                      className="text-[13px] font-semibold px-6 py-2.5 rounded-[4px] transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ background: "#D97706", color: "#fff" }}
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => handleAction(run.id, "reject")}
                      disabled={actionLoading === run.id}
                      className="text-[13px] font-semibold px-6 py-2.5 rounded-[4px] transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ background: "#DC2626", color: "#fff" }}
                    >
                      Reject
                    </button>
                  </div>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    &ldquo;Request Changes&rdquo; sends your notes back to the Content Gen agent for a rewrite. &ldquo;Reject&rdquo; kills this issue. Notes are stored so agents improve over time.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Runs", value: runs.length },
            { label: "Approved", value: runs.filter((r: any) => ["approved", "sent", "awaiting_approval"].includes(r.status)).length },
            { label: "Failed", value: runs.filter((r: any) => r.status === "failed").length },
            { label: "Featured", value: featured.length },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-[10px]" style={{ background: "var(--off-white)", border: "1px solid var(--border-light)" }}>
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
              <p className="text-[28px] font-bold tracking-[-0.02em] leading-none" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── All pipeline runs ── */}
        <h2 className="text-[20px] font-bold tracking-[-0.01em] mb-5" style={{ color: "var(--text-primary)" }}>All Runs</h2>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: "var(--border)", borderTopColor: "transparent" }} />
          </div>
        ) : runs.length === 0 ? (
          <div className="py-16 text-center rounded-[10px]" style={{ background: "var(--off-white)", border: "1px solid var(--border-light)" }}>
            <p className="text-[16px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No pipeline runs yet</p>
            <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>Enable the pipeline and wait for the scheduled run, or trigger manually from Trigger.dev</p>
          </div>
        ) : (
          <div className="space-y-3 mb-10">
            {runs.map((run: any) => {
              const isExpanded = expandedRun === run.id;
              const candidates = candidatesByRun[run.id] || [];
              const review = run.review_output;
              const humanFeedback = review?.human_feedback;

              return (
                <div key={run.id} className="rounded-[10px] overflow-hidden" style={{ background: "var(--white)", border: "1px solid var(--border)" }}>
                  <button
                    onClick={() => setExpandedRun(isExpanded ? null : run.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[var(--off-white)] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <StatusBadge status={run.status} />
                      <div>
                        <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Week of {run.week_of}</p>
                        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                          {timeAgo(run.created_at)} &middot; {dur(run.started_at, run.completed_at)}
                          {run.retry_count > 0 && ` · ${run.retry_count} retries`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {run.content_output?.subject && (
                        <span className="hidden lg:block text-[13px] max-w-[280px] truncate" style={{ color: "var(--text-secondary)" }}>
                          {run.content_output.subject}
                        </span>
                      )}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>
                        <path d="M4 6L8 10L12 6" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5" style={{ borderTop: "1px solid var(--border-light)" }}>
                      {/* Agent outputs */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
                        <div className="p-4 rounded-[8px]" style={{ background: "var(--off-white)" }}>
                          <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--green)" }}>Research</p>
                          {run.research_output?.sourcesScanned ? (
                            <>
                              <p className="text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>{run.research_output.sourcesScanned}</p>
                              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>sources scanned</p>
                              <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                                {run.research_output.signals?.length || 0} signals &middot; {run.research_output.fundraiseActivity?.length || 0} fundraises
                              </p>
                            </>
                          ) : <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Waiting...</p>}
                        </div>
                        <div className="p-4 rounded-[8px]" style={{ background: "var(--off-white)" }}>
                          <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--green)" }}>Curator</p>
                          {run.curator_output?.candidateCount ? (
                            <>
                              <p className="text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>{candidates.length || run.curator_output.candidateCount}</p>
                              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>candidates scored</p>
                              <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>Top IRS: <span style={{ fontFamily: MONO, color: "var(--green-deep)" }}>{run.curator_output.topScore?.toFixed(2)}</span></p>
                            </>
                          ) : <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Waiting...</p>}
                        </div>
                        <div className="p-4 rounded-[8px]" style={{ background: "var(--off-white)" }}>
                          <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--green)" }}>Content</p>
                          {run.content_output?.subject ? (
                            <>
                              <p className="text-[13px] font-semibold leading-[1.3] mb-1" style={{ color: "var(--text-primary)" }}>{run.content_output.subject}</p>
                              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{run.content_output.tokensUsed?.toLocaleString() || 0} tokens</p>
                            </>
                          ) : <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Waiting...</p>}
                        </div>
                        <div className="p-4 rounded-[8px]" style={{ background: "var(--off-white)" }}>
                          <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--green)" }}>Review</p>
                          {review?.factCheckScore != null ? (
                            <div className="space-y-1.5">
                              <ScoreBar label="Facts" score={review.factCheckScore} threshold={80} />
                              <ScoreBar label="Vibe" score={review.antiVibeScore || 0} threshold={90} />
                              <ScoreBar label="Tone" score={review.toneScore || 0} threshold={70} />
                            </div>
                          ) : <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>Waiting...</p>}
                        </div>
                      </div>

                      {/* Candidates table */}
                      {candidates.length > 0 && (
                        <div className="mt-5">
                          <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: "var(--text-muted)" }}>Scored Candidates</p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[12px]" style={{ borderCollapse: "collapse" }}>
                              <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                  <th className="text-left py-2 pr-3 font-semibold" style={{ color: "var(--text-muted)" }}>Fund</th>
                                  <th className="text-center py-2 px-2 font-semibold" style={{ color: "var(--text-muted)" }}>MM</th>
                                  <th className="text-center py-2 px-2 font-semibold" style={{ color: "var(--text-muted)" }}>FA</th>
                                  <th className="text-center py-2 px-2 font-semibold" style={{ color: "var(--text-muted)" }}>DF</th>
                                  <th className="text-center py-2 px-2 font-semibold" style={{ color: "var(--text-muted)" }}>IS</th>
                                  <th className="text-center py-2 px-2 font-semibold" style={{ color: "var(--text-muted)" }}>NU</th>
                                  <th className="text-center py-2 px-2 font-semibold" style={{ color: "var(--text-muted)" }}>IRS</th>
                                  <th className="text-center py-2 px-2 font-semibold" style={{ color: "var(--text-muted)" }}>Final</th>
                                </tr>
                              </thead>
                              <tbody>
                                {candidates.map((c: any) => (
                                  <tr key={c.fund_metric_id} style={{ borderBottom: "1px solid var(--border-light)", background: c.selected ? "var(--green-pale)" : "transparent" }}>
                                    <td className="py-2 pr-3">
                                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{c.fund_name}</span>
                                      <span className="text-[10px] ml-2" style={{ color: "var(--text-muted)" }}>{c.strategy}</span>
                                      {c.selected && <span className="text-[9px] font-bold ml-2 px-1.5 py-0.5 rounded" style={{ background: "var(--green-deep)", color: "#fff" }}>SELECTED</span>}
                                    </td>
                                    {[c.irs_market_moment, c.irs_fundraise_activity, c.irs_data_freshness, c.irs_institutional_signal, c.irs_narrative_uniqueness].map((val: number, i: number) => (
                                      <td key={i} className="text-center py-2 px-2" style={{ fontFamily: MONO, color: val >= 7 ? "var(--green-deep)" : val >= 4 ? "var(--text-body)" : "var(--text-muted)" }}>
                                        {Number(val).toFixed(1)}
                                      </td>
                                    ))}
                                    <td className="text-center py-2 px-2 font-semibold" style={{ fontFamily: MONO, color: "var(--text-primary)" }}>{Number(c.irs_raw).toFixed(2)}</td>
                                    <td className="text-center py-2 px-2 font-bold" style={{ fontFamily: MONO, color: Number(c.final_score) >= 6 ? "var(--green-deep)" : "#DC2626" }}>{Number(c.final_score).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Human feedback history */}
                      {humanFeedback && (
                        <div className="mt-5 p-4 rounded-[8px]" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                          <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-1" style={{ color: "#92400E" }}>Your Feedback</p>
                          <p className="text-[13px]" style={{ color: "#78350F" }}>{humanFeedback}</p>
                        </div>
                      )}

                      {/* Error */}
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

        {/* ── Featured history ── */}
        {featured.length > 0 && (
          <div>
            <h2 className="text-[20px] font-bold tracking-[-0.01em] mb-5" style={{ color: "var(--text-primary)" }}>Published Issues</h2>
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
                  {featured.map((f: any, i: number) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td className="py-3 pr-4" style={{ color: "var(--text-muted)", fontFamily: MONO }}>{f.featured_week}</td>
                      <td className="py-3 px-4 font-medium" style={{ color: "var(--text-primary)" }}>{f.fund_name}</td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-semibold tracking-[0.06em] uppercase px-2 py-1 rounded-[3px]" style={{ background: "var(--green-pale)", color: "var(--green-deep)" }}>{f.strategy}</span>
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

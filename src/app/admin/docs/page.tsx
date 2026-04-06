"use client";

import { FadeUp, StaggerCards, StaggerChild } from "../../components/Animations";

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO = "var(--font-mono), 'IBM Plex Mono', monospace";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: "var(--green)" }}>
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[28px] md:text-[40px] font-bold tracking-[-0.025em] leading-[1.1] mb-6" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
      {children}
    </h2>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 md:p-8 rounded-[10px] ${className}`} style={{ background: "var(--white)", border: "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="text-[13px] leading-[1.6] p-5 rounded-[8px] overflow-x-auto" style={{ background: "var(--off-white)", border: "1px solid var(--border-light)", fontFamily: MONO, color: "var(--text-body)" }}>
      {children}
    </pre>
  );
}

// ── Pipeline node for flow diagram ────────────────────────────────────

function PipelineNode({ label, time, status, active = false }: { label: string; time: string; status: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[120px]">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
        style={{
          background: active ? "var(--green-deep)" : "var(--off-white)",
          color: active ? "#fff" : "var(--text-muted)",
          border: active ? "none" : "1.5px solid var(--border)",
        }}
      >
        {status}
      </div>
      <p className="text-[13px] font-semibold text-center" style={{ color: "var(--text-primary)" }}>{label}</p>
      <p className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: MONO }}>{time}</p>
    </div>
  );
}

function PipelineArrow() {
  return (
    <div className="flex items-center px-1 pt-2">
      <div className="h-[1.5px] w-8 md:w-12" style={{ background: "var(--border)" }} />
      <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px]" style={{ borderLeftColor: "var(--border)" }} />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────

export default function AdminDocsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--white)" }}>
      {/* Top bar */}
      <div className="py-3" style={{ background: "var(--green-deep)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[14px] font-semibold" style={{ color: "#fff" }}>Weekly Alpha Admin</span>
            <a href="/admin/docs" className="text-[13px] font-semibold" style={{ color: "#fff" }}>Docs</a>
            <a href="/admin/pipeline" className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Pipeline</a>
            <a href="/admin/agent" className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Agent</a>
          </div>
          <a href="/" className="text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>&larr; Back to site</a>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 md:py-24">

        {/* Header */}
        <FadeUp>
          <SectionLabel>System Documentation</SectionLabel>
          <h1 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.05] mb-4" style={{ fontFamily: SERIF, color: "var(--text-primary)" }}>
            Newsletter Agent Pipeline
          </h1>
          <p className="text-[17px] leading-[1.6] max-w-[640px] mb-16" style={{ color: "var(--text-secondary)" }}>
            An autonomous agent team that selects, generates, and quality-reviews one private fund feature per week using the Institutional Relevance Score (IRS).
          </p>
        </FadeUp>

        {/* ── Pipeline Flow Diagram ──────────────────────────────── */}
        <FadeUp delay={0.1}>
          <div className="mb-20">
            <SectionLabel>Pipeline Flow</SectionLabel>
            <SectionTitle>Wednesday to Monday</SectionTitle>

            <div className="overflow-x-auto pb-4">
              <div className="flex items-start gap-0 min-w-[900px]">
                <PipelineNode label="Cron Trigger" time="Wed 6AM UTC" status="01" active />
                <PipelineArrow />
                <PipelineNode label="Research Agent" time="~3 min" status="02" active />
                <PipelineArrow />
                <PipelineNode label="Curator Agent" time="~2 min" status="03" active />
                <PipelineArrow />
                <PipelineNode label="Enrichment" time="~2 min" status="04" active />
                <PipelineArrow />
                <PipelineNode label="Content Gen" time="~2 min" status="05" active />
                <PipelineArrow />
                <PipelineNode label="Quality Review" time="~1 min" status="06" active />
                <PipelineArrow />
                <PipelineNode label="Human Approval" time="Wed–Sun" status="07" />
                <PipelineArrow />
                <PipelineNode label="Auto-Publish" time="Monday 8AM" status="08" />
              </div>
            </div>

            <p className="mt-4 text-[14px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
              The pipeline triggers every Wednesday at 6 AM UTC, giving 4 full days for human review before the Monday send. Each agent is a Trigger.dev task with built-in retries and failure handling.
            </p>
          </div>
        </FadeUp>

        {/* ── Agent Details ──────────────────────────────────────── */}
        <FadeUp>
          <div className="mb-20">
            <SectionLabel>Agent Roles</SectionLabel>
            <SectionTitle>Six agents, one pipeline</SectionTitle>
          </div>
        </FadeUp>

        <StaggerCards className="grid md:grid-cols-1 gap-6 mb-20">
          {[
            {
              id: "01",
              name: "Research Agent",
              task: "newsletter-research",
              duration: "~3 min",
              description: "Scans institutional data sources for signals about active fundraises, pension fund commitments, conference topics, and market-moving events.",
              inputs: "Pipeline run ID",
              outputs: "Institutional signals, fundraise activity, market context summary",
              sources: [
                { tier: "Tier 1", name: "SEC EDGAR Form D", desc: "Active fund raises, filing dates, fund sizes" },
                { tier: "Tier 1", name: "Pension board minutes", desc: "CalPERS, CalSTRS, UTIMCO commitment decisions" },
                { tier: "Tier 2", name: "Benchmark releases", desc: "Cambridge Associates, Burgiss, PitchBook quarterly data" },
                { tier: "Tier 3", name: "Conference agendas", desc: "SuperReturn, ILPA Summit panel topics" },
              ],
            },
            {
              id: "02",
              name: "Curator Agent",
              task: "newsletter-curator",
              duration: "~2 min",
              description: "Scores fund_metrics candidates using the Institutional Relevance Score (IRS) formula. Combines research signals with database completeness, benchmark position, and LLM-assessed narrative potential.",
              inputs: "Pipeline run ID, research output",
              outputs: "Top 10 scored candidates, selected fund ID",
              sources: [
                { tier: "Data", name: "fund_metrics", desc: "70+ columns of extracted fund data" },
                { tier: "Data", name: "mv_fund_benchmarks", desc: "Percentile rankings by strategy + vintage" },
                { tier: "LLM", name: "Gemini Flash", desc: "Narrative uniqueness scoring (0-10)" },
              ],
            },
            {
              id: "03",
              name: "Research Enrichment",
              task: "newsletter-research-enrichment",
              duration: "~2 min",
              description: "Verifies and enriches the selected fund's data against public web sources before content generation. Searches for GP/fund information via Serper, extracts structured enrichment data via Gemini, and auto-corrects discrepancies (e.g., fund size off by >20%). Adds institutional context that extraction alone can't provide.",
              inputs: "Pipeline run ID, selected fund metric ID",
              outputs: "Enriched raw_extraction with verified data, corrections log, research audit trail",
              sources: [
                { tier: "Tier 1", name: "Serper Web Search", desc: "8 queries: AUM, HQ, portfolio, ownership, fees, competitors, PitchBook, SEC" },
                { tier: "Tier 1", name: "Gemini Flash", desc: "Extracts structured data from search snippets" },
                { tier: "Verify", name: "Cross-reference", desc: "Flags fund size >20% discrepant, missing ownership model, absent portfolio companies" },
                { tier: "Enrich", name: "New fields", desc: "headquarters, CEO, competitors, portfolio companies, ownership model, ESG policy" },
              ],
            },
            {
              id: "04",
              name: "Content Generator",
              task: "newsletter-content-gen",
              duration: "~2 min",
              description: "Generates the full newsletter using Claude API with fund data, peer benchmarks, and market context. Enforces anti-vibe rules and requires bear case, data provenance, and temporal justification.",
              inputs: "Fund metric ID, market context, review feedback (on retry)",
              outputs: "Subject line, preview text, hero HTML, body HTML, plain text",
              sources: [
                { tier: "LLM", name: "Claude Sonnet", desc: "Premium content generation" },
                { tier: "Data", name: "Peer benchmarks", desc: "Same strategy ±2 vintage years" },
              ],
            },
            {
              id: "05",
              name: "Quality Review",
              task: "newsletter-quality-review",
              duration: "~1 min",
              description: "Three-pass quality gate: fact-check every number against fund_metrics, audit for anti-vibe violations, and score tone for institutional appropriateness.",
              inputs: "Content output, fund metric ID",
              outputs: "Pass/fail, scores, issues, suggested fixes",
              sources: [
                { tier: "Pass 0", name: "Data Sanity", desc: "Blocks impossible values: fee >5%, carry >50%, IRR >100%, size >$500B (>= 75 to pass)" },
                { tier: "Pass 1", name: "Fact-check", desc: "Every number verified against fund_metrics (>= 80 to pass)" },
                { tier: "Pass 2", name: "Anti-vibe", desc: "Banned words, marketing language, missing bear case (>= 90 to pass)" },
                { tier: "Pass 3", name: "Tone", desc: "Gemini Flash institutional appropriateness score (>= 70 to pass)" },
              ],
            },
            {
              id: "06",
              name: "Supervisor",
              task: "newsletter-supervisor",
              duration: "~10 min total",
              description: "Weekly cron orchestrator. Creates pipeline run, calls agents sequentially, handles retries (max 2 content gen retries on review failure), and sends notification for human approval.",
              inputs: "Optional: week override, force rerun",
              outputs: "Pipeline status, selected fund, review result",
              sources: [
                { tier: "Cron", name: "Wednesday 6 AM UTC", desc: "Gated by crawler_settings.newsletter_cron_enabled" },
                { tier: "Retry", name: "Max 2 retries", desc: "Content gen retried with review feedback appended" },
              ],
            },
          ].map((agent) => (
            <StaggerChild key={agent.id}>
              <Card>
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold" style={{ background: "var(--green-deep)", color: "#fff" }}>
                    {agent.id}
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
                      {agent.name}
                    </h3>
                    <p className="text-[13px] mt-0.5" style={{ color: "var(--text-muted)", fontFamily: MONO }}>
                      {agent.task} &middot; {agent.duration}
                    </p>
                  </div>
                </div>
                <p className="text-[15px] leading-[1.6] mb-5" style={{ color: "var(--text-secondary)" }}>{agent.description}</p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Inputs</p>
                    <p className="text-[13px]" style={{ color: "var(--text-body)" }}>{agent.inputs}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>Outputs</p>
                    <p className="text-[13px]" style={{ color: "var(--text-body)" }}>{agent.outputs}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {agent.sources.map((s) => (
                    <div key={s.name} className="flex items-center gap-3 py-2 px-3 rounded-[6px]" style={{ background: "var(--off-white)" }}>
                      <span className="text-[10px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded-[3px] shrink-0" style={{ background: "var(--green-pale)", color: "var(--green-deep)" }}>
                        {s.tier}
                      </span>
                      <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{s.name}</span>
                      <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{s.desc}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </StaggerChild>
          ))}
        </StaggerCards>

        {/* ── IRS Formula ────────────────────────────────────────── */}
        <FadeUp>
          <div className="mb-20">
            <SectionLabel>Selection Engine</SectionLabel>
            <SectionTitle>Institutional Relevance Score (IRS)</SectionTitle>
            <p className="text-[15px] leading-[1.6] mb-8 max-w-[640px]" style={{ color: "var(--text-secondary)" }}>
              The IRS determines which fund to feature each week. Designed by a senior LP analyst, it prioritizes institutional signals over social media noise.
            </p>

            {/* Formula */}
            <Card className="mb-8">
              <CodeBlock>{`IRS = (Market Moment × 0.25) + (Fundraise Activity × 0.20) + (Data Freshness × 0.20) + (Institutional Signal × 0.20) + (Narrative Uniqueness × 0.15)

Threshold: >= 6.0 to feature
Decay: -2.0 penalty if same strategy featured in last 4 weeks
Range: 0.0 — 10.0 per dimension`}</CodeBlock>
            </Card>

            {/* Dimension table */}
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    <th className="text-left py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>Dimension</th>
                    <th className="text-center py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>Weight</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>Scores 10</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>Scores 0</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { dim: "Market Moment", weight: "25%", high: "Regulation/rate change directly hits this strategy this week", low: "No current market connection" },
                    { dim: "Fundraise Activity", weight: "20%", high: "First close in last 60 days, actively raising", low: "Closed 12+ months ago" },
                    { dim: "Data Freshness", weight: "20%", high: "New quarterly report or SEC filing in last 30 days", low: "No verifiable recent data" },
                    { dim: "Institutional Signal", weight: "20%", high: "2+ pension funds referenced strategy in board minutes", low: "No institutional evidence" },
                    { dim: "Narrative Uniqueness", weight: "15%", high: "First-to-publish, proprietary analysis", low: "Same story everyone has told" },
                  ].map((row) => (
                    <tr key={row.dim} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td className="py-3 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>{row.dim}</td>
                      <td className="py-3 px-4 text-center font-semibold" style={{ color: "var(--green)", fontFamily: MONO }}>{row.weight}</td>
                      <td className="py-3 px-4" style={{ color: "var(--text-body)" }}>{row.high}</td>
                      <td className="py-3 px-4" style={{ color: "var(--text-muted)" }}>{row.low}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                { score: "7.5–10.0", action: "Strong feature", color: "var(--green-deep)" },
                { score: "6.0–7.4", action: "Viable feature", color: "var(--green)" },
                { score: "< 6.0", action: "Do not feature", color: "var(--text-muted)" },
              ].map((t) => (
                <div key={t.score} className="p-4 rounded-[8px]" style={{ background: "var(--off-white)", borderLeft: `3px solid ${t.color}` }}>
                  <p className="text-[15px] font-bold" style={{ fontFamily: MONO, color: t.color }}>{t.score}</p>
                  <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>{t.action}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ── Data Source Hierarchy ───────────────────────────────── */}
        <FadeUp>
          <div className="mb-20">
            <SectionLabel>Data Sources</SectionLabel>
            <SectionTitle>Institutional trust hierarchy</SectionTitle>

            <StaggerCards className="grid md:grid-cols-3 gap-6">
              {[
                {
                  tier: "Tier 1 — Primary",
                  color: "var(--green-deep)",
                  sources: [
                    "SEC EDGAR (Form D, 13F, ADV)",
                    "fund_metrics database (70+ columns)",
                    "mv_fund_benchmarks (percentiles)",
                    "Cambridge Associates benchmarks",
                  ],
                  note: "Ground truth. Legally required disclosures and verified extracted data.",
                },
                {
                  tier: "Tier 2 — Secondary",
                  color: "var(--green)",
                  sources: [
                    "Pension board minutes (CalPERS, CalSTRS, UTIMCO)",
                    "PitchBook/Preqin fundraise data",
                    "Bloomberg terminal news",
                    "Conference agendas",
                  ],
                  note: "High-trust institutional signals. Public documents with 30-90 day lag.",
                },
                {
                  tier: "Tier 3 — Supplementary",
                  color: "var(--text-muted)",
                  sources: [
                    "Industry reports (Bain, McKinsey)",
                    "LP quarterly reports",
                    "LinkedIn (team changes only)",
                    "News aggregation",
                  ],
                  note: "Context and trend identification. Verify before citing.",
                },
              ].map((tier) => (
                <StaggerChild key={tier.tier}>
                  <Card>
                    <p className="text-[14px] font-bold mb-4" style={{ color: tier.color }}>{tier.tier}</p>
                    <ul className="space-y-2 mb-4">
                      {tier.sources.map((s) => (
                        <li key={s} className="text-[13px] flex items-start gap-2" style={{ color: "var(--text-body)" }}>
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: tier.color }} />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[12px] leading-[1.5]" style={{ color: "var(--text-muted)" }}>{tier.note}</p>
                  </Card>
                </StaggerChild>
              ))}
            </StaggerCards>
          </div>
        </FadeUp>

        {/* ── Anti-Vibe Standards ─────────────────────────────────── */}
        <FadeUp>
          <div className="mb-20">
            <SectionLabel>Quality Standards</SectionLabel>
            <SectionTitle>Anti-vibe enforcement</SectionTitle>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <p className="text-[14px] font-bold mb-4" style={{ color: "#DC2626" }}>Banned Words &amp; Phrases</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "landscape", "navigate", "leverage", "cutting-edge", "holistic", "robust",
                    "innovative", "game-changer", "unprecedented", "world-class", "best-in-class",
                    "unique opportunity", "proven track record", "proprietary deal flow",
                    "let's dive in", "in today's environment",
                  ].map((w) => (
                    <span key={w} className="text-[11px] font-medium px-2.5 py-1 rounded-[4px]" style={{ background: "#FEE2E2", color: "#991B1B" }}>
                      {w}
                    </span>
                  ))}
                </div>
              </Card>

              <Card>
                <p className="text-[14px] font-bold mb-4" style={{ color: "var(--green-deep)" }}>Required Sections</p>
                <ul className="space-y-3">
                  {[
                    { label: "Bear case", desc: "What could go wrong — genuine risks, not disclaimers" },
                    { label: "Data provenance", desc: "Every number must cite its source" },
                    { label: "Why this week", desc: "Temporal justification for featuring now" },
                    { label: "Peer context", desc: "Benchmark position vs same strategy + vintage" },
                  ].map((r) => (
                    <li key={r.label} className="flex items-start gap-3">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                        <circle cx="8" cy="8" r="8" fill="var(--green-pale)" />
                        <path d="M5 8L7 10L11 6" stroke="var(--green-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div>
                        <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{r.label}</span>
                        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{r.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </FadeUp>

        {/* ── Data Validation Stack ────────────────────────────── */}
        <FadeUp>
          <div className="mb-20">
            <SectionLabel>Data Integrity</SectionLabel>
            <SectionTitle>Four-layer validation</SectionTitle>
            <p className="text-[15px] leading-[1.6] max-w-[640px] mb-8" style={{ color: "var(--text-secondary)" }}>
              Every fund passes through four validation layers before an article is published. This stack was built after discovering extraction errors (77% management fee, wrong fund sizes) that propagated into published content.
            </p>

            <StaggerCards className="grid md:grid-cols-2 gap-6">
              {[
                {
                  layer: "Layer 1",
                  title: "Extraction Sanity Caps",
                  where: "extract-quickstats.ts",
                  rules: ["Mgmt fee > 5% → auto-corrected (bps misread as %)", "Carry > 50% → nullified", "Values checked at parse time, before DB insert"],
                  color: "var(--green-deep)",
                },
                {
                  layer: "Layer 2",
                  title: "Curator Hard Filters",
                  where: "newsletter-curator.ts",
                  rules: ["Rejects: fee > 5%, IRR > 100%, strategy 'other', no IRR data", "Only funds with extraction_confidence >= 0.5", "Prevents bad-data funds from being selected"],
                  color: "var(--green)",
                },
                {
                  layer: "Layer 3",
                  title: "Research Enrichment",
                  where: "newsletter-research-enrichment.ts",
                  rules: ["Verifies fund size against web sources (auto-corrects >20% discrepancy)", "Adds missing data: ownership model, portfolio companies, competitors", "Cross-references key numbers before content gen uses them"],
                  color: "#2563EB",
                },
                {
                  layer: "Layer 4",
                  title: "Quality Review Pass 0",
                  where: "newsletter-quality-review.ts",
                  rules: ["Blockers: fee > 5%, carry > 50%, IRR > 100%", "Warnings: fund size > $500B, TVPI > 20x, vintage out of range", "Must score >= 75 to pass (in addition to fact-check, anti-vibe, tone)"],
                  color: "#DC2626",
                },
              ].map((layer) => (
                <StaggerChild key={layer.layer}>
                  <Card>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[11px] font-bold tracking-[0.08em] uppercase px-2 py-1 rounded-[3px]" style={{ background: layer.color + "15", color: layer.color }}>{layer.layer}</span>
                      <h3 className="text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>{layer.title}</h3>
                    </div>
                    <p className="text-[12px] mb-3" style={{ color: "var(--text-muted)", fontFamily: MONO }}>{layer.where}</p>
                    <ul className="space-y-1.5">
                      {layer.rules.map((rule) => (
                        <li key={rule} className="text-[13px] flex items-start gap-2" style={{ color: "var(--text-body)" }}>
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: layer.color }} />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </StaggerChild>
              ))}
            </StaggerCards>
          </div>
        </FadeUp>

        {/* ── Edge Cases ─────────────────────────────────────────── */}
        <FadeUp>
          <div className="mb-20">
            <SectionLabel>Edge Cases</SectionLabel>
            <SectionTitle>Failure handling</SectionTitle>

            <div className="overflow-x-auto">
              <table className="w-full text-[14px]" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    <th className="text-left py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>Scenario</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>Handling</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { scenario: "No candidates score >= 6.0", handling: "Pipeline stops with status 'failed'. Team notified. Run a thematic piece manually." },
                    { scenario: "Review fails after 2 retries", handling: "Pipeline sends for human approval anyway with review warnings attached." },
                    { scenario: "Same strategy repeat", handling: "-2.0 decay penalty auto-applied. Forces strategy diversity over 4-week window." },
                    { scenario: "Stale data only", handling: "Data Freshness dimension (20% weight) automatically penalizes funds with old extractions." },
                    { scenario: "API failure (Gemini, Claude)", handling: "Trigger.dev retries 3x with exponential backoff. Falls back gracefully on total failure." },
                    { scenario: "No human approval by Sunday", handling: "Pipeline stays in 'awaiting_approval'. Newsletter skips that week. No auto-send." },
                    { scenario: "Duplicate featured fund", handling: "newsletter_featured_funds table prevents re-selection via unique constraint." },
                  ].map((row) => (
                    <tr key={row.scenario} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td className="py-3 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>{row.scenario}</td>
                      <td className="py-3 px-4" style={{ color: "var(--text-secondary)" }}>{row.handling}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>

        {/* ── Technical Reference ─────────────────────────────────── */}
        <FadeUp>
          <div className="mb-20">
            <SectionLabel>Technical Reference</SectionLabel>
            <SectionTitle>Database tables</SectionTitle>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "newsletter_pipeline_runs", desc: "One row per week. Tracks status, research/curator/content/review outputs, approval state.", fields: "id, week_of, status, research_output, curator_output, content_output, review_output, selected_fund_metric_id, retry_count, approved_at" },
                { name: "newsletter_candidates", desc: "Top 10 scored candidates per pipeline run. IRS dimensions stored individually for transparency.", fields: "id, pipeline_run_id, fund_metric_id, irs_market_moment, irs_fundraise_activity, irs_data_freshness, irs_institutional_signal, irs_narrative_uniqueness, final_score, selected" },
                { name: "newsletter_featured_funds", desc: "Prevents repeat features. Used for decay penalty calculation.", fields: "id, fund_metric_id, fund_name, strategy, featured_week, pipeline_run_id" },
              ].map((t) => (
                <Card key={t.name}>
                  <p className="text-[14px] font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: MONO }}>{t.name}</p>
                  <p className="text-[13px] leading-[1.5] mb-3" style={{ color: "var(--text-secondary)" }}>{t.desc}</p>
                  <p className="text-[11px] leading-[1.5]" style={{ color: "var(--text-muted)", fontFamily: MONO }}>{t.fields}</p>
                </Card>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ── Slack Agent ──────────────────────────────────────── */}
        <FadeUp>
          <div className="mb-20">
            <SectionLabel>Conversational Agent</SectionLabel>
            <SectionTitle>The Slack employee</SectionTitle>
            <p className="text-[15px] leading-[1.6] max-w-[640px] mb-8" style={{ color: "var(--text-secondary)" }}>
              A Gemini 2.0 Flash-powered AI employee in #alt-weekly. Understands natural language (slang, typos, anything), decides what tools to call, queries the database, takes actions, and responds conversationally. Has persistent memory that grows with each pipeline run.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <p className="text-[14px] font-bold mb-4" style={{ color: "var(--green-deep)" }}>14 Tools</p>
                <ul className="space-y-1.5">
                  {[
                    "get_pipeline_status — current/recent runs",
                    "get_fund_pool — fund count, strategy breakdown, top performers",
                    "get_feedback — reader thumbs up/down, reasons",
                    "get_candidates — scored candidates from a run",
                    "get_featured_history — previously featured funds",
                    "get_newsletter_content — draft content preview",
                    "get_schedule — cron status, next dates",
                    "get_agent_memory — past decisions, learnings, team direction",
                    "analyze_system_health — quality trends, error patterns, flags",
                    "search_channel_history — search team discussions",
                    "audit_fund — deep fund audit with SearchAPI + Gemini verification",
                    "approve_newsletter — approve pending (requires verified user)",
                    "skip_newsletter — cancel this week",
                    "trigger_pipeline — start a new run",
                  ].map((t) => (
                    <li key={t} className="text-[13px] flex items-start gap-2" style={{ color: "var(--text-body)" }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--green-deep)" }} />
                      <span style={{ fontFamily: MONO }}>{t.split(" — ")[0]}</span>
                      <span style={{ color: "var(--text-muted)" }}> — {t.split(" — ")[1]}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <p className="text-[14px] font-bold mb-4" style={{ color: "var(--green-deep)" }}>Context Awareness</p>
                <ul className="space-y-3">
                  {[
                    { label: "Channel context", desc: "Reads last 15 #alt-weekly messages as background awareness on every interaction" },
                    { label: "Thread context", desc: "Reads last 20 messages in the current thread for conversation continuity" },
                    { label: "On-demand search", desc: "Can search deeper into channel history when it needs more context" },
                    { label: "User identity", desc: "Resolves Slack user IDs to names — knows who it's talking to" },
                    { label: "Persistent memory", desc: "Stores decisions, learnings, and team direction across runs. Reads them back before each selection" },
                  ].map((r) => (
                    <li key={r.label} className="flex items-start gap-3">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                        <circle cx="8" cy="8" r="8" fill="var(--green-pale)" />
                        <path d="M5 8L7 10L11 6" stroke="var(--green-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div>
                        <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{r.label}</span>
                        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{r.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* How it works */}
            <Card className="mb-6">
              <p className="text-[14px] font-bold mb-4" style={{ color: "var(--green-deep)" }}>How It Works</p>
              <CodeBlock>{`WHEN YOU @MENTION IT:
1. Slack sends event → events route detects #alt-weekly → routes to newsletter agent
2. Agent loads context: last 15 channel messages + thread history
3. Message + context → Gemini 2.0 Flash with 14 tool definitions
4. Gemini decides what tools to call (up to 5 rounds of tool calls)
5. Each tool queries Supabase → returns data → Gemini reasons about it
6. Gemini composes natural language response → posted to Slack thread
7. Everything logged to newsletter_agent_logs

WHEN THE PIPELINE RUNS (WEDNESDAY CRON):
1. Supervisor reads #alt-weekly → Gemini summarizes team direction
2. Reads feedback + checks system health → posts opening Slack message
3. Runs 6 agents: Research → Curator → Enrichment → Content Gen → Quality Review → Cross-Reference
4. Each step posts threaded update to Slack
5. Curator: reads memory + feedback → Gemini produces scoring adjustments → applies penalties/boosts
6. Quality review: data sanity → fact-check → anti-vibe → tone (retry up to 2x)
7. Done → "Ready for review" with preview link
8. Monday 8AM: auto-publishes if review passed, blocks if not
9. Approved → sends via Resend to subscribers`}</CodeBlock>
            </Card>

            {/* Slack→Pipeline Bridge */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <p className="text-[14px] font-bold mb-4" style={{ color: "var(--green-deep)" }}>Slack → Pipeline Bridge</p>
                <p className="text-[13px] leading-[1.6] mb-3" style={{ color: "var(--text-body)" }}>
                  Team discussions in #alt-weekly directly influence the automated pipeline. Before each Wednesday cron run, the supervisor reads recent Slack messages and summarizes team direction via Gemini.
                </p>
                <p className="text-[13px] leading-[1.6]" style={{ color: "var(--text-body)" }}>
                  If Milun says &ldquo;let&rsquo;s do more credit funds&rdquo; in Slack, the next run&rsquo;s curator and content-gen both receive that direction and act on it — no manual configuration needed.
                </p>
              </Card>
              <Card>
                <p className="text-[14px] font-bold mb-4" style={{ color: "var(--green-deep)" }}>Fund Audit Tool</p>
                <p className="text-[13px] leading-[1.6] mb-3" style={{ color: "var(--text-body)" }}>
                  The <span style={{ fontFamily: MONO }}>audit_fund</span> tool runs a senior-level audit on any fund in the database:
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Pulls fund data from Supabase",
                    "Researches GP + fund via SearchAPI Google AI Mode (2 queries)",
                    "Cross-references claims against Gemini's knowledge",
                    "Checks for hallucinations and data discrepancies",
                    "Assesses GP reputation, market context, red flags",
                    "Produces 1-10 data reliability score with reasoning",
                  ].map((item) => (
                    <li key={item} className="text-[12px] flex items-start gap-2" style={{ color: "var(--text-body)" }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--green)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Daily Report + Auto-Publish */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <p className="text-[14px] font-bold mb-4" style={{ color: "var(--green-deep)" }}>Daily Report (9 AM UTC)</p>
                <p className="text-[13px] leading-[1.6]" style={{ color: "var(--text-body)" }}>
                  Every day the agent posts a summary to #alt-weekly: pipeline activity in last 24h, new feedback (thumbs up/down + reasons), system health flags (failure rates, quality scores), new agent learnings, and next scheduled run. Also stored in agent logs for the admin dashboard.
                </p>
              </Card>
              <Card>
                <p className="text-[14px] font-bold mb-4" style={{ color: "var(--green-deep)" }}>Email Sending (Resend)</p>
                <p className="text-[13px] leading-[1.6]" style={{ color: "var(--text-body)" }}>
                  Approved newsletters are sent via Resend to all active subscribers. Every 15 minutes, a cron checks for approved-but-unsent runs and triggers the send task. Emails include thumbs up/down links for reader feedback and an unsubscribe link.
                </p>
              </Card>
            </div>
          </div>
        </FadeUp>

        {/* ── Self-Improving Feedback Loop ───────────────────────── */}
        <FadeUp>
          <div className="mb-20">
            <SectionLabel>Feedback Loop</SectionLabel>
            <SectionTitle>Self-improving selection</SectionTitle>
            <p className="text-[15px] leading-[1.6] max-w-[640px] mb-8" style={{ color: "var(--text-secondary)" }}>
              The system learns from every newsletter sent. Reader feedback directly changes fund scoring — not just as context, but as concrete numerical adjustments.
            </p>

            <Card className="mb-6">
              <CodeBlock>{`FEEDBACK FLOW:
1. Newsletter sent → readers click thumbs up/down in email
2. Thumbs down → "What didn't you like?" page → reasons stored
3. Slack emoji reactions on pipeline messages → also stored
4. Next pipeline run:
   a. Curator reads all recent feedback
   b. Gemini analyzes feedback themes + team Slack direction + past memory
   c. Produces structured JSON: { penalize: [{strategy, amount, reason}], boost: [...] }
   d. Adjustments applied as concrete score changes (not just context)
   e. Decision + adjustments written to agent memory for future runs
5. Agent reports feedback summary in opening Slack message`}</CodeBlock>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "newsletter_feedback", desc: "Stores every thumbs up/down, reason, source (email/slack/web), subscriber email" },
                { name: "newsletter_agent_memory", desc: "Persistent memory: decisions, learnings, team direction. Read before each run." },
                { name: "newsletter_agent_logs", desc: "Activity log: every tool call, conversation, error with timestamps and duration" },
              ].map((t) => (
                <Card key={t.name}>
                  <p className="text-[14px] font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: MONO }}>{t.name}</p>
                  <p className="text-[13px] leading-[1.5]" style={{ color: "var(--text-secondary)" }}>{t.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ── Glossary ──────────────────────────────────────────── */}
        <FadeUp>
          <div className="mb-20">
            <SectionLabel>Reference</SectionLabel>
            <SectionTitle>Glossary</SectionTitle>

            <div className="overflow-x-auto">
              <table className="w-full text-[14px]" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    <th className="text-left py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>Term</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>Definition</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { term: "IRS", def: "Institutional Relevance Score. 5-dimension weighted score (0-10) that determines which fund to feature each week." },
                    { term: "IRR", def: "Internal Rate of Return. The annualized return of a fund, net of fees. The #1 metric LPs care about." },
                    { term: "TVPI", def: "Total Value to Paid-In. (Distributions + NAV) / Capital Called. Shows total value created per dollar invested." },
                    { term: "DPI", def: "Distributions to Paid-In. Cash returned / Capital Called. Shows actual cash back to investors." },
                    { term: "MOIC", def: "Multiple on Invested Capital. Total value / total invested. Similar to TVPI but sometimes includes recycled capital." },
                    { term: "GP", def: "General Partner. The fund manager who makes investment decisions and charges fees." },
                    { term: "LP", def: "Limited Partner. The investor who commits capital to the fund (pensions, endowments, family offices)." },
                    { term: "Vintage Year", def: "The year a fund started investing. Used to compare funds against their peer cohort." },
                    { term: "Mgmt Fee", def: "Annual management fee charged by the GP, typically 1.5-2.0% of committed capital." },
                    { term: "Carry", def: "Carried interest. The GP's share of profits, typically 20% above a hurdle rate." },
                    { term: "Hurdle Rate", def: "Minimum return the fund must achieve before the GP earns carry. Typically 8%." },
                    { term: "Decay Penalty", def: "Score reduction (-2.0) applied when the same strategy was featured in the last 4 weeks. Forces diversity." },
                    { term: "Feedback Adjustment", def: "Score change applied by Gemini based on reader feedback. Penalizes disliked strategies, boosts preferred ones." },
                    { term: "Anti-Vibe", def: "Quality gate that rejects marketing language, banned words, and missing bear cases. Score >= 90 to pass." },
                    { term: "SearchAPI AI Mode", def: "Google AI Mode via SearchAPI.io. Reads full web pages and returns synthesized answers. Used for market intelligence and fund audits." },
                    { term: "Pipeline Run", def: "One execution of the full newsletter pipeline (research → curate → enrich → generate → review). One per week." },
                    { term: "Agent Memory", def: "Persistent storage of decisions, learnings, and team direction. The agent reads this before each run to improve over time." },
                    { term: "Trigger.dev", def: "Serverless task orchestration platform. Runs all pipeline agents with retries, timeouts, and scheduling." },
                  ].map((row) => (
                    <tr key={row.term} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td className="py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)", fontFamily: MONO }}>{row.term}</td>
                      <td className="py-3 px-4" style={{ color: "var(--text-secondary)" }}>{row.def}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>

        {/* Footer */}
        <div className="pt-10" style={{ borderTop: "1px solid var(--border-light)" }}>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            Weekly Alpha Newsletter Pipeline v2.0 &middot; Built with Trigger.dev, Supabase, Gemini Flash, SearchAPI, Slack Bot API
          </p>
        </div>
      </div>
    </div>
  );
}

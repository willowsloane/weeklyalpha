import { ImageResponse } from "next/og";
import { getIssueById } from "@/lib/data";
import { ordinal, pctColor, pctBg, C } from "@/lib/format";

export const runtime = "edge";
export const alt = "Weekly Alpha — Fund Performance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const issue = await getIssueById(id);

  if (!issue) {
    return new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: C.accent, color: C.surface, fontSize: 48, fontWeight: 700 }}>
        Weekly Alpha
      </div>,
      { ...size }
    );
  }

  const accent = issue.irrPercentile != null ? pctColor(issue.irrPercentile) : C.accent;
  const badgeBg = issue.irrPercentile != null ? pctBg(issue.irrPercentile) : "rgba(6,78,55,0.08)";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: C.bg,
        padding: "60px 72px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 32, borderRadius: 4, background: C.accent }} />
          <span style={{ fontSize: 22, fontWeight: 700, color: C.primary, letterSpacing: "-0.02em" }}>Weekly Alpha</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.08em" }}>{issue.strategyLabel}</span>
          {issue.vintageYear && <span style={{ fontSize: 14, fontWeight: 500, color: C.muted }}>{issue.vintageYear} Vintage</span>}
          {issue.fundSize && <span style={{ fontSize: 14, fontWeight: 500, color: C.muted }}>{issue.fundSize}</span>}
        </div>
      </div>

      {/* Fund name */}
      <div style={{ fontSize: 42, fontWeight: 700, color: C.primary, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 40, maxWidth: 800 }}>
        {issue.fundName}
      </div>

      {/* Performance strip */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 48, marginTop: "auto" }}>
        {issue.irrNet && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Net IRR</span>
            <span style={{ fontSize: 72, fontWeight: 500, color: accent, letterSpacing: "-0.04em", lineHeight: 1 }}>{issue.irrNet}</span>
            {issue.irrPercentile != null && issue.peerCount >= 5 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.04em", background: badgeBg, padding: "3px 10px", borderRadius: 4 }}>
                  {ordinal(issue.irrPercentile)} pctl
                </span>
                <span style={{ fontSize: 12, color: C.muted }}>{issue.peerCount} peers</span>
              </div>
            )}
          </div>
        )}

        {issue.tvpi && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>TVPI</span>
            <span style={{ fontSize: 36, fontWeight: 600, color: C.primary, letterSpacing: "-0.02em" }}>{issue.tvpi}</span>
          </div>
        )}
        {issue.dpi && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>DPI</span>
            <span style={{ fontSize: 36, fontWeight: 600, color: C.primary, letterSpacing: "-0.02em" }}>{issue.dpi}</span>
          </div>
        )}
        {issue.carry && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.subtle, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Carry</span>
            <span style={{ fontSize: 36, fontWeight: 600, color: C.primary, letterSpacing: "-0.02em" }}>{issue.carry}</span>
          </div>
        )}
      </div>
    </div>,
    { ...size }
  );
}

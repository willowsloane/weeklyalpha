/* Shared formatting utilities for fund display */

/** Ordinal suffix: 1st, 2nd, 3rd, 4th... */
export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Percentile → accent color (6-stop ramp) */
export function pctColor(p: number): string {
  if (p >= 75) return "#064E37";
  if (p >= 60) return "#0A7B55";
  if (p >= 50) return "#0891B2";
  if (p >= 40) return "#0E7490";
  if (p >= 25) return "#D97706";
  return "#7A7672";
}

/** Percentile → background color (rgba, safe for any context) */
export function pctBg(p: number): string {
  if (p >= 75) return "rgba(6,78,55,0.08)";
  if (p >= 60) return "rgba(10,123,85,0.08)";
  if (p >= 50) return "rgba(8,145,178,0.08)";
  if (p >= 40) return "rgba(14,116,144,0.08)";
  if (p >= 25) return "rgba(217,119,6,0.08)";
  return "rgba(122,118,114,0.08)";
}

/** Design tokens — centralized color palette */
export const C = {
  bg: "#FAFAF8",
  surface: "#fff",
  cream: "#F5F3EF",
  border: "#E8E5E0",
  borderLight: "#F0EDE8",
  muted: "#9A9895",
  subtle: "#7A7672",
  secondary: "#4A4744",
  body: "#2D2A26",
  primary: "#1A1714",
  accent: "#064E37",
  accentMid: "#0A7B55",
  peerBar: "#C4C0BC",
  peerBarLight: "#E8E5E0",
} as const;

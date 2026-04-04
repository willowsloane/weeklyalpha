"use client";

import { motion } from "framer-motion";

interface FundHeroImageProps {
  strategy: string;
  fundName: string;
  gradient: string;
  vintageYear?: number | null;
  fundSize?: string | null;
}

/* Hero-specific palette (white-on-dark) */
const H = {
  text: "rgba(255,255,255,0.9)",
  textMuted: "rgba(255,255,255,0.5)",
  grid: "rgba(255,255,255,0.08)",
  tag: "rgba(255,255,255,0.15)",
  areaTop: "rgba(255,255,255,0.12)",
  areaBottom: "rgba(255,255,255,0.02)",
  line: "rgba(255,255,255,0.5)",
  lineFaint: "rgba(255,255,255,0.2)",
  overlay: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
} as const;

// Generate a deterministic "chart" path from fund name
function generateChartPath(seed: string, width: number, height: number): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  const points: [number, number][] = [];
  const steps = 12;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    hash = ((hash << 5) - hash + i * 7) | 0;
    const y = height * 0.3 + (Math.abs(hash % 100) / 100) * height * 0.5 - (i / steps) * height * 0.2;
    points.push([x, Math.max(height * 0.15, Math.min(height * 0.85, y))]);
  }
  return `M ${points.map(([x, y]) => `${x.toFixed(0)} ${y.toFixed(0)}`).join(" L ")}`;
}

function generateAreaPath(chartPath: string, width: number, height: number): string {
  return `${chartPath} L ${width} ${height} L 0 ${height} Z`;
}

export function FundHeroImage({ strategy, fundName, gradient, vintageYear, fundSize }: FundHeroImageProps) {
  const chartPath = generateChartPath(fundName, 600, 300);
  const areaPath = generateAreaPath(chartPath, 600, 300);
  const gradientId = `area-${fundName.replace(/\W/g, "").slice(0, 8)}`;

  return (
    <div className="relative w-full aspect-[2/1] rounded-[8px] overflow-hidden" style={{ background: gradient }}>
      {/* Grid + chart SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.12" />
            <stop offset="100%" stopColor="white" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Horizontal grid */}
        {[0.25, 0.5, 0.75].map((y) => (
          <line key={y} x1="0" y1={y * 300} x2="600" y2={y * 300} stroke="white" strokeWidth="0.5" opacity="0.08" />
        ))}
        {/* Vertical grid */}
        {[0.2, 0.4, 0.6, 0.8].map((x) => (
          <line key={x} x1={x * 600} y1="0" x2={x * 600} y2="300" stroke="white" strokeWidth="0.5" opacity="0.08" />
        ))}
        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        {/* Chart line */}
        <motion.path
          d={chartPath}
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        {/* Second line (slightly offset) */}
        <motion.path
          d={generateChartPath(fundName + "2", 600, 300)}
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>

      {/* Bottom overlay */}
      <div className="absolute inset-x-0 bottom-0" style={{ background: H.overlay, height: "60%" }} />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-[3px]" style={{ background: H.tag, color: H.text }}>
            {strategy}
          </span>
          {vintageYear && <span className="text-[10px] font-semibold tracking-[0.08em] uppercase" style={{ color: H.textMuted }}>{vintageYear} Vintage</span>}
          {fundSize && <span className="text-[10px] font-semibold tracking-[0.08em] uppercase" style={{ color: H.textMuted }}>{fundSize}</span>}
        </div>
        <h2 className="text-[24px] md:text-[32px] font-bold tracking-[-0.02em] leading-[1.1]" style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#fff" }}>
          {fundName}
        </h2>
      </div>
    </div>
  );
}

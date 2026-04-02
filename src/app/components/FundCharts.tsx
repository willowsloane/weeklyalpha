"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MONO = "var(--font-mono), 'IBM Plex Mono', monospace";

// ── Percentile Gauge ──────────────────────────────────────────────────

export function PercentileGauge({ value, label, percentile }: { value: string; label: string; percentile: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const angle = (percentile / 100) * 270 - 135; // -135 to 135 degree arc
  const r = 52;
  const circumference = 2 * Math.PI * r * (270 / 360);
  const offset = circumference - (percentile / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-[140px] h-[140px]">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-[225deg]">
          {/* Background arc */}
          <circle cx="60" cy="60" r={r} fill="none" stroke="#F0EDE8" strokeWidth="8"
            strokeDasharray={`${circumference} ${2 * Math.PI * r}`} strokeLinecap="round" />
          {/* Value arc */}
          <motion.circle cx="60" cy="60" r={r} fill="none" stroke="#064E37" strokeWidth="8"
            strokeDasharray={`${circumference} ${2 * Math.PI * r}`}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: "#064E37", fontFamily: MONO }}>{value}</span>
          <span className="text-[11px] font-semibold" style={{ color: "#4A4744" }}>{percentile}th pctile</span>
        </div>
      </div>
      <span className="text-[12px] font-semibold tracking-[0.08em] uppercase mt-2" style={{ color: "#4A4744" }}>{label}</span>
    </div>
  );
}

// ── Horizontal Bar Comparison ─────────────────────────────────────────

function CompBar({ label, value, maxValue, displayValue, color, delay = 0 }: {
  label: string; value: number; maxValue: number; displayValue: string; color: string; delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const pct = Math.min(100, Math.max(2, (value / maxValue) * 100));

  return (
    <div ref={ref} className="flex items-center gap-4">
      <span className="text-[13px] font-semibold w-[100px] shrink-0 text-right" style={{ color: "#1A1714" }}>{label}</span>
      <div className="flex-1 h-[28px] rounded-[4px] overflow-hidden" style={{ background: "#F0EDE8" }}>
        <motion.div
          className="h-full rounded-[4px]"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 + delay }}
        />
      </div>
      <span className="text-[13px] font-bold w-[60px] shrink-0" style={{ color, fontFamily: MONO }}>{displayValue}</span>
    </div>
  );
}

export function PeerComparisonChart({ fundIrr, peerQ1, peerMedian, peerQ3, fundLabel = "This Fund" }: {
  fundIrr: number; peerQ1: number | null; peerMedian: number | null; peerQ3: number | null; fundLabel?: string;
}) {
  const maxVal = Math.max(fundIrr, peerQ3 || 0, peerMedian || 0) * 1.2;

  return (
    <div className="p-6 rounded-[10px]" style={{ background: "#F5F3EF", border: "1px solid #E8E5E0" }}>
      <p className="text-[12px] font-bold tracking-[0.1em] uppercase mb-5" style={{ color: "#4A4744" }}>IRR vs Peer Group</p>
      <div className="space-y-3">
        <CompBar label={fundLabel} value={fundIrr} maxValue={maxVal} displayValue={fundIrr.toFixed(1) + "%"} color="#064E37" delay={0} />
        {peerQ3 != null && <CompBar label="Top Quartile" value={peerQ3} maxValue={maxVal} displayValue={peerQ3.toFixed(1) + "%"} color="#0A7B55" delay={0.1} />}
        {peerMedian != null && <CompBar label="Median" value={peerMedian} maxValue={maxVal} displayValue={peerMedian.toFixed(1) + "%"} color="#9CA3AF" delay={0.2} />}
        {peerQ1 != null && <CompBar label="Bottom Quartile" value={peerQ1} maxValue={maxVal} displayValue={peerQ1.toFixed(1) + "%"} color="#D1D5DB" delay={0.3} />}
      </div>
    </div>
  );
}

// ── Fee Comparison Dots ───────────────────────────────────────────────

export function FeeComparison({ items }: { items: { label: string; fundValue: number | null; peerValue: number | null; unit: string; lowerIsBetter: boolean }[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="p-6 rounded-[10px]" style={{ background: "#F5F3EF", border: "1px solid #E8E5E0" }}>
      <p className="text-[12px] font-bold tracking-[0.1em] uppercase mb-5" style={{ color: "#4A4744" }}>Fee Structure vs Peers</p>
      <div className="space-y-5">
        {items.filter(i => i.fundValue != null).map((item, idx) => {
          const isFavorable = item.lowerIsBetter
            ? (item.peerValue != null && item.fundValue! <= item.peerValue)
            : (item.peerValue != null && item.fundValue! >= item.peerValue);

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold" style={{ color: "#1A1714" }}>{item.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-bold" style={{ color: isFavorable ? "#064E37" : "#DC2626", fontFamily: MONO }}>
                    {item.fundValue!.toFixed(item.unit === "%" ? 2 : 1)}{item.unit}
                  </span>
                  {item.peerValue != null && (
                    <span className="text-[12px]" style={{ color: "#7A7672" }}>
                      vs {item.peerValue.toFixed(item.unit === "%" ? 2 : 1)}{item.unit} peer median
                    </span>
                  )}
                </div>
              </div>
              {/* Visual comparison bar */}
              {item.peerValue != null && (
                <div className="relative h-[6px] rounded-full" style={{ background: "#E8E5E0" }}>
                  {/* Peer marker */}
                  <div className="absolute top-[-3px] w-[2px] h-[12px] rounded-full" style={{ left: "50%", background: "#9CA3AF" }} />
                  {/* Fund position */}
                  <motion.div
                    className="absolute top-[-5px] w-[16px] h-[16px] rounded-full border-2 border-white"
                    style={{ background: isFavorable ? "#064E37" : "#DC2626" }}
                    initial={{ left: "50%" }}
                    animate={inView ? {
                      left: `${Math.min(95, Math.max(5, (item.fundValue! / (item.peerValue * 2)) * 100))}%`
                    } : {}}
                    transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px]" style={{ color: "#9CA3AF" }}>Lower</span>
                    <span className="text-[10px]" style={{ color: "#9CA3AF" }}>Higher</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: "1px solid #E8E5E0" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#064E37" }} />
          <span className="text-[11px]" style={{ color: "#4A4744" }}>LP Favorable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#DC2626" }} />
          <span className="text-[11px]" style={{ color: "#4A4744" }}>Above Market</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-[2px] h-3 rounded-full" style={{ background: "#9CA3AF" }} />
          <span className="text-[11px]" style={{ color: "#4A4744" }}>Peer Median</span>
        </div>
      </div>
    </div>
  );
}

// ── Metrics Highlight Strip ───────────────────────────────────────────

export function MetricStrip({ metrics }: { metrics: { label: string; value: string; subtext?: string }[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="flex flex-wrap gap-0 rounded-[10px] overflow-hidden"
      style={{ border: "1px solid #E8E5E0" }}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className="flex-1 min-w-[140px] py-5 px-5 text-center"
          style={{ background: i % 2 === 0 ? "#F5F3EF" : "#FAFAF8", borderRight: i < metrics.length - 1 ? "1px solid #E8E5E0" : "none" }}
        >
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-2" style={{ color: "#7A7672" }}>{m.label}</p>
          <p className="text-[28px] font-bold tracking-[-0.02em] leading-none" style={{ color: "#064E37", fontFamily: MONO }}>{m.value}</p>
          {m.subtext && <p className="text-[11px] mt-1.5" style={{ color: "#4A4744" }}>{m.subtext}</p>}
        </div>
      ))}
    </motion.div>
  );
}

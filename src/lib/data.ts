import { getSupabase } from "./supabase";
import { getImageForFund } from "./images";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Strategy → gradient + color mapping
const STRATEGY_STYLES: Record<string, { gradient: string; tagColor: string }> = {
  venture: { gradient: "linear-gradient(135deg, #064E37 0%, #059669 60%, #34D399 100%)", tagColor: "#059669" },
  private_equity: { gradient: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 60%, #A78BFA 100%)", tagColor: "#7C3AED" },
  buyout: { gradient: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 60%, #A78BFA 100%)", tagColor: "#7C3AED" },
  growth_equity: { gradient: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 60%, #60A5FA 100%)", tagColor: "#2563EB" },
  real_estate: { gradient: "linear-gradient(135deg, #92400E 0%, #D97706 60%, #FCD34D 100%)", tagColor: "#D97706" },
  infrastructure: { gradient: "linear-gradient(135deg, #1E3A5F 0%, #0891B2 60%, #67E8F9 100%)", tagColor: "#0891B2" },
  private_credit: { gradient: "linear-gradient(135deg, #701A1A 0%, #DC2626 60%, #FCA5A5 100%)", tagColor: "#DC2626" },
  credit: { gradient: "linear-gradient(135deg, #701A1A 0%, #DC2626 60%, #FCA5A5 100%)", tagColor: "#DC2626" },
  secondaries: { gradient: "linear-gradient(135deg, #3F3F46 0%, #71717A 60%, #D4D4D8 100%)", tagColor: "#71717A" },
  hedge_fund: { gradient: "linear-gradient(135deg, #064E37 0%, #047857 60%, #6EE7B7 100%)", tagColor: "#047857" },
  multi_strategy: { gradient: "linear-gradient(135deg, #312E81 0%, #4338CA 60%, #818CF8 100%)", tagColor: "#4338CA" },
};

const DEFAULT_STYLE = { gradient: "linear-gradient(135deg, #064E37 0%, #0A7B55 40%, #21759B 100%)", tagColor: "#21759B" };

export function getStrategyStyle(strategy: string | null) {
  if (!strategy) return DEFAULT_STYLE;
  return STRATEGY_STYLES[strategy] || DEFAULT_STYLE;
}

export function formatStrategy(strategy: string | null): string {
  if (!strategy) return "Alternative";
  return strategy.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function bpsToPercent(bps: number | null, decimals = 1): string | null {
  if (bps == null) return null;
  return (bps / 100).toFixed(decimals) + "%";
}

export function x100ToMultiple(val: number | null): string | null {
  if (val == null) return null;
  return (val / 100).toFixed(2) + "x";
}

export function usdToLabel(usd: number | null): string | null {
  if (usd == null) return null;
  if (usd >= 1e9) return "$" + (usd / 1e9).toFixed(1) + "B";
  if (usd >= 1e6) return "$" + (usd / 1e6).toFixed(0) + "M";
  return "$" + usd.toLocaleString();
}

export interface FeaturedIssue {
  id: string;
  pipelineRunId: string;
  weekOf: string;
  fundName: string;
  gpName: string;
  strategy: string;
  vintageYear: number | null;
  fundSize: string | null;
  irrNet: string | null;
  tvpi: string | null;
  dpi: string | null;
  carry: string | null;
  hurdle: string | null;
  mgmtFee: string | null;
  subject: string;
  previewText: string;
  bodyHtml: string;
  heroHtml: string;
  plainText: string;
  gradient: string;
  tagColor: string;
  strategyLabel: string;
  imageUrl: string;
  // Raw numeric values for charts
  irrNetBps: number | null;
  mgmtFeeBps: number | null;
  carryBps: number | null;
  hurdleBps: number | null;
  tvpiX100: number | null;
  dpiX100: number | null;
  fundSizeUsd: number | null;
  // Peer data for charts
  peerIrrQ1: number | null;
  peerIrrMedian: number | null;
  peerIrrQ3: number | null;
  peerIrrP90: number | null;
  peerIrrMin: number | null;
  peerIrrMax: number | null;
  peerFeeMedian: number | null;
  peerCount: number;
  irrPercentile: number | null;
  dataAsOf: string | null;
  bullCase: string | null;
  bearCase: string | null;
  insightImageUrl: string | null;
  insightImageSource: string | null;
}

export async function getFeaturedIssues(limit = 10): Promise<FeaturedIssue[]> {
  const supabase = getSupabase();

  // Get approved/sent pipeline runs with content
  const { data: runs } = await supabase
    .from("newsletter_pipeline_runs")
    .select("id, week_of, status, selected_fund_metric_id, content_output")
    .in("status", ["approved", "sent"])
    .not("content_output", "eq", "{}")
    .not("selected_fund_metric_id", "is", null)
    .order("approved_at", { ascending: false })
    .limit(limit);

  if (!runs || runs.length === 0) return [];

  // Get fund metrics for each run
  const fundIds = runs.map((r: any) => r.selected_fund_metric_id).filter(Boolean);
  const { data: funds, error: fundsError } = await supabase
    .from("fund_metrics")
    .select("id, fund_name, gp_name, strategy, vintage_year, fund_size_usd, irr_net_bps, tvpi_x100, dpi_x100, carry_bps, hurdle_bps, mgmt_fee_bps")
    .in("id", fundIds);

  if (fundsError) console.error("[getFeaturedIssues] fund_metrics query failed:", fundsError.message);
  const fundMap = new Map((funds || []).map((f: any) => [f.id, f]));

  // Fetch peer data for all strategies/vintages in one go
  const strategies = [...new Set((funds || []).map((f: any) => f.strategy).filter(Boolean))];
  let allPeers: any[] = [];
  for (const strat of strategies) {
    const { data: peers } = await supabase
      .from("fund_metrics")
      .select("id, strategy, vintage_year, irr_net_bps, mgmt_fee_bps")
      .eq("strategy", strat)
      .not("irr_net_bps", "is", null)
      .limit(200);
    allPeers = allPeers.concat(peers || []);
  }

  return runs
    .map((run: any) => {
      const fund = fundMap.get(run.selected_fund_metric_id);
      if (!fund) return null;
      const content = run.content_output || {};
      const style = getStrategyStyle(fund.strategy);

      // Compute peer stats — exclude the fund itself from its own peer group
      const vMin = (fund.vintage_year || 2020) - 2;
      const vMax = (fund.vintage_year || 2020) + 2;
      const peers = allPeers.filter((p: any) =>
        p.strategy === fund.strategy &&
        p.vintage_year >= vMin &&
        p.vintage_year <= vMax &&
        p.irr_net_bps != null &&
        p.id !== fund.id
      );
      const peerIrrs = peers.map((p: any) => p.irr_net_bps).sort((a: number, b: number) => a - b);
      const peerFees = peers.filter((p: any) => p.mgmt_fee_bps != null).map((p: any) => p.mgmt_fee_bps).sort((a: number, b: number) => a - b);
      // Percentile rank: (strictly below + 0.5 × equal) / total × 100
      // Uses Math.floor for conservative reporting (institutional convention)
      // Requires >= 5 peers to be statistically meaningful
      let irrPercentile: number | null = null;
      if (fund.irr_net_bps != null && peerIrrs.length >= 5) {
        const below = peerIrrs.filter((v: number) => v < fund.irr_net_bps).length;
        const equal = peerIrrs.filter((v: number) => v === fund.irr_net_bps).length;
        irrPercentile = Math.floor(((below + 0.5 * equal) / peerIrrs.length) * 100);
      }

      return {
        id: fund.id,
        pipelineRunId: run.id,
        weekOf: content?.displayWeekOf || run.week_of,
        fundName: fund.fund_name || "Unknown Fund",
        gpName: fund.gp_name || "",
        strategy: fund.strategy || "alternative",
        vintageYear: fund.vintage_year,
        fundSize: usdToLabel(fund.fund_size_usd),
        irrNet: bpsToPercent(fund.irr_net_bps),
        tvpi: x100ToMultiple(fund.tvpi_x100),
        dpi: x100ToMultiple(fund.dpi_x100),
        carry: bpsToPercent(fund.carry_bps, 0),
        hurdle: bpsToPercent(fund.hurdle_bps, 0),
        mgmtFee: bpsToPercent(fund.mgmt_fee_bps),
        subject: content.subject || `Weekly Alpha: ${fund.fund_name}`,
        previewText: content.previewText || content.preview_text || "",
        bodyHtml: content.bodyHtml || content.body_html || "",
        heroHtml: content.heroHtml || content.hero_html || "",
        plainText: content.plainText || content.plain_text || "",
        gradient: style.gradient,
        tagColor: style.tagColor,
        strategyLabel: formatStrategy(fund.strategy),
        imageUrl: content.selectedImageUrl || content.imageUrls?.[0] || getImageForFund(fund.strategy, fund.fund_name || ""),
        irrNetBps: fund.irr_net_bps,
        mgmtFeeBps: fund.mgmt_fee_bps,
        carryBps: fund.carry_bps,
        hurdleBps: fund.hurdle_bps,
        tvpiX100: fund.tvpi_x100,
        dpiX100: fund.dpi_x100,
        fundSizeUsd: fund.fund_size_usd,
        peerIrrQ1: peerIrrs.length >= 5 ? peerIrrs[Math.floor(peerIrrs.length * 0.25)] / 100 : null,
        peerIrrMedian: peerIrrs.length >= 3 ? peerIrrs[Math.floor(peerIrrs.length / 2)] / 100 : null,
        peerIrrQ3: peerIrrs.length >= 5 ? peerIrrs[Math.floor(peerIrrs.length * 0.75)] / 100 : null,
        peerIrrP90: peerIrrs.length >= 10 ? peerIrrs[Math.floor(peerIrrs.length * 0.9)] / 100 : null,
        peerIrrMin: peerIrrs.length >= 3 ? peerIrrs[0] / 100 : null,
        peerIrrMax: peerIrrs.length >= 3 ? peerIrrs[peerIrrs.length - 1] / 100 : null,
        peerFeeMedian: peerFees.length > 0 ? peerFees[Math.floor(peerFees.length / 2)] / 100 : null,
        peerCount: peerIrrs.length,
        irrPercentile,
        dataAsOf: fund.data_as_of ?? null,
        bullCase: content.bullCase || null,
        bearCase: content.bearCase || null,
        insightImageUrl: content.insightImageUrl || null,
        insightImageSource: content.insightImageSource || null,
      } as FeaturedIssue;
    })
    .filter(Boolean) as FeaturedIssue[];
}

export async function getIssueById(pipelineRunId: string): Promise<FeaturedIssue | null> {
  const issues = await getFeaturedIssues(50);
  return issues.find((i) => i.pipelineRunId === pipelineRunId) || null;
}

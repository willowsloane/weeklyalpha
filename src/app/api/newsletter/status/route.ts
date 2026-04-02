import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabase();

  const { data: setting } = await supabase
    .from("crawler_settings")
    .select("value")
    .eq("key", "newsletter_cron_enabled")
    .maybeSingle();

  const { data: autoApproveSetting } = await supabase
    .from("crawler_settings")
    .select("value")
    .eq("key", "newsletter_auto_approve")
    .maybeSingle();

  const { data: runs } = await supabase
    .from("newsletter_pipeline_runs")
    .select("id, week_of, status, selected_fund_metric_id, retry_count, error, started_at, completed_at, approved_at, approved_by, created_at, research_output, curator_output, content_output, review_output, updated_at")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: featured } = await supabase
    .from("newsletter_featured_funds")
    .select("fund_name, strategy, featured_week")
    .order("featured_week", { ascending: false })
    .limit(10);

  // Get full candidate data for each run
  const runIds = (runs || []).map((r: { id: string }) => r.id);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let candidatesByRun: Record<string, any[]> = {};
  if (runIds.length > 0) {
    const { data: candData } = await supabase
      .from("newsletter_candidates")
      .select("pipeline_run_id, fund_metric_id, fund_name, gp_name, strategy, vintage_year, irs_market_moment, irs_fundraise_activity, irs_data_freshness, irs_institutional_signal, irs_narrative_uniqueness, irs_raw, decay_penalty, final_score, selected")
      .in("pipeline_run_id", runIds)
      .order("final_score", { ascending: false });

    for (const c of candData || []) {
      const rid = (c as any).pipeline_run_id;
      if (!candidatesByRun[rid]) candidatesByRun[rid] = [];
      candidatesByRun[rid].push(c);
    }
  }

  // Schedule settings
  const { data: scheduleData } = await supabase
    .from("crawler_settings")
    .select("key, value")
    .in("key", ["newsletter_cron_day", "newsletter_cron_hour"]);

  const schedule: Record<string, string> = {};
  for (const row of scheduleData || []) {
    schedule[(row as any).key] = (row as any).value;
  }

  return NextResponse.json({
    cronEnabled: setting?.value === "true",
    autoApprove: autoApproveSetting?.value === "true",
    runs: runs || [],
    featured: featured || [],
    candidatesByRun,
    schedule: {
      day: schedule.newsletter_cron_day || "3",
      hour: schedule.newsletter_cron_hour || "6",
    },
  });
}

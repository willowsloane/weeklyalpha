import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabase();

  // Get cron toggle state
  const { data: setting } = await supabase
    .from("crawler_settings")
    .select("value")
    .eq("key", "newsletter_cron_enabled")
    .maybeSingle();

  // Get recent pipeline runs (last 8 weeks)
  const { data: runs } = await supabase
    .from("newsletter_pipeline_runs")
    .select("id, week_of, status, selected_fund_metric_id, retry_count, error, started_at, completed_at, approved_at, created_at, research_output, curator_output, content_output, review_output")
    .order("created_at", { ascending: false })
    .limit(10);

  // Get featured funds
  const { data: featured } = await supabase
    .from("newsletter_featured_funds")
    .select("fund_name, strategy, featured_week")
    .order("featured_week", { ascending: false })
    .limit(10);

  // Get candidate counts per recent run
  const runIds = (runs || []).map((r: { id: string }) => r.id);
  let candidates: Record<string, number> = {};
  if (runIds.length > 0) {
    const { data: candData } = await supabase
      .from("newsletter_candidates")
      .select("pipeline_run_id, final_score, selected, fund_name")
      .in("pipeline_run_id", runIds)
      .order("final_score", { ascending: false });

    for (const c of candData || []) {
      const rid = (c as { pipeline_run_id: string }).pipeline_run_id;
      candidates[rid] = (candidates[rid] || 0) + 1;
    }
  }

  return NextResponse.json({
    cronEnabled: setting?.value === "true",
    runs: runs || [],
    featured: featured || [],
    candidateCounts: candidates,
  });
}

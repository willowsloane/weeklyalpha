import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * Newsletter feedback endpoint.
 *
 * GET  /api/newsletter/feedback?run=UUID&type=thumbs_up&email=x@y.com
 *   → Records vote and redirects to thank-you or reason page
 *
 * POST /api/newsletter/feedback
 *   → { pipelineRunId, feedbackType, email?, reason? }
 *   → Records detailed feedback (from the "what didn't you like?" page)
 */

// ── GET: one-click from email (thumbs up/down links) ─────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const runId = searchParams.get("run");
  const type = searchParams.get("type"); // thumbs_up | thumbs_down
  const email = searchParams.get("email");

  if (!runId || !type) {
    return NextResponse.json({ error: "Missing run or type parameter" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Get week_of from the pipeline run
  const { data: run } = await supabase
    .from("newsletter_pipeline_runs")
    .select("week_of")
    .eq("id", runId)
    .maybeSingle();

  await supabase.from("newsletter_feedback").insert({
    pipeline_run_id: runId,
    week_of: run?.week_of || null,
    feedback_type: type,
    source: "email",
    email: email || null,
  });

  // If thumbs down, redirect to "what didn't you like?" page
  if (type === "thumbs_down") {
    const reasonUrl = new URL("/feedback", req.url);
    reasonUrl.searchParams.set("run", runId);
    if (email) reasonUrl.searchParams.set("email", email);
    return NextResponse.redirect(reasonUrl.toString());
  }

  // Thumbs up → simple thank you redirect
  const thankYouUrl = new URL("/feedback/thanks", req.url);
  return NextResponse.redirect(thankYouUrl.toString());
}

// ── POST: detailed feedback (from reason page or API) ────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pipelineRunId, feedbackType, email, reason, feedbackValue } = body;

  if (!pipelineRunId || !feedbackType) {
    return NextResponse.json({ error: "Missing pipelineRunId or feedbackType" }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data: run } = await supabase
    .from("newsletter_pipeline_runs")
    .select("week_of")
    .eq("id", pipelineRunId)
    .maybeSingle();

  await supabase.from("newsletter_feedback").insert({
    pipeline_run_id: pipelineRunId,
    week_of: run?.week_of || null,
    feedback_type: feedbackType,
    feedback_value: feedbackValue || null,
    reason: reason || null,
    source: "web",
    email: email || null,
  });

  return NextResponse.json({ ok: true });
}

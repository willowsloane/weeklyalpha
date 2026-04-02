import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const supabase = getSupabase();
  const { pipelineRunId, action, notes } = await request.json();
  // action: "approve" | "reject" | "request_changes"

  if (!pipelineRunId || !action) {
    return NextResponse.json({ error: "Missing pipelineRunId or action" }, { status: 400 });
  }

  if (action === "approve") {
    const { error } = await supabase
      .from("newsletter_pipeline_runs")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: "admin",
        updated_at: new Date().toISOString(),
      })
      .eq("id", pipelineRunId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ status: "approved" });
  }

  if (action === "reject") {
    // Store rejection notes so agents can learn
    const { data: run } = await supabase
      .from("newsletter_pipeline_runs")
      .select("review_output")
      .eq("id", pipelineRunId)
      .single();

    const existingReview = run?.review_output || {};
    const updatedReview = {
      ...existingReview,
      human_feedback: notes || "Rejected without notes",
      human_action: "rejected",
      human_action_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("newsletter_pipeline_runs")
      .update({
        status: "failed",
        review_output: updatedReview,
        error: `Human rejected: ${notes || "No reason given"}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pipelineRunId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ status: "rejected" });
  }

  if (action === "request_changes") {
    // Store feedback for the next content gen retry
    const { data: run } = await supabase
      .from("newsletter_pipeline_runs")
      .select("review_output, retry_count")
      .eq("id", pipelineRunId)
      .single();

    const existingReview = run?.review_output || {};
    const updatedReview = {
      ...existingReview,
      human_feedback: notes || "",
      human_action: "request_changes",
      human_action_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("newsletter_pipeline_runs")
      .update({
        status: "generating", // send back to content gen
        review_output: updatedReview,
        retry_count: (run?.retry_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pipelineRunId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ status: "changes_requested" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

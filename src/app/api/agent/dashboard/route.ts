import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const supabase = getSupabase();

  const [logsRes, memoryRes] = await Promise.all([
    supabase
      .from("newsletter_agent_logs")
      .select("id, log_type, source, user_id, user_name, message, tool_name, tool_args, tool_result, duration_ms, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("newsletter_agent_memory")
      .select("id, memory_type, content, week_of, created_at")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  return NextResponse.json({
    logs: logsRes.data || [],
    memory: memoryRes.data || [],
  });
}

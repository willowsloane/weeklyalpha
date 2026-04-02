import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const supabase = getSupabase();
  const { enabled } = await request.json();

  const { error } = await supabase
    .from("crawler_settings")
    .update({ value: enabled ? "true" : "false" })
    .eq("key", "newsletter_cron_enabled");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cronEnabled: enabled });
}

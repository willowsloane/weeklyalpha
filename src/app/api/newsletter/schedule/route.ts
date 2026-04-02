import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();

  const { data } = await supabase
    .from("crawler_settings")
    .select("key, value")
    .in("key", ["newsletter_cron_enabled", "newsletter_cron_day", "newsletter_cron_hour", "newsletter_auto_approve"]);

  const settings: Record<string, string> = {};
  for (const row of data || []) {
    settings[(row as { key: string; value: string }).key] = (row as { key: string; value: string }).value;
  }

  return NextResponse.json({
    enabled: settings.newsletter_cron_enabled === "true",
    day: settings.newsletter_cron_day || "3", // Wednesday
    hour: settings.newsletter_cron_hour || "6", // 6 AM UTC
    autoApprove: settings.newsletter_auto_approve === "true",
  });
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json();

  const updates: { key: string; value: string }[] = [];

  if (body.day !== undefined) updates.push({ key: "newsletter_cron_day", value: String(body.day) });
  if (body.hour !== undefined) updates.push({ key: "newsletter_cron_hour", value: String(body.hour) });
  if (body.autoApprove !== undefined) updates.push({ key: "newsletter_auto_approve", value: body.autoApprove ? "true" : "false" });

  for (const { key, value } of updates) {
    await supabase
      .from("crawler_settings")
      .upsert({ key, value }, { onConflict: "key" });
  }

  return NextResponse.json({ updated: updates.length });
}

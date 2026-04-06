import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * Newsletter unsubscribe endpoint.
 *
 * GET /api/newsletter/unsubscribe?email=x@y.com
 *   → Marks subscriber as unsubscribed, redirects to confirmation page.
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  const supabase = getSupabase();
  const normalizedEmail = decodeURIComponent(email).toLowerCase().trim();

  await supabase
    .from("newsletter_subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("email", normalizedEmail);

  const confirmUrl = new URL("/unsubscribe/confirmed", req.url);
  return NextResponse.redirect(confirmUrl.toString());
}

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * Newsletter subscribe endpoint.
 *
 * POST /api/newsletter/subscribe
 *   → { email, name?, company?, role? }
 *   → Upserts subscriber in Supabase (shared DB with fin-demo pipeline)
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, name, company, role } = body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const supabase = getSupabase();
  const normalizedEmail = email.toLowerCase().trim();

  // Upsert: if previously unsubscribed, reactivate
  const { error: dbErr } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      {
        email: normalizedEmail,
        name: name || null,
        company: company || null,
        role: role || null,
        status: "active",
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

  if (dbErr) {
    console.error("[subscribe] DB error:", dbErr);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Subscribed to Weekly Alpha" });
}

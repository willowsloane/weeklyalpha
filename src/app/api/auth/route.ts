import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const sitePassword = process.env.SITE_PASSWORD || "expa-2026";

  if (password === sitePassword) {
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set("wa_auth", "authenticated", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

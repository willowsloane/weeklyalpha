import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

/**
 * Proxies chat to the fin-demo agent API.
 * The agent code lives in fin-demo, so we forward the request there.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  const agentUrl = process.env.AGENT_API_URL || "https://fin-demo-tau.vercel.app";

  try {
    const res = await fetch(`${agentUrl}/api/newsletter/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

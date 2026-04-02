import { createClient } from "@supabase/supabase-js";

/* eslint-disable @typescript-eslint/no-explicit-any */

const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

async function getNewsletterContext(): Promise<string> {
  const supabase = getSupabase();

  const { data: runs } = await supabase
    .from("newsletter_pipeline_runs")
    .select("week_of, content_output, selected_fund_metric_id, status")
    .in("status", ["approved", "sent"])
    .order("week_of", { ascending: false })
    .limit(12);

  if (!runs?.length) return "No published newsletters available yet.";

  const summaries = runs
    .filter((r: any) => r.content_output)
    .map((r: any) => {
      const c = r.content_output;
      const plain = c.plainText || c.bodyHtml?.replace(/<[^>]+>/g, "") || "";
      return `--- Issue: ${c.subject || "Untitled"} (Week of ${r.week_of}) ---\n${plain.slice(0, 1200)}`;
    });

  return summaries.join("\n\n");
}

async function getFundContext(): Promise<string> {
  const supabase = getSupabase();

  const { data: funds } = await supabase
    .from("fund_metrics")
    .select("fund_name, gp_name, strategy, vintage_year, fund_size_usd, irr_net_bps, tvpi_x100, dpi_x100, mgmt_fee_bps, carry_bps, hurdle_bps")
    .order("created_at", { ascending: false })
    .limit(50);

  if (!funds?.length) return "";

  return funds
    .map((f: any) => {
      const irr = f.irr_net_bps ? (f.irr_net_bps / 100).toFixed(1) + "%" : "n/a";
      const tvpi = f.tvpi_x100 ? (f.tvpi_x100 / 100).toFixed(2) + "x" : "n/a";
      const size = f.fund_size_usd ? "$" + (f.fund_size_usd / 1e6).toFixed(0) + "M" : "n/a";
      return `${f.fund_name} (${f.gp_name}) | ${f.strategy} ${f.vintage_year} | IRR: ${irr} | TVPI: ${tvpi} | Size: ${size}`;
    })
    .join("\n");
}

export async function POST(req: Request) {
  const { messages, currentPath } = (await req.json()) as {
    messages: ChatMessage[];
    currentPath?: string;
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [newsletterContext, fundContext] = await Promise.all([
    getNewsletterContext(),
    getFundContext(),
  ]);

  const systemInstruction = `You are Alpha — the AI research assistant for Weekly Alpha, a private fund intelligence platform trusted by LPs, allocators, and fund managers.

You have deep expertise in private markets: PE, VC, real estate, credit, infrastructure, secondaries, and fund-of-funds. You speak with authority but remain accessible — think Bloomberg Terminal meets a sharp analyst briefing.

YOUR KNOWLEDGE BASE:

PUBLISHED NEWSLETTERS:
${newsletterContext}

FUND DATABASE (${fundContext ? "recent entries" : "empty"}):
${fundContext || "No fund data available."}

BEHAVIOR:
- When shown a screenshot, analyze what's visible and relate it to your knowledge of the newsletters, funds, and private markets.
- Cite specific fund names, IRRs, TVPIs, and other metrics when relevant.
- If asked about something outside your knowledge, say so clearly — don't fabricate data.
- Keep responses concise and data-driven. Use bullet points for comparisons.
- Format numbers professionally: percentages to 1 decimal, multiples to 2 decimals, sizes in $M or $B.
- You can compare funds, explain metrics, contextualize performance, and provide market commentary.
${currentPath ? `- The user is currently viewing: ${currentPath}` : ""}

TONE: Authoritative, precise, no fluff. Like a senior analyst at a top-tier LP.`;

  // Build Gemini contents array
  const contents = messages.map((m) => {
    const parts: any[] = [];

    if (m.image) {
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: m.image,
        },
      });
    }

    parts.push({ text: m.content || "What do you see in this screenshot? Analyze it." });

    return {
      role: m.role === "assistant" ? "model" : "user",
      parts,
    };
  });

  const geminiBody = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    },
  };

  const geminiRes = await fetch(`${GEMINI_API}&key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(geminiBody),
  });

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    return new Response(JSON.stringify({ error: `Gemini API error: ${err}` }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse Gemini SSE stream and forward as plain text
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = geminiRes.body!.getReader();

  const readable = new ReadableStream({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch {
              // skip malformed JSON chunks
            }
          }
        }

        // Flush remaining buffer
        if (buffer.startsWith("data: ")) {
          try {
            const parsed = JSON.parse(buffer.slice(6).trim());
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) controller.enqueue(encoder.encode(text));
          } catch { /* ignore */ }
        }
      } catch (e: any) {
        controller.enqueue(encoder.encode(`\n\n[Error: ${e.message}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

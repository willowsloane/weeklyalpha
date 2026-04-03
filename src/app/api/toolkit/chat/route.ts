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

async function getActiveArticle(currentPath: string): Promise<string> {
  // Detect /issue/[id] pages and fetch full article content
  const issueMatch = currentPath.match(/^\/issue\/(.+)$/);
  if (!issueMatch) return "";

  const pipelineRunId = issueMatch[1];
  const supabase = getSupabase();

  const { data: run } = await supabase
    .from("newsletter_pipeline_runs")
    .select("week_of, content_output, selected_fund_metric_id, research_output, curator_output, review_output")
    .eq("id", pipelineRunId)
    .single();

  if (!run) return "";

  const content = run.content_output || {};
  const plain = content.plainText || content.bodyHtml?.replace(/<[^>]+>/g, "") || "";

  // Get the fund's full data
  let fundDetail = "";
  if (run.selected_fund_metric_id) {
    const { data: fund } = await supabase
      .from("fund_metrics")
      .select("*")
      .eq("id", run.selected_fund_metric_id)
      .single();

    if (fund) {
      const irr = fund.irr_net_bps ? (fund.irr_net_bps / 100).toFixed(1) + "%" : "n/a";
      const irrGross = fund.irr_gross_bps ? (fund.irr_gross_bps / 100).toFixed(1) + "%" : "n/a";
      const tvpi = fund.tvpi_x100 ? (fund.tvpi_x100 / 100).toFixed(2) + "x" : "n/a";
      const dpi = fund.dpi_x100 ? (fund.dpi_x100 / 100).toFixed(2) + "x" : "n/a";
      const moic = fund.moic_x100 ? (fund.moic_x100 / 100).toFixed(2) + "x" : "n/a";
      const size = fund.fund_size_usd ? "$" + (fund.fund_size_usd / 1e6).toFixed(0) + "M" : "n/a";
      const mgmt = fund.mgmt_fee_bps ? (fund.mgmt_fee_bps / 100).toFixed(2) + "%" : "n/a";
      const carry = fund.carry_bps ? (fund.carry_bps / 100).toFixed(1) + "%" : "n/a";
      const hurdle = fund.hurdle_bps ? (fund.hurdle_bps / 100).toFixed(1) + "%" : "n/a";

      fundDetail = `\nFUND DETAILS:
Name: ${fund.fund_name} | GP: ${fund.gp_name}
Strategy: ${fund.strategy} | Vintage: ${fund.vintage_year}
Fund Size: ${size} | Net IRR: ${irr} | Gross IRR: ${irrGross}
TVPI: ${tvpi} | DPI: ${dpi} | MOIC: ${moic}
Mgmt Fee: ${mgmt} | Carry: ${carry} | Hurdle: ${hurdle}`;
    }
  }

  // Include research context if available
  let researchContext = "";
  if (run.research_output) {
    const research = typeof run.research_output === "string" ? run.research_output : JSON.stringify(run.research_output);
    researchContext = `\nRESEARCH NOTES:\n${research.slice(0, 1500)}`;
  }

  return `\n=== CURRENTLY VIEWING ARTICLE ===
Subject: ${content.subject || "Unknown"}
Week of: ${run.week_of}
${fundDetail}

FULL ARTICLE TEXT:
${plain.slice(0, 3000)}
${researchContext}
=== END ARTICLE ===`;
}

async function identifyArticleFromContext(pageText: string, pageTitle: string): Promise<string> {
  // Try to match fund names or article subjects from page text against DB
  if (!pageText && !pageTitle) return "";

  const supabase = getSupabase();

  // Extract potential fund names from page text
  const combinedText = `${pageTitle} ${pageText}`.slice(0, 500);

  // Get all approved runs and try to match
  const { data: runs } = await supabase
    .from("newsletter_pipeline_runs")
    .select("id, week_of, content_output, selected_fund_metric_id")
    .in("status", ["approved", "sent"])
    .order("week_of", { ascending: false })
    .limit(20);

  if (!runs?.length) return "";

  // Check each run's subject/fund name against visible page text
  const matches: string[] = [];
  for (const run of runs) {
    const content = run.content_output || {};
    const subject = content.subject || "";
    const fundName = subject.replace(/^Weekly Alpha:\s*/i, "").trim();

    if (fundName && combinedText.toLowerCase().includes(fundName.toLowerCase())) {
      const plain = content.plainText || content.bodyHtml?.replace(/<[^>]+>/g, "") || "";
      matches.push(`MATCHED ARTICLE: "${subject}" (Week of ${run.week_of})\n${plain.slice(0, 1500)}`);
    }
  }

  if (matches.length) {
    return `\n=== ARTICLES DETECTED ON PAGE ===\n${matches.join("\n\n---\n\n")}\n=== END DETECTED ARTICLES ===`;
  }

  return "";
}

export async function POST(req: Request) {
  const { messages, currentPath, pageTitle, pageText, capturedRegionContext } = (await req.json()) as {
    messages: ChatMessage[];
    currentPath?: string;
    pageTitle?: string;
    pageText?: string;
    capturedRegionContext?: string;
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fetch context in parallel — article-specific if on issue page, otherwise try to match from page content
  const [newsletterContext, fundContext, activeArticle, detectedArticle] = await Promise.all([
    getNewsletterContext(),
    getFundContext(),
    currentPath ? getActiveArticle(currentPath) : Promise.resolve(""),
    pageText || pageTitle ? identifyArticleFromContext(pageText || "", pageTitle || "") : Promise.resolve(""),
  ]);

  const articleContext = activeArticle || detectedArticle;
  const locationContext = currentPath === "/" ? "the homepage (list of all issues)"
    : currentPath?.startsWith("/issue/") ? "a specific newsletter article page"
    : currentPath || "unknown page";

  const systemInstruction = `You are Alpha — the AI research assistant for Weekly Alpha, a private fund intelligence platform trusted by LPs, allocators, and fund managers.

You have deep expertise in private markets: PE, VC, real estate, credit, infrastructure, secondaries, and fund-of-funds. You speak with authority but remain accessible — think Bloomberg Terminal meets a sharp analyst briefing.

CURRENT CONTEXT:
- The user is viewing: ${locationContext} (${currentPath || "/"})
- Page title: ${pageTitle || "n/a"}
${capturedRegionContext ? `\n=== CAPTURED REGION (the EXACT elements inside the user's screenshot selection) ===\n${capturedRegionContext}\n=== END CAPTURED REGION ===\nIMPORTANT: The captured region tells you EXACTLY which article, fund, or section the user selected. Use this to identify the specific content they're asking about.\n` : ""}
${pageText ? `- Visible page elements:\n${pageText.slice(0, 1000)}` : ""}
${articleContext}

YOUR KNOWLEDGE BASE:

PUBLISHED NEWSLETTERS:
${newsletterContext}

FUND DATABASE (${fundContext ? "recent entries" : "empty"}):
${fundContext || "No fund data available."}

BEHAVIOR:
- You know EXACTLY which page and article the user is looking at. Use this context to give precise, specific answers.
- When the user captures a screenshot or asks a question, relate it to the specific article/fund they are currently viewing.
- If you can identify the fund or article from the page context, reference it by name and cite its specific metrics.
- When shown a screenshot, analyze what's visible and relate it to the specific article data you have.
- Cite specific fund names, IRRs, TVPIs, and other metrics when relevant.
- If asked about something outside your knowledge, say so clearly — don't fabricate data.
- Keep responses concise and data-driven. Use bullet points for comparisons.
- Format numbers professionally: percentages to 1 decimal, multiples to 2 decimals, sizes in $M or $B.
- You can compare funds, explain metrics, contextualize performance, and provide market commentary.

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

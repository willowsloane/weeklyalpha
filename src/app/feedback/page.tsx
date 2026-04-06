"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const REASONS = [
  "Not relevant to my portfolio",
  "Fund was too niche",
  "Wanted more performance data",
  "Content wasn't compelling",
  "Too long / too much detail",
  "Strategy doesn't interest me",
];

export default function FeedbackPage() {
  const params = useSearchParams();
  const runId = params.get("run") || "";
  const email = params.get("email") || "";
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function submit() {
    const reason = [...selected, custom].filter(Boolean).join("; ");
    await fetch("/api/newsletter/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pipelineRunId: runId,
        feedbackType: "thumbs_down",
        email: email || undefined,
        reason,
      }),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-5xl mb-4">&#128591;</div>
          <h1 className="text-2xl font-semibold text-white mb-2">Got it. Thanks!</h1>
          <p className="text-[#8a8f98]">
            We&apos;ll take this into account for next week&apos;s pick.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
      <div className="max-w-lg w-full px-6">
        <h1 className="text-2xl font-semibold text-white mb-2">What didn&apos;t work?</h1>
        <p className="text-[#8a8f98] mb-6">
          Pick any that apply, or write your own. This directly influences next week&apos;s newsletter.
        </p>

        <div className="space-y-2 mb-6">
          {REASONS.map((r) => (
            <button
              key={r}
              onClick={() =>
                setSelected((prev) =>
                  prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
                )
              }
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                selected.includes(r)
                  ? "border-[#064E37] bg-[#064E37]/10 text-white"
                  : "border-[#1e1e2e] bg-[#12121a] text-[#8a8f98] hover:border-[#2a2a3e]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Anything else? (optional)"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#1e1e2e] bg-[#12121a] text-white placeholder-[#555] mb-4 resize-none h-24 focus:outline-none focus:border-[#064E37]"
        />

        <button
          onClick={submit}
          disabled={selected.length === 0 && !custom}
          className="w-full py-3 rounded-lg bg-[#064E37] text-white font-medium hover:bg-[#0A7B55] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const MONO = "var(--font-mono), 'IBM Plex Mono', monospace";
const AGENT_API = process.env.NEXT_PUBLIC_AGENT_API_URL || "";

interface ChatMessage {
  role: "user" | "agent";
  text: string;
  timestamp: string;
}

interface AgentLog {
  id: string;
  log_type: string;
  source: string;
  user_id: string | null;
  user_name: string | null;
  message: string | null;
  tool_name: string | null;
  tool_args: any;
  tool_result: string | null;
  duration_ms: number | null;
  created_at: string;
}

interface AgentMemory {
  id: string;
  memory_type: string;
  content: string;
  week_of: string;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const LOG_ICONS: Record<string, string> = {
  conversation: "💬",
  tool_call: "🔧",
  tool_result: "📊",
  error: "🔴",
  pipeline_event: "⚙️",
};

const MEMORY_COLORS: Record<string, { color: string; bg: string }> = {
  decision: { color: "#2563EB", bg: "#EFF6FF" },
  learning: { color: "#059669", bg: "#ECFDF5" },
  team_direction: { color: "#D97706", bg: "#FFFBEB" },
  outcome: { color: "#7C3AED", bg: "#F5F3FF" },
};

export default function AgentDashboard() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [memory, setMemory] = useState<AgentMemory[]>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "activity" | "memory">("chat");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/agent/dashboard");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setMemory(data.memory || []);
      }
    } catch (e) {
      console.error("Failed to load agent data:", e);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: msg, timestamp: new Date().toISOString() }]);
    setChatLoading(true);

    try {
      const history = chatMessages.map((m) => ({ text: m.text, isBot: m.role === "agent" }));
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "agent", text: data.reply || data.error || "No response", timestamp: new Date().toISOString() }]);
      fetchData();
    } catch {
      setChatMessages((prev) => [...prev, { role: "agent", text: "Failed to reach agent.", timestamp: new Date().toISOString() }]);
    }
    setChatLoading(false);
  }

  const tabs = [
    { id: "chat" as const, label: "Chat" },
    { id: "activity" as const, label: "Activity" },
    { id: "memory" as const, label: "Memory" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--white)" }}>
      {/* Top bar */}
      <div className="py-3" style={{ background: "var(--green-deep)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[14px] font-semibold" style={{ color: "#fff" }}>Weekly Alpha Admin</span>
            <a href="/admin/docs" className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Docs</a>
            <a href="/admin/pipeline" className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>Pipeline</a>
            <a href="/admin/agent" className="text-[13px] font-semibold" style={{ color: "#fff" }}>Agent</a>
          </div>
          <a href="/" className="text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>&larr; Back to site</a>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold" style={{ color: "var(--green-deep)" }}>Newsletter Agent</h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--text-muted)" }}>
            Private command center. Chat with the agent, monitor activity, and review its memory. Nothing here is visible in Slack.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6" style={{ borderBottom: "1px solid var(--border)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2.5 text-[13px] font-medium transition-colors"
              style={{
                borderBottom: activeTab === tab.id ? "2px solid var(--green-deep)" : "2px solid transparent",
                color: activeTab === tab.id ? "var(--green-deep)" : "var(--text-muted)",
              }}
            >
              {tab.label}
              {tab.id === "activity" && logs.length > 0 && (
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--off-white)", color: "var(--text-muted)" }}>
                  {logs.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", height: 560 }}>
            <div className="flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: "var(--off-white)" }}>
                {chatMessages.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-[40px] mb-3">🤖</div>
                    <p className="text-[15px] font-medium" style={{ color: "var(--green-deep)" }}>Weekly Alpha Agent</p>
                    <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
                      Ask anything — status, audits, fund pool, feedback, or give it instructions.
                      <br />Responses stay here. Not posted to Slack.
                    </p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[80%] px-4 py-3 rounded-xl text-[13px] leading-relaxed"
                      style={{
                        background: msg.role === "user" ? "var(--green-deep)" : "#fff",
                        color: msg.role === "user" ? "#fff" : "var(--text-primary)",
                        border: msg.role === "agent" ? "1px solid var(--border)" : "none",
                      }}
                    >
                      <pre className="whitespace-pre-wrap font-sans m-0">{msg.text}</pre>
                      <div className="text-[10px] mt-1" style={{ opacity: 0.5 }}>{timeAgo(msg.timestamp)}</div>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-xl" style={{ background: "#fff", border: "1px solid var(--border)" }}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--green-deep)", animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--green-deep)", animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--green-deep)", animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4" style={{ background: "#fff", borderTop: "1px solid var(--border)" }}>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder="Ask the agent anything..."
                    className="flex-1 px-4 py-2.5 rounded-lg text-[13px] focus:outline-none"
                    style={{ background: "var(--off-white)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  />
                  <button
                    onClick={sendChat}
                    disabled={!chatInput.trim() || chatLoading}
                    className="px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-opacity disabled:opacity-30"
                    style={{ background: "var(--green-deep)" }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="space-y-2">
            {logs.length === 0 && (
              <div className="text-center py-16 text-[13px]" style={{ color: "var(--text-muted)" }}>
                No activity yet. The agent logs every conversation and tool call.
              </div>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--off-white)" }}>
                <span className="text-[16px] shrink-0 mt-0.5">{LOG_ICONS[log.log_type] || "📋"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{timeAgo(log.created_at)}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{
                      background: log.source === "admin" ? "#F5F3FF" : log.source === "slack" ? "#EFF6FF" : "#F5F3EF",
                      color: log.source === "admin" ? "#7C3AED" : log.source === "slack" ? "#2563EB" : "#6B6B6B",
                    }}>
                      {log.source}
                    </span>
                    {log.duration_ms && (
                      <span className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: MONO }}>{log.duration_ms}ms</span>
                    )}
                  </div>
                  {log.tool_name ? (
                    <div className="text-[12px]">
                      <span style={{ fontFamily: MONO, color: "#D97706" }}>{log.tool_name}</span>
                      {log.tool_result && (
                        <span style={{ color: "var(--text-muted)" }}> &rarr; {log.tool_result.slice(0, 120)}{log.tool_result.length > 120 ? "..." : ""}</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-[12px]" style={{ color: "var(--text-primary)" }}>
                      {log.user_id === "agent" && <span style={{ color: "var(--green-deep)", fontWeight: 600 }}>[Agent] </span>}
                      {log.user_name && log.user_id !== "agent" && <span style={{ fontWeight: 600 }}>[{log.user_name}] </span>}
                      {log.message?.slice(0, 200)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Memory Tab */}
        {activeTab === "memory" && (
          <div className="space-y-3">
            {memory.length === 0 && (
              <div className="text-center py-16 text-[13px]" style={{ color: "var(--text-muted)" }}>
                No memories yet. The agent builds memory as it runs the pipeline and learns from feedback.
              </div>
            )}
            {memory.map((m) => {
              const style = MEMORY_COLORS[m.memory_type] || { color: "#6B6B6B", bg: "#F5F3EF" };
              return (
                <div key={m.id} className="p-4 rounded-lg" style={{ background: style.bg }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ color: style.color, background: `${style.color}15` }}>
                      {m.memory_type}
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{m.week_of}</span>
                    <span className="text-[11px] ml-auto" style={{ color: "var(--text-muted)" }}>{timeAgo(m.created_at)}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed m-0" style={{ color: "var(--text-primary)" }}>{m.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

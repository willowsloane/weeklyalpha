"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
}

type ToolkitMode = "idle" | "capturing" | "chatting";

interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// ── Constants ──────────────────────────────────────────────────────────

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO = "var(--font-mono), 'IBM Plex Mono', monospace";

// ── Component ──────────────────────────────────────────────────────────

export default function AlphaToolkit() {
  const [mode, setMode] = useState<ToolkitMode>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selection, setSelection] = useState<SelectionBox | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (mode === "chatting") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [mode]);

  // Keyboard shortcut: Cmd+Shift+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "k") {
        e.preventDefault();
        if (mode === "idle") startCapture();
        else if (mode === "chatting") closeChat();
      }
      if (e.key === "Escape") {
        if (mode === "capturing") setMode("idle");
        else if (mode === "chatting") closeChat();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode]);

  // ── Capture logic ────────────────────────────────────────────────────

  const startCapture = useCallback(() => {
    setMode("capturing");
    setSelection(null);
    setIsSelecting(false);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode !== "capturing") return;
    setIsSelecting(true);
    setSelection({ startX: e.clientX, startY: e.clientY, endX: e.clientX, endY: e.clientY });
  }, [mode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isSelecting || !selection) return;
    setSelection((prev) => prev ? { ...prev, endX: e.clientX, endY: e.clientY } : null);
  }, [isSelecting, selection]);

  const handleMouseUp = useCallback(async () => {
    if (!isSelecting || !selection) return;
    setIsSelecting(false);

    const x = Math.min(selection.startX, selection.endX);
    const y = Math.min(selection.startY, selection.endY);
    const w = Math.abs(selection.endX - selection.startX);
    const h = Math.abs(selection.endY - selection.startY);

    if (w < 20 || h < 20) {
      setMode("idle");
      return;
    }

    // Hide overlay before capture
    setMode("idle");

    // Small delay to let overlay unmount
    await new Promise((r) => setTimeout(r, 80));

    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(document.body, {
        x: x + window.scrollX,
        y: y + window.scrollY,
        width: w,
        height: h,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");
      setScreenshot(dataUrl);
      setMode("chatting");
    } catch {
      setMode("chatting");
    }
  }, [isSelecting, selection]);

  // ── Chat logic ───────────────────────────────────────────────────────

  const closeChat = useCallback(() => {
    setMode("idle");
    setMessages([]);
    setScreenshot(null);
    setInput("");
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text && !screenshot) return;
    if (isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text || "Analyze this screenshot.",
      image: screenshot ? screenshot.split(",")[1] : undefined,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    // Clear screenshot after first use
    if (screenshot) setScreenshot(null);

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/toolkit/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
            image: m.image,
          })),
          currentPath: window.location.pathname,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: `Error: ${err.error || res.statusText}` } : m
          )
        );
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const text = accumulated;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: text } : m))
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: "Connection error. Please try again." } : m
        )
      );
    }

    setIsStreaming(false);
  }, [input, messages, screenshot, isStreaming]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  // ── Selection rectangle ──────────────────────────────────────────────

  const selRect = selection
    ? {
        left: Math.min(selection.startX, selection.endX),
        top: Math.min(selection.startY, selection.endY),
        width: Math.abs(selection.endX - selection.startX),
        height: Math.abs(selection.endY - selection.startY),
      }
    : null;

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Floating Trigger ── */}
      <AnimatePresence>
        {mode === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 right-6 z-[9998]"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute -top-10 right-0 whitespace-nowrap"
                >
                  <div
                    className="px-3 py-1.5 rounded-md text-[11px] font-medium tracking-wide"
                    style={{
                      background: "#0A1628",
                      color: "#D4AF5C",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    Ask Alpha
                    <span className="ml-2 opacity-50" style={{ fontFamily: MONO }}>
                      ⌘⇧K
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main button */}
            <button
              onClick={startCapture}
              className="group relative flex items-center gap-2 h-[48px] rounded-full transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #0D1B2A, #132238)",
                border: "1px solid rgba(201, 165, 78, 0.4)",
                padding: "0 20px",
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(201,165,78,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Alpha mark */}
              <span
                className="text-[22px] font-bold transition-transform duration-300 group-hover:scale-110"
                style={{ fontFamily: "Georgia, serif", color: "#D4AF5C" }}
              >
                α
              </span>
              <span
                className="text-[13px] font-semibold tracking-wide"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                Capture
              </span>
              {/* Pulse ring */}
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-[0.08]"
                style={{ border: "2px solid #D4AF5C" }}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Capture Overlay ── */}
      <AnimatePresence>
        {mode === "capturing" && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9999]"
            style={{ cursor: "crosshair" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Dark overlay with cutout */}
            <div className="absolute inset-0" style={{ background: "rgba(10, 22, 40, 0.4)" }} />

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3"
            >
              <div
                className="px-5 py-2.5 rounded-full text-[13px] font-medium flex items-center gap-2.5"
                style={{
                  background: "rgba(10, 22, 40, 0.9)",
                  border: "1px solid rgba(201, 165, 78, 0.5)",
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span style={{ color: "#D4AF5C", fontFamily: "Georgia, serif", fontSize: 16 }}>
                  α
                </span>
                Drag to capture an area
                <span className="opacity-40 ml-1">ESC to cancel</span>
              </div>
            </motion.div>

            {/* Selection rectangle */}
            {selRect && selRect.width > 5 && selRect.height > 5 && (
              <>
                {/* Clear area (cutout effect via clip-path on the dark overlay won't work easily,
                    so we draw a bright border around the selection) */}
                <div
                  className="absolute"
                  style={{
                    left: selRect.left,
                    top: selRect.top,
                    width: selRect.width,
                    height: selRect.height,
                    border: "2px solid #D4AF5C",
                    boxShadow:
                      "0 0 0 9999px rgba(10, 22, 40, 0.35), inset 0 0 0 1px rgba(212, 175, 92, 0.3)",
                    background: "rgba(212, 175, 92, 0.04)",
                    borderRadius: 3,
                    pointerEvents: "none",
                  }}
                />
                {/* Dimensions badge */}
                <div
                  className="absolute text-[11px] font-medium px-2 py-1 rounded"
                  style={{
                    left: selRect.left,
                    top: selRect.top + selRect.height + 8,
                    background: "rgba(10, 22, 40, 0.9)",
                    color: "#D4AF5C",
                    fontFamily: MONO,
                  }}
                >
                  {Math.round(selRect.width)} × {Math.round(selRect.height)}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {mode === "chatting" && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998]"
              style={{ background: "rgba(0,0,0,0.15)" }}
              onClick={closeChat}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed top-4 right-4 bottom-4 z-[9999] flex flex-col"
              style={{
                width: 440,
                maxWidth: "calc(100vw - 32px)",
                background: "#FAFAF8",
                borderRadius: 12,
                border: "1px solid #E8E5E0",
                boxShadow:
                  "0 24px 80px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 h-[56px] shrink-0"
                style={{ borderBottom: "1px solid #E8E5E0", background: "#fff" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #0D1B2A, #132238)",
                      border: "1px solid rgba(201,165,78,0.4)",
                    }}
                  >
                    <span
                      style={{ fontFamily: "Georgia, serif", color: "#D4AF5C", fontSize: 16, fontWeight: 700 }}
                    >
                      α
                    </span>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: "#1A1714" }}>
                      Alpha
                    </p>
                    <p className="text-[11px]" style={{ color: "#7A7672", fontFamily: MONO }}>
                      Private Markets Intelligence
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {/* New capture button */}
                  <button
                    onClick={() => {
                      setMode("capturing");
                      setSelection(null);
                    }}
                    className="p-2 rounded-md transition-colors hover:bg-[#F0EDE8]"
                    title="New capture"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#7A7672" strokeWidth="1.5">
                      <rect x="3" y="3" width="10" height="10" rx="1.5" strokeDasharray="3 2" />
                      <path d="M1 4V2.5A1.5 1.5 0 0 1 2.5 1H4" />
                      <path d="M12 1h1.5A1.5 1.5 0 0 1 15 2.5V4" />
                      <path d="M15 12v1.5a1.5 1.5 0 0 1-1.5 1.5H12" />
                      <path d="M4 15H2.5A1.5 1.5 0 0 1 1 13.5V12" />
                    </svg>
                  </button>
                  {/* Close */}
                  <button
                    onClick={closeChat}
                    className="p-2 rounded-md transition-colors hover:bg-[#F0EDE8]"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#7A7672" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M1 1l12 12M13 1L1 13" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollBehavior: "smooth" }}>
                {messages.length === 0 && !screenshot && (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: "linear-gradient(135deg, #0D1B2A, #132238)",
                        border: "1px solid rgba(201,165,78,0.3)",
                      }}
                    >
                      <span style={{ fontFamily: "Georgia, serif", color: "#D4AF5C", fontSize: 28, fontWeight: 700 }}>
                        α
                      </span>
                    </div>
                    <p className="text-[16px] font-semibold mb-1" style={{ color: "#1A1714", fontFamily: SERIF }}>
                      Ask Alpha anything
                    </p>
                    <p className="text-[13px] leading-relaxed" style={{ color: "#7A7672" }}>
                      Capture a region of the page or ask directly about funds, performance, and market intelligence.
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-2 w-full max-w-[280px]">
                      {[
                        "Compare top buyout funds by IRR",
                        "What drove this week's feature pick?",
                        "Explain the IRS scoring formula",
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setInput(q);
                            setTimeout(() => inputRef.current?.focus(), 50);
                          }}
                          className="text-left text-[12px] px-3 py-2 rounded-lg transition-colors"
                          style={{
                            color: "#4A7744",
                            background: "rgba(0,138,55,0.04)",
                            border: "1px solid rgba(0,138,55,0.1)",
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Screenshot preview (before first message) */}
                {screenshot && messages.length === 0 && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "#7A7672" }}>
                      Captured region
                    </p>
                    <div
                      className="rounded-lg overflow-hidden"
                      style={{
                        border: "1px solid #E8E5E0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                    >
                      <img
                        src={screenshot}
                        alt="Captured area"
                        className="w-full"
                        style={{ maxHeight: 200, objectFit: "cover", objectPosition: "top" }}
                      />
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="space-y-2 max-w-[85%]">
                          {msg.image && (
                            <div
                              className="rounded-lg overflow-hidden"
                              style={{ border: "1px solid #E8E5E0", maxWidth: 200 }}
                            >
                              <img
                                src={`data:image/png;base64,${msg.image}`}
                                alt="Capture"
                                className="w-full"
                                style={{ maxHeight: 120, objectFit: "cover", objectPosition: "top" }}
                              />
                            </div>
                          )}
                          <div
                            className="px-4 py-2.5 rounded-xl text-[14px] leading-relaxed"
                            style={{
                              background: "#0A1628",
                              color: "#fff",
                              borderBottomRightRadius: 4,
                            }}
                          >
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2.5">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            background: "linear-gradient(135deg, #0D1B2A, #132238)",
                            border: "1px solid rgba(201,165,78,0.3)",
                          }}
                        >
                          <span style={{ fontFamily: "Georgia, serif", color: "#D4AF5C", fontSize: 12, fontWeight: 700 }}>
                            α
                          </span>
                        </div>
                        <div
                          className="flex-1 text-[14px] leading-[1.7] min-w-0"
                          style={{ color: "#2D2A26" }}
                        >
                          {msg.content ? (
                            <div className="space-y-2">
                              {msg.content.split("\n").map((line, i) => {
                                if (line.startsWith("- ") || line.startsWith("• ")) {
                                  return (
                                    <div key={i} className="flex gap-2 pl-1">
                                      <span className="shrink-0" style={{ color: "#D4AF5C" }}>•</span>
                                      <span>{renderInlineFormatting(line.slice(2))}</span>
                                    </div>
                                  );
                                }
                                if (line.startsWith("**") && line.endsWith("**")) {
                                  return (
                                    <p key={i} className="font-semibold mt-2" style={{ color: "#1A1714" }}>
                                      {line.replace(/\*\*/g, "")}
                                    </p>
                                  );
                                }
                                if (line.trim() === "") return <div key={i} className="h-1" />;
                                return <p key={i}>{renderInlineFormatting(line)}</p>;
                              })}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 py-1">
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#D4AF5C" }} />
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#D4AF5C", animationDelay: "0.2s" }} />
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#D4AF5C", animationDelay: "0.4s" }} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input area */}
              <div className="shrink-0 px-4 pb-4 pt-2" style={{ borderTop: "1px solid #E8E5E0" }}>
                <div
                  className="flex items-end gap-2 rounded-xl px-4 py-3"
                  style={{
                    background: "#fff",
                    border: "1px solid #E8E5E0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={screenshot ? "Ask about this capture..." : "Ask Alpha anything..."}
                    rows={1}
                    className="flex-1 resize-none text-[14px] leading-relaxed bg-transparent outline-none placeholder:text-[#B5B1AD]"
                    style={{ color: "#1A1714", maxHeight: 120 }}
                    onInput={(e) => {
                      const el = e.currentTarget;
                      el.style.height = "auto";
                      el.style.height = Math.min(el.scrollHeight, 120) + "px";
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isStreaming || (!input.trim() && !screenshot)}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                    style={{
                      background: isStreaming ? "#E8E5E0" : "#0A1628",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M1 7h12M8 2l5 5-5 5"
                        stroke={isStreaming ? "#7A7672" : "#D4AF5C"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-[10px] text-center mt-2" style={{ color: "#B5B1AD" }}>
                  Alpha has access to published newsletters and fund data
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────

function renderInlineFormatting(text: string): React.ReactNode {
  // Handle **bold** and `code` inline
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "#1A1714" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded text-[12px]"
          style={{
            background: "#F0EDE8",
            color: "#064E37",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

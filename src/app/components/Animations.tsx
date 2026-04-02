"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerCards({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChild({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedTitle({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <motion.span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 30, rotateX: 40 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {target.toLocaleString()}{suffix}
        </motion.span>
      ) : (
        "0"
      )}
    </motion.span>
  );
}

export function BackgroundLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal flowing lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="var(--green-accent)" stopOpacity="0.15" />
            <stop offset="70%" stopColor="var(--green-accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="line-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="var(--border)" stopOpacity="0.4" />
            <stop offset="60%" stopColor="var(--border)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {/* Curved flowing lines */}
        <motion.path
          d="M-100,120 C200,80 400,160 600,100 S900,140 1100,90 S1400,130 1600,100"
          fill="none"
          stroke="url(#line-grad-1)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M-100,220 C300,180 500,260 700,200 S1000,240 1200,190 S1500,230 1700,200"
          fill="none"
          stroke="url(#line-grad-2)"
          strokeWidth="0.75"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.path
          d="M-100,340 C250,300 450,380 650,320 S950,360 1150,310 S1450,350 1650,320"
          fill="none"
          stroke="url(#line-grad-1)"
          strokeWidth="0.75"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.5, ease: "easeInOut", delay: 0.6 }}
        />
        {/* Vertical accent lines */}
        <motion.line
          x1="25%" y1="0" x2="25%" y2="100%"
          stroke="var(--border-light)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.line
          x1="75%" y1="0" x2="75%" y2="100%"
          stroke="var(--border-light)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 1.2 }}
        />
      </svg>

      {/* Radial glow */}
      <motion.div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(178,225,198,0.12) 0%, transparent 70%)" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
    </div>
  );
}

export function BarAnimation({ width, active, delay = 0 }: { width: number; active: boolean; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex-1 h-8 rounded-[4px] overflow-hidden" style={{ background: "var(--off-white)" }}>
      <motion.div
        className="h-full rounded-[4px]"
        initial={{ width: 0 }}
        animate={isInView ? { width: `${width}%` } : { width: 0 }}
        transition={{ duration: 0.8, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: active ? "var(--green-deep)" : "var(--border)" }}
      />
    </div>
  );
}

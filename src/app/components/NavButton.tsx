"use client";

export function NavButton({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="h-12 px-7 rounded text-sm font-semibold tracking-wide transition-all inline-flex items-center"
      style={{ background: "var(--navy)", color: "var(--cream)" }}
      onMouseOver={(e) => (e.currentTarget.style.background = "var(--navy-light)")}
      onMouseOut={(e) => (e.currentTarget.style.background = "var(--navy)")}
    >
      {children}
    </a>
  );
}

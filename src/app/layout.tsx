import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AlphaToolkit from "./components/AlphaToolkit";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Weekly Alpha — Private Fund Intelligence",
  description:
    "One exceptional private fund, analyzed and benchmarked every week. Trusted by LPs, allocators, and fund managers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${ibmMono.variable} h-full`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif" }}>
        {children}
        <AlphaToolkit />
      </body>
    </html>
  );
}

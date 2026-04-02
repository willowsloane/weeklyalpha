import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weekly Alpha — Curated Private Fund Intelligence",
  description:
    "One exceptional private fund, broken down every week. Real performance data, institutional analysis, delivered to LPs and GPs.",
  openGraph: {
    title: "Weekly Alpha — Curated Private Fund Intelligence",
    description:
      "One exceptional private fund, broken down every week. Real performance data, institutional analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

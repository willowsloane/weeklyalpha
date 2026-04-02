import { getFeaturedIssues, type FeaturedIssue } from "@/lib/data";
import { HomeClient } from "./components/HomeClient";

export const dynamic = "force-dynamic";
export const revalidate = 300; // revalidate every 5 min

// Placeholder data when pipeline hasn't produced content yet
const PLACEHOLDER_FEATURED: FeaturedIssue = {
  id: "placeholder",
  pipelineRunId: "placeholder",
  weekOf: new Date().toISOString().split("T")[0],
  fundName: "Meridian Ventures Fund III",
  gpName: "Meridian Capital",
  strategy: "venture",
  vintageYear: 2022,
  fundSize: "$180M",
  irrNet: "28.4%",
  tvpi: "1.80x",
  dpi: "0.60x",
  carry: "20%",
  hurdle: "8%",
  subject: "How Meridian's Fund III became the top-performing 2022 vintage vehicle",
  previewText: "With a net IRR of 28.4% and TVPI of 1.8x, Meridian Ventures Fund III has quietly become one of the standout early-stage vehicles of its vintage.",
  bodyHtml: "",
  heroHtml: "",
  plainText: "",
  gradient: "linear-gradient(135deg, #064E37 0%, #0A7B55 40%, #21759B 100%)",
  tagColor: "#059669",
  strategyLabel: "Venture Capital",
  imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop&q=80",
};

const PLACEHOLDER_PAST: FeaturedIssue[] = [
  {
    id: "p1", pipelineRunId: "p1", weekOf: "2026-03-24", fundName: "Summit Partners Growth Equity VI", gpName: "Summit Partners",
    strategy: "growth_equity", vintageYear: 2023, fundSize: "$2.1B", irrNet: "22.1%", tvpi: "1.60x", dpi: "0.40x", carry: "20%", hurdle: "8%",
    subject: "Summit Partners Growth Equity VI", previewText: "Growth equity vehicle targeting $2B+ with a focus on technology-enabled services.",
    bodyHtml: "", heroHtml: "", plainText: "",
    gradient: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 60%, #60A5FA 100%)", tagColor: "#2563EB", strategyLabel: "Growth Equity",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&q=80",
  },
  {
    id: "p2", pipelineRunId: "p2", weekOf: "2026-03-17", fundName: "Foundry Group Next Fund II", gpName: "Foundry Group",
    strategy: "venture", vintageYear: 2024, fundSize: "$750M", irrNet: null, tvpi: null, dpi: null, carry: "25%", hurdle: null,
    subject: "Foundry Group Next Fund II", previewText: "Boulder-based early-stage firm known for thesis-driven investing in infrastructure software.",
    bodyHtml: "", heroHtml: "", plainText: "",
    gradient: "linear-gradient(135deg, #064E37 0%, #059669 60%, #34D399 100%)", tagColor: "#059669", strategyLabel: "Venture Capital",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop&q=80",
  },
  {
    id: "p3", pipelineRunId: "p3", weekOf: "2026-03-10", fundName: "Starwood Opportunity Fund XII", gpName: "Starwood Capital",
    strategy: "real_estate", vintageYear: 2025, fundSize: "$10B", irrNet: null, tvpi: null, dpi: null, carry: "20%", hurdle: "8%",
    subject: "Starwood Opportunity Fund XII", previewText: "Opportunistic real estate fund focused on distressed assets and value-add properties.",
    bodyHtml: "", heroHtml: "", plainText: "",
    gradient: "linear-gradient(135deg, #92400E 0%, #D97706 60%, #FCD34D 100%)", tagColor: "#D97706", strategyLabel: "Real Estate",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=600&fit=crop&q=80",
  },
];

export default async function Home() {
  let issues: FeaturedIssue[] = [];
  try {
    issues = await getFeaturedIssues(10);
  } catch {
    // DB not available, use placeholders
  }

  const featured = issues[0] || PLACEHOLDER_FEATURED;
  const pastIssues = issues.length > 1 ? issues.slice(1, 4) : PLACEHOLDER_PAST;
  const isLive = issues.length > 0;

  return <HomeClient featured={featured} pastIssues={pastIssues} isLive={isLive} />;
}

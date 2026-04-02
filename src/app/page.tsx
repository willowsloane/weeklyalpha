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
  {
    id: "p4", pipelineRunId: "p4", weekOf: "2026-03-03", fundName: "Ares Capital Europe V", gpName: "Ares Management",
    strategy: "private_credit", vintageYear: 2024, fundSize: "$3.5B", irrNet: "14.2%", tvpi: "1.25x", dpi: "0.35x", carry: "20%", hurdle: "6%",
    subject: "Ares Capital Europe V: Direct lending at scale", previewText: "How Ares is navigating rising defaults in European private credit while maintaining top-quartile returns.",
    bodyHtml: "", heroHtml: "", plainText: "",
    gradient: "linear-gradient(135deg, #701A1A 0%, #DC2626 60%, #FCA5A5 100%)", tagColor: "#DC2626", strategyLabel: "Private Credit",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop&q=80",
  },
  {
    id: "p5", pipelineRunId: "p5", weekOf: "2026-02-24", fundName: "Brookfield Infrastructure Fund V", gpName: "Brookfield Asset Management",
    strategy: "infrastructure", vintageYear: 2023, fundSize: "$28B", irrNet: "16.8%", tvpi: "1.35x", dpi: "0.20x", carry: "20%", hurdle: "8%",
    subject: "Brookfield Infrastructure V: The data center play", previewText: "With $28B in commitments, Brookfield's latest infrastructure vehicle is betting heavily on AI-driven power demand.",
    bodyHtml: "", heroHtml: "", plainText: "",
    gradient: "linear-gradient(135deg, #1E3A5F 0%, #0891B2 60%, #67E8F9 100%)", tagColor: "#0891B2", strategyLabel: "Infrastructure",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&q=80",
  },
  {
    id: "p6", pipelineRunId: "p6", weekOf: "2026-02-17", fundName: "Lexington Capital Partners IX", gpName: "Lexington Partners",
    strategy: "secondaries", vintageYear: 2023, fundSize: "$22.7B", irrNet: "19.5%", tvpi: "1.45x", dpi: "0.55x", carry: "20%", hurdle: "8%",
    subject: "Lexington IX: Record secondaries in a record market", previewText: "The largest secondaries fund ever raised is deploying into a $220B market — but bid-ask spreads remain wide.",
    bodyHtml: "", heroHtml: "", plainText: "",
    gradient: "linear-gradient(135deg, #3F3F46 0%, #71717A 60%, #D4D4D8 100%)", tagColor: "#71717A", strategyLabel: "Secondaries",
    imageUrl: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1200&h=600&fit=crop&q=80",
  },
  {
    id: "p7", pipelineRunId: "p7", weekOf: "2026-02-10", fundName: "Blackstone Real Estate Partners X", gpName: "Blackstone",
    strategy: "real_estate", vintageYear: 2024, fundSize: "$30.4B", irrNet: "12.7%", tvpi: "1.18x", dpi: "0.15x", carry: "20%", hurdle: "8%",
    subject: "BREP X: From offices to data centers", previewText: "Blackstone's $30B flagship is pivoting from traditional CRE to AI infrastructure. The early returns suggest the bet is paying off.",
    bodyHtml: "", heroHtml: "", plainText: "",
    gradient: "linear-gradient(135deg, #92400E 0%, #D97706 60%, #FCD34D 100%)", tagColor: "#D97706", strategyLabel: "Real Estate",
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=600&fit=crop&q=80",
  },
  {
    id: "p8", pipelineRunId: "p8", weekOf: "2026-02-03", fundName: "General Atlantic Growth Fund V", gpName: "General Atlantic",
    strategy: "growth_equity", vintageYear: 2022, fundSize: "$7.8B", irrNet: "24.3%", tvpi: "1.55x", dpi: "0.30x", carry: "20%", hurdle: "8%",
    subject: "GA Growth V: Why growth equity's best vintage might be 2022", previewText: "Deployed at compressed valuations, General Atlantic's 2022 vintage is quietly outperforming its 2021 predecessor by 3x on IRR.",
    bodyHtml: "", heroHtml: "", plainText: "",
    gradient: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 60%, #60A5FA 100%)", tagColor: "#2563EB", strategyLabel: "Growth Equity",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&q=80",
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
  const pastIssues = issues.length > 1 ? issues.slice(1, 9) : PLACEHOLDER_PAST;
  const isLive = issues.length > 0;

  return <HomeClient featured={featured} pastIssues={pastIssues} isLive={isLive} />;
}

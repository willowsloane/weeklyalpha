import { getIssueById } from "@/lib/data";
import { notFound } from "next/navigation";
import { IssueClient } from "./IssueClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const issue = await getIssueById(id);
  if (!issue) return { title: "Not Found — Weekly Alpha" };

  const description = issue.irrNet
    ? `${issue.fundName} — ${issue.irrNet} Net IRR${issue.irrPercentile != null ? ` (${issue.irrPercentile}th percentile)` : ""}. ${issue.strategyLabel}${issue.vintageYear ? `, ${issue.vintageYear} vintage` : ""}.`
    : `${issue.fundName} — ${issue.strategyLabel} fund analysis and peer benchmarks.`;

  return {
    title: `${issue.fundName} — Weekly Alpha`,
    description,
    openGraph: {
      title: `${issue.fundName} — Weekly Alpha`,
      description,
      type: "article",
      publishedTime: issue.weekOf,
    },
    twitter: {
      card: "summary_large_image",
      title: `${issue.fundName} — Weekly Alpha`,
      description,
    },
  };
}

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const issue = await getIssueById(id);
  if (!issue) notFound();
  return <IssueClient issue={issue} />;
}

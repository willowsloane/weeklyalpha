import { getIssueById } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IssueClient } from "./IssueClient";

export const dynamic = "force-dynamic";

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const issue = await getIssueById(id);
  if (!issue) notFound();
  return <IssueClient issue={issue} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ResultView } from "@/features/analysis/components/result-view";
import { getAnalysisByShareId } from "@/features/analysis/data/analysis-repository";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await getAnalysisByShareId(id);
    if (!data) return { title: "Result not found" };
    return {
      title: `${data.profile.name}'s skin plan`,
      description: data.result.summary,
    };
  } catch {
    return { title: "Your skin plan" };
  }
}

export default async function ResultsPage({ params }: Params) {
  const { id } = await params;

  let data;
  try {
    data = await getAnalysisByShareId(id);
  } catch {
    // Database unreachable - treat as not found rather than crashing.
    data = null;
  }

  if (!data) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-aura">
      <SiteHeader />
      <main className="flex-1">
        <ResultView data={data} />
      </main>
      <SiteFooter />
    </div>
  );
}

import Link from "next/link";
import { SearchX } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function ResultNotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-aura">
      <SiteHeader />
      <main className="grid flex-1 place-items-center px-6 py-20 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface-2 text-primary">
            <SearchX className="h-6 w-6" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold">
            We could not find that result
          </h1>
          <p className="mt-3 text-muted">
            The link may be incorrect or the analysis may no longer be available.
            You can run a fresh one in about two minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/analyze">
              <Button size="lg">Start a new analysis</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

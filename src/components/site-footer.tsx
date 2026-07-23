import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Logo />
            <p className="max-w-sm text-sm text-muted">
              Personalized skincare analysis and routines. Informational only,
              not a substitute for advice from a qualified dermatologist.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <Link href="/analyze" className="hover:text-foreground">
              New analysis
            </Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-muted">
          © {new Date().getFullYear()} DermaGlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

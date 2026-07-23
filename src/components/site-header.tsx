import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader({ showCta = true }: { showCta?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="DermaGlow home">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {showCta && (
            <Link href="/analyze" className="hidden sm:block">
              <Button size="sm">Start analysis</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

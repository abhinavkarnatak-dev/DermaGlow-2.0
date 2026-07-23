"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-surface/60 text-foreground transition-colors hover:bg-surface-2",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Moon className="h-[1.15rem] w-[1.15rem]" />
        ) : (
          <Sun className="h-[1.15rem] w-[1.15rem]" />
        )
      ) : (
        <span className="h-[1.15rem] w-[1.15rem]" />
      )}
    </button>
  );
}

"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

/** The event Chromium fires when the app meets install criteria (typed locally). */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Renders an "Install" button only when the browser reports the app is
 * installable (fires `beforeinstallprompt`). This requires a secure context
 * (HTTPS or localhost), so it stays hidden on plain-HTTP LAN testing and
 * appears on the deployed site. Hidden once installed / running standalone.
 */
export function InstallButton({ className }: { className?: string }) {
  const [prompt, setPrompt] = React.useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) setHidden(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setPrompt(null);
      setHidden(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (hidden || !prompt) return null;

  const install = async () => {
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setHidden(true);
    setPrompt(null);
  };

  return (
    <button
      type="button"
      onClick={install}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface/60 px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2",
        className,
      )}
    >
      <Download className="h-4 w-4" />
      Install
    </button>
  );
}

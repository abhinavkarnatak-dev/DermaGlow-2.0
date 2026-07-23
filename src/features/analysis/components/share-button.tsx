"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Copy text reliably, including over plain HTTP on a LAN, where
 * navigator.clipboard is unavailable (non-secure context). Falls back to a
 * hidden textarea + execCommand.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function ShareButton({ title }: { title: string }) {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const openModal = () => {
    setUrl(typeof window !== "undefined" ? window.location.href : "");
    setCopied(false);
    setOpen(true);
  };

  const close = React.useCallback(() => setOpen(false), []);

  const onCopy = async () => {
    const ok = await copyText(url);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2000);
    inputRef.current?.select();
  };

  // Lock scroll and support Escape while the modal is open.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    // Preselect the link for quick manual copy.
    const t = setTimeout(() => inputRef.current?.select(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, close]);

  return (
    <>
      <Button variant="outline" size="sm" onClick={openModal}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center p-5">
            <motion.div
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={close}
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Share your results"
              className="relative w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-lift sm:p-7"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <Share2 className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    Share your results
                  </h2>
                  <p className="text-sm text-muted">
                    Anyone with this link can view your plan.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border-strong bg-surface-2 p-1.5">
                <input
                  ref={inputRef}
                  readOnly
                  value={url}
                  onFocus={(e) => e.currentTarget.select()}
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none"
                />
                <Button size="sm" onClick={onCopy} className="shrink-0">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

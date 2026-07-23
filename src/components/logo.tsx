import { cn } from "@/lib/utils";

/** Compact brand mark: a soft "dewdrop" glyph plus the wordmark. */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M12 3.2c3.4 3.8 5.6 6.8 5.6 9.8a5.6 5.6 0 1 1-11.2 0c0-3 2.2-6 5.6-9.8Z"
            fill="currentColor"
            opacity="0.92"
          />
          <circle cx="9.7" cy="13.4" r="1.5" fill="var(--primary)" opacity="0.5" />
        </svg>
      </span>
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          DermaGlow
        </span>
      )}
    </span>
  );
}

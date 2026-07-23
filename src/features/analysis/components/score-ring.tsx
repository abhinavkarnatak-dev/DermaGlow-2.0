"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";

/**
 * Animated circular score with a count-up number. Reveals when scrolled into
 * view. Purely presentational.
 */
export function ScoreRing({
  value,
  label,
  caption,
  color,
  icon,
  delay = 0,
}: {
  value: number;
  label: string;
  caption: string;
  color: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = React.useState(0);

  const size = 132;
  const stroke = 11;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  React.useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const duration = 1100;
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, delay]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center rounded-3xl border border-border bg-surface p-6 text-center shadow-soft"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={inView ? { strokeDashoffset: c * (1 - value / 100) } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ color }}>{icon}</span>
          <span className="font-display text-3xl font-semibold leading-none">
            {display}
          </span>
          <span className="text-[0.7rem] text-muted">/ 100</span>
        </div>
      </div>
      <p className="mt-4 font-semibold">{label}</p>
      <p className="mt-1 text-xs text-muted">{caption}</p>
    </div>
  );
}

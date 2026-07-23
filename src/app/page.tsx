import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Flame,
  ListChecks,
  MapPin,
  ScanFace,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";

const steps = [
  {
    icon: ScanFace,
    title: "Share your skin",
    body: "Tell us your skin type, concerns, and goals. Add a selfie if you like, it stays on your device and is never stored.",
  },
  {
    icon: Sparkles,
    title: "Get analyzed",
    body: "Our dermatology-trained AI reads your profile and, if provided, your photo to gauge hydration, oiliness, and texture.",
  },
  {
    icon: ListChecks,
    title: "Follow your plan",
    body: "Receive a morning and evening routine plus products that are actually sold where you live.",
  },
];

const features = [
  {
    icon: Droplets,
    title: "Hydration and oiliness scores",
    body: "A clear read on your skin's moisture and oil balance, so you know where to focus.",
  },
  {
    icon: Sun,
    title: "AM and PM routines",
    body: "Step-by-step morning and evening routines built around your concerns.",
  },
  {
    icon: MapPin,
    title: "Region-aware products",
    body: "Recommendations limited to brands genuinely available in your country, with honest notes on reviews.",
  },
  {
    icon: Share2,
    title: "Shareable results",
    body: "Every analysis gets a private link you can revisit or send to a friend.",
  },
  {
    icon: ShieldCheck,
    title: "No account, no tracking",
    body: "Skip the sign-up. Your photo is processed in your browser and never saved.",
  },
  {
    icon: Smartphone,
    title: "Installable app",
    body: "Add DermaGlow to your home screen and open it like any native app.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-aura">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-muted">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Skincare, personalized by AI
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-6 font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Understand your skin.
                  <br />
                  <span className="text-glow-gradient">Then glow.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
                  A calm, considered skin analysis in a couple of minutes. Get
                  your hydration and oiliness scores, a routine for morning and
                  night, and products that actually exist where you live.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/analyze">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start my analysis
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <span className="text-sm text-muted">
                    Free. No login. Takes ~2 minutes.
                  </span>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.2} y={28}>
              <HeroPreview />
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <p className="text-sm font-medium tracking-wide text-accent uppercase">
              How it works
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
              Three steps to a routine that fits you
            </h2>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <RevealItem
                key={s.title}
                className="rounded-3xl border border-border bg-surface p-7 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-surface-2 text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-2xl text-border-strong">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                  {s.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* Features */}
        <section className="border-y border-border/70 bg-surface/40">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <Reveal>
              <h2 className="max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
                Everything you get, nothing you do not need
              </h2>
            </Reveal>
            <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <RevealItem
                  key={f.title}
                  className="rounded-3xl border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {f.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-primary px-8 py-14 text-center shadow-lift sm:px-14 sm:py-20">
              <div className="pointer-events-none absolute inset-0 bg-aura opacity-40" />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold text-primary-foreground sm:text-4xl">
                  Your best skin starts with understanding it
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                  No sign-up, no clutter. Just a thoughtful plan tailored to your
                  skin and where you live.
                </p>
                <div className="mt-8 flex justify-center">
                  <Link href="/analyze">
                    <Button
                      size="lg"
                      variant="soft"
                      className="bg-surface text-foreground hover:brightness-95"
                    >
                      Start my analysis
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Decorative product preview shown in the hero. */
function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-aura blur-2xl" />
      <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted uppercase">
              Your skin profile
            </p>
            <p className="mt-1 font-display text-xl font-semibold">
              Combination, balanced
            </p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-accent">
            <Sparkles className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <PreviewStat
            icon={<Droplets className="h-4 w-4" />}
            label="Hydration"
            value={74}
            tone="var(--good)"
          />
          <PreviewStat
            icon={<Flame className="h-4 w-4" />}
            label="Oiliness"
            value={58}
            tone="var(--warn)"
          />
        </div>

        <div className="mt-4 space-y-2.5 rounded-2xl bg-surface-2 p-4">
          {["Gentle gel cleanser", "Niacinamide serum", "SPF 50 fluid"].map(
            (step, i) => (
              <div key={step} className="flex items-center gap-3 text-sm">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[0.7rem] font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{step}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-4">
      <div className="flex items-center gap-2 text-muted">
        <span style={{ color: tone }}>{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: tone }}
        />
      </div>
    </div>
  );
}

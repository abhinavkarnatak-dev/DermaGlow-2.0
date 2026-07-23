"use client";

import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Flame,
  Info,
  Lightbulb,
  MapPin,
  Moon,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { ScoreRing } from "./score-ring";
import { ShareButton } from "./share-button";
import {
  COUNTRIES,
  labelFor,
  SKIN_TYPES,
} from "../domain/options";
import type { StoredAnalysis } from "../domain/types";

function scoreCaption(value: number, kind: "hydration" | "oiliness") {
  const band = value >= 67 ? "high" : value >= 34 ? "balanced" : "low";
  if (kind === "hydration") {
    return band === "high"
      ? "Well hydrated"
      : band === "balanced"
        ? "Moderately hydrated"
        : "Needs more moisture";
  }
  return band === "high"
    ? "Notably oily"
    : band === "balanced"
      ? "Balanced oil levels"
      : "On the drier side";
}

export function ResultView({ data }: { data: StoredAnalysis }) {
  const { profile, result } = data;
  const country = labelFor(COUNTRIES, profile.country);
  const skinType = labelFor(SKIN_TYPES, profile.skinType);

  const routines = [
    {
      key: "morning",
      title: "Morning routine",
      icon: Sun,
      steps: result.morningRoutine.steps,
      tint: "bg-accent-soft text-accent",
    },
    {
      key: "evening",
      title: "Evening routine",
      icon: Moon,
      steps: result.eveningRoutine.steps,
      tint: "bg-surface-2 text-primary",
    },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      {/* Intro */}
      <Reveal>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 py-1">
            {skinType}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 py-1">
            <MapPin className="h-3.5 w-3.5" />
            {country}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 py-1">
            Age {profile.age}
          </span>
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
          {profile.name}, here is your skin plan
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          {result.summary}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <ShareButton title={`${profile.name}'s DermaGlow skin plan`} />
          <Link href="/analyze">
            <Button variant="ghost" size="sm">
              New analysis
            </Button>
          </Link>
        </div>
      </Reveal>

      {/* Scores + snapshot */}
      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr_1.2fr]">
        <ScoreRing
          value={result.hydrationScore}
          label="Hydration"
          caption={scoreCaption(result.hydrationScore, "hydration")}
          color="var(--good)"
          icon={<Droplets className="mb-1 h-5 w-5" />}
        />
        <ScoreRing
          value={result.oilinessScore}
          label="Oiliness"
          caption={scoreCaption(result.oilinessScore, "oiliness")}
          color="var(--warn)"
          icon={<Flame className="mb-1 h-5 w-5" />}
          delay={0.12}
        />
        <Reveal
          delay={0.1}
          className="rounded-3xl border border-border bg-surface p-6 shadow-soft"
        >
          <div className="flex items-center gap-2 text-muted">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold tracking-wide uppercase">
              Skin snapshot
            </span>
          </div>
          <p className="mt-3 text-sm text-muted">Assessed skin type</p>
          <p className="font-display text-2xl font-semibold">
            {result.skinType}
          </p>
          {result.concerns.length > 0 && (
            <>
              <p className="mt-4 text-sm text-muted">Key concerns</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.concerns.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </>
          )}
        </Reveal>
      </div>

      {/* Routines */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {routines.map((routine, ri) => (
          <Reveal
            key={routine.key}
            delay={ri * 0.08}
            className="rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-7"
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid h-10 w-10 place-items-center rounded-2xl ${routine.tint}`}
              >
                <routine.icon className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-semibold">{routine.title}</h2>
            </div>
            <RevealGroup className="mt-5 space-y-4" stagger={0.06}>
              {routine.steps.map((step, i) => (
                <RevealItem
                  key={`${routine.key}-${i}`}
                  className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{step.step}</p>
                    <p className="mt-0.5 text-sm text-foreground/90">
                      {step.product}
                    </p>
                    <p className="mt-1 text-sm text-muted">{step.description}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>
        ))}
      </div>

      {/* Product recommendations */}
      {result.products.length > 0 && (
        <section className="mt-10">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent-soft text-accent">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold">
                  Products available in {country}
                </h2>
                <p className="text-sm text-muted">
                  Picked for your skin and what is actually sold near you.
                </p>
              </div>
            </div>
          </Reveal>

          <RevealGroup className="mt-6 grid gap-5 sm:grid-cols-2">
            {result.products.map((p, i) => (
              <RevealItem
                key={`${p.brand}-${i}`}
                className="flex flex-col rounded-3xl border border-border bg-surface p-6 shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[0.7rem] font-medium tracking-wide text-muted uppercase">
                      {p.category}
                    </span>
                    <h3 className="mt-3 font-semibold leading-snug">{p.name}</h3>
                    <p className="text-sm text-muted">{p.brand}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {p.priceRange}
                  </span>
                </div>
                <p className="mt-4 text-sm text-muted">{p.recommendation}</p>
                <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <p className="flex items-start gap-2 text-muted">
                    <Star className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{p.rating}</span>
                  </p>
                  <p className="flex items-start gap-2 text-muted">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{p.availability}</span>
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* Tips */}
      <section className="mt-10">
        <Reveal className="rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-surface-2 text-primary">
              <Lightbulb className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-semibold">Lifestyle and skincare tips</h2>
          </div>
          <RevealGroup className="mt-6 grid gap-4 sm:grid-cols-2" stagger={0.05}>
            {result.tips.map((tip, i) => (
              <RevealItem key={i} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {tip}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>
      </section>

      {/* Disclaimer + CTA */}
      <Reveal className="mt-8">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-2/60 p-4 text-sm text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            This analysis is AI-generated and for general information only. It is
            not medical advice. Product notes are estimates, not verified reviews.
            For persistent or serious skin concerns, please see a qualified
            dermatologist.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/analyze">
            <Button size="lg">
              Run another analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

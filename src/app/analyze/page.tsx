"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ImagePlus,
  Loader2,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { fileToCompressedDataUrl, ImageError } from "@/lib/image";
import {
  COUNTRIES,
  GENDERS,
  LIMITS,
  SKIN_CONCERNS,
  SKIN_TYPES,
} from "@/features/analysis/domain/options";
import { analysisInputSchema } from "@/features/analysis/domain/types";

type FieldErrors = Partial<Record<string, string>>;

const LOADING_MESSAGES = [
  "Reading your skin profile",
  "Assessing hydration and oil balance",
  "Designing your morning and evening routine",
  "Finding products available in your region",
  "Polishing your tips",
];

export default function AnalyzePage() {
  const router = useRouter();

  const [form, setForm] = React.useState({
    name: "",
    age: "",
    gender: "",
    country: "IN",
    skinType: "",
    goals: "",
  });
  const [concerns, setConcerns] = React.useState<string[]>([]);
  const [imageData, setImageData] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [compressing, setCompressing] = React.useState(false);

  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">(
    "idle",
  );
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [msgIndex, setMsgIndex] = React.useState(0);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleConcern = (value: string) => {
    setConcerns((c) =>
      c.includes(value) ? c.filter((x) => x !== value) : [...c, value],
    );
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImageError(null);
    setCompressing(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setImageData(dataUrl);
    } catch (err) {
      setImageError(
        err instanceof ImageError ? err.message : "Could not use that image.",
      );
    } finally {
      setCompressing(false);
    }
  };

  // Faux progress + rotating status while the request is in flight.
  React.useEffect(() => {
    if (status !== "submitting") return;
    setProgress(8);
    const p = setInterval(() => {
      setProgress((v) => (v >= 92 ? v : v + Math.max(1, (95 - v) * 0.08)));
    }, 320);
    const m = setInterval(
      () => setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length),
      2200,
    );
    return () => {
      clearInterval(p);
      clearInterval(m);
    };
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const candidate = {
      name: form.name,
      age: form.age === "" ? NaN : Number(form.age),
      gender: form.gender,
      country: form.country,
      skinType: form.skinType,
      concerns,
      goals: form.goals,
      imageBase64: imageData,
    };

    const parsed = analysisInputSchema.safeParse(candidate);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setStatus("idle");
      // Nudge to the first error.
      const first = Object.keys(next)[0];
      if (first) {
        document
          .getElementById(first)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setSubmitError(
          json?.error?.message ??
            "We could not complete your analysis. Please try again.",
        );
        setStatus("error");
        return;
      }

      setProgress(100);
      const shareId = json?.shareId as string;
      setTimeout(() => router.push(`/results/${shareId}`), 450);
    } catch {
      setSubmitError(
        "We could not reach the analysis service. Check your connection and try again.",
      );
      setStatus("error");
    }
  };

  const submitting = status === "submitting";

  return (
    <div className="flex min-h-dvh flex-col bg-aura">
      <SiteHeader showCta={false} />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mt-6">
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">
              Your skin analysis
            </h1>
            <p className="mt-3 text-muted">
              A few quick details and we will build your personalized plan. This
              takes about two minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
            {/* About you */}
            <fieldset
              disabled={submitting}
              className="rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-7"
            >
              <legend className="px-1 text-xs font-semibold tracking-wide text-muted uppercase">
                About you
              </legend>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <Field label="Name" htmlFor="name" error={errors.name}>
                  <TextInput
                    id="name"
                    name="name"
                    placeholder="Your name"
                    autoComplete="given-name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </Field>
                <Field label="Age" htmlFor="age" error={errors.age}>
                  <TextInput
                    id="age"
                    name="age"
                    type="number"
                    inputMode="numeric"
                    min={LIMITS.ageMin}
                    max={LIMITS.ageMax}
                    placeholder="e.g. 24"
                    value={form.age}
                    onChange={(e) => set("age", e.target.value)}
                  />
                </Field>
                <Field label="Gender" htmlFor="gender" error={errors.gender}>
                  <Select
                    id="gender"
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    {GENDERS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field
                  label="Country"
                  htmlFor="country"
                  error={errors.country}
                  hint="Used to suggest products sold near you"
                >
                  <Select
                    id="country"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                  >
                    <option value="" disabled>
                      Select country
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </fieldset>

            {/* Your skin */}
            <fieldset
              disabled={submitting}
              className="rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-7"
            >
              <legend className="px-1 text-xs font-semibold tracking-wide text-muted uppercase">
                Your skin
              </legend>
              <div className="mt-4 space-y-5">
                <Field
                  label="Skin type"
                  htmlFor="skinType"
                  error={errors.skinType}
                >
                  <Select
                    id="skinType"
                    value={form.skinType}
                    onChange={(e) => set("skinType", e.target.value)}
                  >
                    <option value="" disabled>
                      Select skin type
                    </option>
                    {SKIN_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field
                  label="Skin concerns"
                  hint="Pick any that apply"
                  error={errors.concerns}
                >
                  <div className="flex flex-wrap gap-2">
                    {SKIN_CONCERNS.map((c) => {
                      const active = concerns.includes(c.value);
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => toggleConcern(c.value)}
                          aria-pressed={active}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                            active
                              ? "border-primary bg-primary text-primary-foreground shadow-soft"
                              : "border-border-strong bg-surface text-muted hover:border-primary/50 hover:text-foreground",
                          )}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field
                  label="Skincare goals"
                  htmlFor="goals"
                  optional
                  error={errors.goals}
                  hint={`${form.goals.length}/${LIMITS.goalsMax}`}
                >
                  <TextArea
                    id="goals"
                    name="goals"
                    maxLength={LIMITS.goalsMax}
                    placeholder="e.g. calmer skin, fewer breakouts, a healthy glow"
                    value={form.goals}
                    onChange={(e) => set("goals", e.target.value)}
                  />
                </Field>
              </div>
            </fieldset>

            {/* Photo */}
            <fieldset
              disabled={submitting}
              className="rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-7"
            >
              <legend className="px-1 text-xs font-semibold tracking-wide text-muted uppercase">
                Selfie
              </legend>
              <div className="mt-4">
                <Field
                  label="Add a photo"
                  optional
                  error={imageError ?? undefined}
                  hint="Processed on your device and never stored. Helps refine the read."
                >
                  {imageData ? (
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageData}
                        alt="Selfie preview"
                        className="h-24 w-24 rounded-2xl border border-border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImageData(null)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3.5 py-2 text-sm text-muted transition-colors hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label
                      className={cn(
                        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-strong bg-surface-2 px-4 py-8 text-center transition-colors hover:border-primary/50",
                        compressing && "pointer-events-none opacity-70",
                      )}
                    >
                      {compressing ? (
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      ) : (
                        <ImagePlus className="h-6 w-6 text-primary" />
                      )}
                      <span className="text-sm font-medium">
                        {compressing ? "Processing image" : "Tap to upload a selfie"}
                      </span>
                      <span className="text-xs text-muted">
                        JPG, PNG or WebP, up to 10 MB
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImage}
                      />
                    </label>
                  )}
                </Field>
              </div>
            </fieldset>

            <AnimatePresence>
              {status === "error" && submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent-soft/50 p-4"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">
                      Analysis did not complete
                    </p>
                    <p className="mt-0.5 text-muted">{submitError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-1">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : status === "error" ? (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    Try again
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Get my analysis
                  </>
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-muted">
                By continuing you understand DermaGlow is informational and not
                medical advice.
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Full-screen analyzing overlay */}
      <AnimatePresence>
        {submitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-6 backdrop-blur-sm"
          >
            <div className="w-full max-w-sm text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lift">
                <Sparkles className="h-6 w-6" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold">
                Reading your skin
              </h2>
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="mt-2 text-sm text-muted"
                >
                  {LOADING_MESSAGES[msgIndex]}
                </motion.p>
              </AnimatePresence>
              <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import "server-only";
import {
  analysisInputSchema,
  type AnalysisInput,
  type AnalysisProfile,
  type AnalysisResult,
} from "../domain/types";
import { saveAnalysis } from "../data/analysis-repository";
import { runGeminiAnalysis } from "./gemini";
import { AnalysisError } from "./errors";

/**
 * Pure application service: validate -> analyze -> persist. It has no knowledge
 * of auth, sessions, or credits. When the SaaS path lands, account and credit
 * checks live in the calling layer (the API route), and this service can be
 * reused unchanged, optionally passing a userId through to persistence.
 */

function toProfile(input: AnalysisInput): AnalysisProfile {
  return {
    name: input.name,
    age: input.age,
    gender: input.gender,
    skinType: input.skinType,
    country: input.country,
    concerns: input.concerns,
    goals: input.goals ?? "",
  };
}

export async function createAnalysis(
  rawInput: unknown,
  opts: { userId?: string | null } = {},
): Promise<{ shareId: string; result: AnalysisResult }> {
  const parsed = analysisInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new AnalysisError("VALIDATION", "The submitted details are invalid", {
      status: 400,
    });
  }
  const input = parsed.data;

  const result = await runGeminiAnalysis(input);

  let shareId: string;
  try {
    shareId = await saveAnalysis({
      profile: toProfile(input),
      result,
      userId: opts.userId ?? null,
    });
  } catch {
    throw new AnalysisError("STORAGE", "Could not save your analysis", {
      status: 503,
      retryable: true,
    });
  }

  return { shareId, result };
}

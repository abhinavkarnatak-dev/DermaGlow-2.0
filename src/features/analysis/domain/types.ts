import { z } from "zod";
import {
  COUNTRY_VALUES,
  GENDER_VALUES,
  LIMITS,
  SKIN_CONCERN_VALUES,
  SKIN_TYPE_VALUES,
} from "./options";

/**
 * Domain schemas. These are the contract between the client form, the API route,
 * and the Gemini service. Everything is validated at the boundary with zod.
 */

const inSet = (set: Set<string>, message: string) =>
  z.string().refine((v) => set.has(v), message);

// ---- Intake ----------------------------------------------------------------

export const analysisInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(LIMITS.nameMin, `Name must be at least ${LIMITS.nameMin} characters`)
    .max(LIMITS.nameMax, `Name must be under ${LIMITS.nameMax} characters`),
  age: z
    .number({ error: "Please enter your age" })
    .int("Age must be a whole number")
    .min(LIMITS.ageMin, `You must be at least ${LIMITS.ageMin}`)
    .max(LIMITS.ageMax, `Please enter a valid age`),
  gender: inSet(GENDER_VALUES, "Please select a gender"),
  skinType: inSet(SKIN_TYPE_VALUES, "Please select a skin type"),
  country: inSet(COUNTRY_VALUES, "Please select your country"),
  concerns: z
    .array(inSet(SKIN_CONCERN_VALUES, "Unknown concern"))
    .max(LIMITS.maxConcerns)
    .default([]),
  goals: z.string().trim().max(LIMITS.goalsMax).optional().default(""),
  // data URL (data:image/...;base64,....) - optional face photo.
  imageBase64: z
    .string()
    .refine((v) => v.startsWith("data:image/"), "Invalid image data")
    .optional()
    .nullable(),
});

export type AnalysisInput = z.infer<typeof analysisInputSchema>;

// ---- Result ----------------------------------------------------------------

export const routineStepSchema = z.object({
  step: z.string().min(1),
  product: z.string().min(1),
  description: z.string().min(1),
});

export const productRecommendationSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  category: z.string().min(1),
  priceRange: z.string().min(1),
  availability: z.string().min(1),
  rating: z.string().min(1),
  recommendation: z.string().min(1),
});

export const analysisResultSchema = z.object({
  summary: z.string().min(1),
  skinType: z.string().min(1),
  concerns: z.array(z.string().min(1)).default([]),
  hydrationScore: z.coerce.number().min(0).max(100),
  oilinessScore: z.coerce.number().min(0).max(100),
  morningRoutine: z.object({ steps: z.array(routineStepSchema).min(1) }),
  eveningRoutine: z.object({ steps: z.array(routineStepSchema).min(1) }),
  products: z.array(productRecommendationSchema).default([]),
  tips: z.array(z.string().min(1)).min(1),
});

export type RoutineStep = z.infer<typeof routineStepSchema>;
export type ProductRecommendation = z.infer<typeof productRecommendationSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;

// Echo of the inputs we keep alongside a stored result (never the photo).
export type AnalysisProfile = {
  name: string;
  age: number;
  gender: string;
  skinType: string;
  country: string;
  concerns: string[];
  goals: string;
};

// What /results/[id] renders.
export type StoredAnalysis = {
  shareId: string;
  profile: AnalysisProfile;
  result: AnalysisResult;
  createdAt: string;
};

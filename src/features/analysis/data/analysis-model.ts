import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * Persisted analysis. Designed so the future SaaS path is an addition, not a
 * rewrite: `userId` is already here (null for the current anonymous flow) so
 * analyses can later be tied to accounts and gated behind credits without a
 * schema migration. We deliberately do NOT store the uploaded face photo.
 */

const routineStep = new Schema(
  {
    step: { type: String, required: true },
    product: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const product = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    priceRange: { type: String, required: true },
    availability: { type: String, required: true },
    rating: { type: String, required: true },
    recommendation: { type: String, required: true },
  },
  { _id: false },
);

const analysisSchema = new Schema(
  {
    shareId: { type: String, required: true, unique: true, index: true },
    // Reserved for the future auth + credits system. Null for anonymous use.
    userId: { type: String, default: null, index: true },
    profile: {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true },
      skinType: { type: String, required: true },
      country: { type: String, required: true },
      concerns: { type: [String], default: [] },
      goals: { type: String, default: "" },
    },
    result: {
      summary: { type: String, required: true },
      skinType: { type: String, required: true },
      concerns: { type: [String], default: [] },
      hydrationScore: { type: Number, required: true },
      oilinessScore: { type: Number, required: true },
      morningRoutine: { steps: { type: [routineStep], required: true } },
      eveningRoutine: { steps: { type: [routineStep], required: true } },
      products: { type: [product], default: [] },
      tips: { type: [String], required: true },
    },
  },
  { timestamps: true },
);

export type AnalysisDoc = InferSchemaType<typeof analysisSchema>;

// Guard against model recompilation during dev hot-reload.
export const AnalysisModel: Model<AnalysisDoc> =
  (mongoose.models.Analysis as Model<AnalysisDoc>) ||
  mongoose.model<AnalysisDoc>("Analysis", analysisSchema);

import "server-only";
import { connectToDatabase } from "@/lib/db";
import { generateShareId } from "@/lib/id";
import { AnalysisModel } from "./analysis-model";
import type {
  AnalysisProfile,
  AnalysisResult,
  StoredAnalysis,
} from "../domain/types";

/**
 * The only place that talks to the database for analyses. Services depend on
 * these functions, not on Mongoose directly, so storage can change without
 * touching business logic.
 */

export async function saveAnalysis(input: {
  profile: AnalysisProfile;
  result: AnalysisResult;
  userId?: string | null;
}): Promise<string> {
  await connectToDatabase();

  // Retry on the (astronomically unlikely) shareId collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const shareId = generateShareId();
    try {
      await AnalysisModel.create({
        shareId,
        userId: input.userId ?? null,
        profile: input.profile,
        result: input.result,
      });
      return shareId;
    } catch (err: unknown) {
      const code = (err as { code?: number })?.code;
      if (code === 11000 && attempt < 4) continue; // duplicate key, retry
      throw err;
    }
  }
  throw new Error("Could not generate a unique share id");
}

export async function getAnalysisByShareId(
  shareId: string,
): Promise<StoredAnalysis | null> {
  await connectToDatabase();

  const raw = await AnalysisModel.findOne({ shareId }).lean().exec();
  if (!raw || !raw.profile || !raw.result) return null;

  const doc = raw as unknown as {
    shareId: string;
    profile: AnalysisProfile;
    result: AnalysisResult;
    createdAt?: Date;
  };

  return {
    shareId: doc.shareId,
    profile: {
      name: doc.profile.name,
      age: doc.profile.age,
      gender: doc.profile.gender,
      skinType: doc.profile.skinType,
      country: doc.profile.country,
      concerns: doc.profile.concerns ?? [],
      goals: doc.profile.goals ?? "",
    },
    result: doc.result,
    createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

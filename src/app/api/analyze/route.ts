import { NextResponse } from "next/server";
import { createAnalysis } from "@/features/analysis/services/analysis-service";
import { AnalysisError } from "@/features/analysis/services/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Allow generous room for the base64 photo payload.
export const maxDuration = 60;

/**
 * The gate layer. Today it is open (no auth). This is exactly where the future
 * SaaS path plugs in: verify the session, decrement credits, then call
 * createAnalysis(input, { userId }). None of the service or Gemini code changes.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "VALIDATION", message: "Invalid request body" } },
      { status: 400 },
    );
  }

  try {
    const { shareId } = await createAnalysis(body);
    return NextResponse.json({ shareId }, { status: 201 });
  } catch (err) {
    if (err instanceof AnalysisError) {
      return NextResponse.json(
        {
          error: {
            code: err.code,
            message: err.message,
            retryable: err.retryable,
          },
        },
        { status: err.status },
      );
    }
    console.error("Unexpected analysis error:", err);
    return NextResponse.json(
      {
        error: {
          code: "UPSTREAM",
          message: "Something went wrong. Please try again.",
          retryable: true,
        },
      },
      { status: 500 },
    );
  }
}

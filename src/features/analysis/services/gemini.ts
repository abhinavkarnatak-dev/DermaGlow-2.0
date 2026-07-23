import "server-only";
import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { serverEnv } from "@/lib/env";
import { analysisResultSchema, type AnalysisInput, type AnalysisResult } from "../domain/types";
import { buildAnalysisPrompt } from "./prompt";
import { AnalysisError } from "./errors";

const REQUEST_TIMEOUT_MS = 45_000;

/** Split a data URL into the mime type and raw base64 payload. */
function parseDataUrl(dataUrl: string): { mimeType: string; data: string } | null {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s.exec(dataUrl);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

/** Pull a JSON object out of a model response, tolerating stray fences or prose. */
function extractJson(text: string): string {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  const candidate = (fenced ? fenced[1] : text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new AnalysisError("BAD_RESPONSE", "No JSON found in model response");
  }
  return candidate.slice(start, end + 1);
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () =>
        reject(
          new AnalysisError("TIMEOUT", "The analysis took too long", {
            status: 504,
            retryable: true,
          }),
        ),
      ms,
    );
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

/** Map an upstream Gemini/network error to a typed, user-appropriate AnalysisError. */
function mapUpstreamError(err: unknown): AnalysisError {
  if (err instanceof AnalysisError) return err;
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (lower.includes("429") || lower.includes("rate") || lower.includes("quota")) {
    return new AnalysisError("RATE_LIMIT", "The service is busy right now", {
      status: 429,
      retryable: true,
    });
  }
  if (lower.includes("api key") || lower.includes("permission") || lower.includes("401") || lower.includes("403")) {
    return new AnalysisError("CONFIG", "The analysis service is misconfigured", {
      status: 500,
      retryable: false,
    });
  }
  return new AnalysisError("UPSTREAM", "The analysis service failed", {
    status: 502,
    retryable: true,
  });
}

async function callModel(input: AnalysisInput): Promise<string> {
  const genAI = new GoogleGenerativeAI(serverEnv.geminiApiKey());
  const model = genAI.getGenerativeModel({
    model: serverEnv.geminiModel(),
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.6,
      maxOutputTokens: 4096,
    },
  });

  const parts: Part[] = [{ text: buildAnalysisPrompt(input) }];

  if (input.imageBase64) {
    const parsed = parseDataUrl(input.imageBase64);
    if (parsed) {
      parts.push({ inlineData: { mimeType: parsed.mimeType, data: parsed.data } });
    }
  }

  try {
    const result = await withTimeout(
      model.generateContent(parts),
      REQUEST_TIMEOUT_MS,
    );
    const text = result.response.text();
    if (!text || !text.trim()) {
      throw new AnalysisError("BAD_RESPONSE", "Empty response from model", {
        retryable: true,
      });
    }
    return text;
  } catch (err) {
    throw mapUpstreamError(err);
  }
}

function parseAndValidate(text: string): AnalysisResult {
  let raw: unknown;
  try {
    raw = JSON.parse(extractJson(text));
  } catch {
    throw new AnalysisError("BAD_RESPONSE", "Model returned invalid JSON", {
      retryable: true,
    });
  }

  const parsed = analysisResultSchema.safeParse(raw);
  if (!parsed.success) {
    throw new AnalysisError("BAD_RESPONSE", "Model response failed validation", {
      retryable: true,
    });
  }

  // Clamp and round scores defensively.
  parsed.data.hydrationScore = Math.round(
    Math.max(0, Math.min(100, parsed.data.hydrationScore)),
  );
  parsed.data.oilinessScore = Math.round(
    Math.max(0, Math.min(100, parsed.data.oilinessScore)),
  );
  return parsed.data;
}

/**
 * Runs the Gemini analysis with one retry if the first response is malformed.
 * Throws a typed AnalysisError on failure - never returns fabricated results.
 */
export async function runGeminiAnalysis(
  input: AnalysisInput,
): Promise<AnalysisResult> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const text = await callModel(input);
      return parseAndValidate(text);
    } catch (err) {
      lastError = err;
      const retryable = err instanceof AnalysisError ? err.retryable : false;
      // Only retry malformed responses, not config/rate-limit errors.
      if (!retryable || (err instanceof AnalysisError && err.code !== "BAD_RESPONSE")) {
        break;
      }
    }
  }

  throw lastError instanceof AnalysisError
    ? lastError
    : new AnalysisError("UPSTREAM", "Analysis failed", { status: 502, retryable: true });
}

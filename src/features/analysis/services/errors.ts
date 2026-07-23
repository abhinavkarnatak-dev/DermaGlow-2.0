/**
 * Typed errors so the API route can map failures to sensible HTTP responses and
 * the UI can show a real retry state instead of a broken screen or fake data.
 */
export type AnalysisErrorCode =
  | "VALIDATION"
  | "RATE_LIMIT"
  | "TIMEOUT"
  | "UPSTREAM"
  | "BAD_RESPONSE"
  | "STORAGE"
  | "CONFIG";

export class AnalysisError extends Error {
  code: AnalysisErrorCode;
  status: number;
  retryable: boolean;

  constructor(
    code: AnalysisErrorCode,
    message: string,
    opts: { status?: number; retryable?: boolean } = {},
  ) {
    super(message);
    this.name = "AnalysisError";
    this.code = code;
    this.status = opts.status ?? 500;
    this.retryable = opts.retryable ?? false;
  }
}

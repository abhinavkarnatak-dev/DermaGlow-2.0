import "server-only";

/**
 * Central, validated access to server-side environment variables.
 * Importing this on the client is a build error (server-only), which guarantees
 * secrets like the Gemini key can never leak into a client bundle.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example.`,
    );
  }
  return value;
}

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

export const serverEnv = {
  geminiApiKey: () => required("GEMINI_API_KEY"),
  geminiModel: () => optional("GEMINI_MODEL", "gemini-3.5-flash-lite"),
  mongoUri: () => required("MONGODB_URI"),
  mongoDb: () => optional("MONGODB_DB", "dermaglow"),
};

// Safe on both client and server (no secrets).
export const publicEnv = {
  appUrl: () =>
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",
};

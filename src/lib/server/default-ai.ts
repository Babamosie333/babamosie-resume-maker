import type { AIConnection } from "../../config/ai-models";
import { ResumeImportError } from "../resume-import-schema";

/**
 * Built-in "default AI" used when a visitor has not configured their own
 * model. The key lives only in the server environment (GROQ_API_KEY) and is
 * never sent to the browser. Optional: GROQ_MODEL.
 */
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

/** Limits that protect the shared key. */
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_CONTENT_CHARS = 12_000;
const MAX_INSTRUCTION_CHARS = 500;

const hits = new Map<string, number[]>();

const readEnv = (name: string): string => {
  const value = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return typeof value === "string" ? value.trim() : "";
};

export interface DefaultAIStatus {
  available: boolean;
  model?: string;
}

export function getDefaultAIStatus(): DefaultAIStatus {
  if (!readEnv("GROQ_API_KEY")) return { available: false };
  return { available: true, model: readEnv("GROQ_MODEL") || DEFAULT_GROQ_MODEL };
}

const clientKey = (request: Request): string =>
  request.headers.get("cf-connecting-ip") ||
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  "unknown";

/** Best-effort in-memory limiter (per server instance). */
function checkRateLimit(request: Request, now = Date.now()) {
  const key = clientKey(request);
  const recent = (hits.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    hits.set(key, recent);
    throw new ResumeImportError("rateLimited", 429);
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    hits.forEach((times, k) => {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    });
  }
}

/**
 * Returns the server-side default connection, or throws a ResumeImportError
 * when it is unavailable, rate limited, or the request is too large.
 */
export function resolveDefaultConnection(
  request: Request,
  body: { content?: unknown; customInstructions?: unknown }
): AIConnection {
  const apiKey = readEnv("GROQ_API_KEY");
  if (!apiKey) throw new ResumeImportError("configRequired", 503);

  const content = typeof body.content === "string" ? body.content : "";
  const instructions =
    typeof body.customInstructions === "string" ? body.customInstructions : "";
  if (content.length > MAX_CONTENT_CHARS || instructions.length > MAX_INSTRUCTION_CHARS) {
    throw new ResumeImportError("requestTooLarge", 413);
  }

  checkRateLimit(request);

  return {
    provider: "openai",
    protocol: "chat-completions",
    apiKey,
    model: readEnv("GROQ_MODEL") || DEFAULT_GROQ_MODEL,
    baseUrl: GROQ_BASE_URL,
  };
}

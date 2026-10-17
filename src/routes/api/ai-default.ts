import { createFileRoute } from "@tanstack/react-router";
import { getDefaultAIStatus } from "@/lib/server/default-ai";

/** Tells the browser whether a built-in default AI is available (never returns the key). */
export const Route = createFileRoute("/api/ai-default")({
  server: {
    handlers: {
      GET: () =>
        Response.json(getDefaultAIStatus(), {
          headers: { "Cache-Control": "no-store" },
        }),
    },
  },
});

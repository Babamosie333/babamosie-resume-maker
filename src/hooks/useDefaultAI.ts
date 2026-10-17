import { useEffect, useState } from "react";

let cached: Promise<boolean> | null = null;

/** Asks the server once whether a built-in default AI is available. */
export function isDefaultAIAvailable(): Promise<boolean> {
  if (!cached) {
    cached = fetch("/api/ai-default", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { available: false }))
      .then((data: { available?: boolean }) => data.available === true)
      .catch(() => {
        cached = null; // allow a retry later
        return false;
      });
  }
  return cached;
}

export function useDefaultAIAvailable(): boolean {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let active = true;
    isDefaultAIAvailable().then((value) => {
      if (active) setAvailable(value);
    });
    return () => {
      active = false;
    };
  }, []);
  return available;
}

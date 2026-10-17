import type { Certificate } from "@/types/resume";
import { generateUUID } from "@/utils/uuid";

/**
 * Keeps only text certificates. Older saved resumes stored certificates as
 * images ({ url, width }); those carry no text, so they are dropped.
 */
export const sanitizeCertificates = (value: unknown): Certificate[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === "object" && typeof (item as any).name === "string"
    )
    .map((item) => ({
      id: typeof item.id === "string" && item.id ? item.id : generateUUID(),
      name: String(item.name ?? ""),
      issuer: typeof item.issuer === "string" ? item.issuer : "",
      date: typeof item.date === "string" ? item.date : "",
    }));
};

/** Formats a certificate as one plain-text line: "Issuer — Name (Date)". */
export const formatCertificateLine = (certificate: Certificate): string => {
  const name = certificate.name.trim();
  if (!name) return "";
  const issuer = certificate.issuer.trim();
  const date = certificate.date.trim();
  const head = issuer ? `${issuer} — ${name}` : name;
  return date ? `${head} (${date})` : head;
};

import test from "node:test";
import assert from "node:assert/strict";
import { computeAtsScore } from "../src/lib/atsScore";
import { initialResumeStateEn, blankResumeStateEn } from "../src/config/initialResumeData";
import { applyBcaOrder } from "../src/config/bcaPreset";
import { sanitizeCertificates, formatCertificateLine } from "../src/utils/certificates";

const asResume = (state: any) => ({ id: "t", createdAt: "", updatedAt: "", templateId: "classic", ...state }) as any;

test("sample BCA resume scores high", () => {
  const report = computeAtsScore(asResume(initialResumeStateEn));
  assert.ok(report.score >= 85, `expected >=85, got ${report.score}`);
});

test("blank resume scores low and lists fixes", () => {
  const report = computeAtsScore(asResume(blankResumeStateEn));
  assert.ok(report.score <= 25, `expected <=25, got ${report.score}`);
  assert.ok(report.checks.some((c) => c.status === "fail"));
});

test("score updates when a photo is added or template is table-based", () => {
  const base = asResume(initialResumeStateEn);
  const withPhoto = computeAtsScore({ ...base, basic: { ...base.basic, photo: "/me.png" } });
  assert.ok(withPhoto.score < computeAtsScore(base).score);
  const modern = computeAtsScore({ ...base, templateId: "modern" });
  assert.ok(modern.score < computeAtsScore(base).score);
});

test("hidden section counts as missing", () => {
  const base = asResume(initialResumeStateEn);
  const hidden = {
    ...base,
    menuSections: base.menuSections.map((s: any) => (s.id === "education" ? { ...s, enabled: false } : s)),
  };
  const check = computeAtsScore(hidden).checks.find((c) => c.id === "education")!;
  assert.equal(check.status, "fail");
});

test("applyBcaOrder reorders, keeps hidden state and appends extra sections", () => {
  const sections = [
    { id: "basic", title: "Profile", icon: "", enabled: true, order: 0 },
    { id: "projects", title: "Projects", icon: "", enabled: true, order: 1 },
    { id: "education", title: "Education", icon: "", enabled: false, order: 2 },
    { id: "custom-x", title: "Extra", icon: "", enabled: true, order: 3 },
  ];
  const { menuSections, customData } = applyBcaOrder(sections as any, { "custom-x": [] });
  const ids = menuSections.map((s) => s.id);
  assert.deepEqual(ids.slice(0, 4), ["basic", "selfEvaluation", "education", "skills"]);
  assert.equal(ids[ids.length - 1], "custom-x");
  assert.equal(menuSections.find((s) => s.id === "education")!.enabled, false);
  assert.ok(customData["custom-personal"].length === 1);
  assert.deepEqual(menuSections.map((s) => s.order), menuSections.map((_, i) => i));
});

test("old image certificates are dropped, text ones kept", () => {
  const result = sanitizeCertificates([
    { id: "1", url: "data:image/png;base64,xx", width: 50 },
    { id: "2", name: "Java", issuer: "NPTEL", date: "2024" },
  ]);
  assert.equal(result.length, 1);
  assert.equal(formatCertificateLine(result[0]), "NPTEL — Java (2024)");
});

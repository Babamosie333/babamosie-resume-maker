import type { ResumeData } from "@/types/resume";
import { BCA_CUSTOM_IDS } from "@/config/bcaPreset";

/**
 * Local, rule-based "ATS readiness" estimate. It is NOT a real ATS result:
 * it checks the things applicant tracking systems commonly rely on
 * (readable text, standard sections, contact details, no tables or photos).
 */

export type AtsStatus = "pass" | "partial" | "fail";
export type AtsGroup = "contact" | "sections" | "content" | "format";

export interface AtsCheck {
  id: string;
  group: AtsGroup;
  label: string;
  points: number;
  max: number;
  status: AtsStatus;
  /** What to do to improve this check (shown when not passing). */
  tip: string;
}

export interface AtsReport {
  score: number;
  checks: AtsCheck[];
  grade: "good" | "fair" | "poor";
}

/** Templates whose layout is known to use a table (harder for ATS parsers). */
const TABLE_LAYOUT_TEMPLATES = new Set(["modern"]);

export const stripHtml = (html: string | undefined | null): string =>
  (html || "")
    .replace(/<\/(p|li|div|h[1-6]|br)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const wordCount = (text: string): number =>
  text ? text.split(/\s+/).filter(Boolean).length : 0;

const hasListItems = (html: string | undefined | null): boolean =>
  /<li[\s>]/i.test(html || "");

const hasNumber = (text: string): boolean => /\d/.test(text);

const ratioStatus = (ratio: number): AtsStatus =>
  ratio >= 1 ? "pass" : ratio > 0 ? "partial" : "fail";

const make = (
  id: string,
  group: AtsGroup,
  label: string,
  max: number,
  ratio: number,
  tip: string
): AtsCheck => {
  const clamped = Math.max(0, Math.min(1, ratio));
  return {
    id,
    group,
    label,
    max,
    points: Math.round(max * clamped * 10) / 10,
    status: ratioStatus(clamped),
    tip,
  };
};

export function computeAtsScore(resume: ResumeData): AtsReport {
  const sections = resume.menuSections || [];
  const enabled = (id: string) => sections.some((s) => s.id === id && s.enabled);

  const basic = resume.basic || ({} as ResumeData["basic"]);
  // A hidden (disabled) section is not on the resume, so it counts as missing.
  const visibleEducation = !enabled("education")
    ? []
    : (resume.education || []).filter((e) => e.visible && (e.school || "").trim());
  const visibleProjects = !enabled("projects")
    ? []
    : (resume.projects || []).filter((p) => p.visible && (p.name || "").trim());
  const visibleExperience = !enabled("experience")
    ? []
    : (resume.experience || []).filter((e) => e.visible && (e.company || "").trim());
  const certificates = !enabled("certificates")
    ? []
    : (resume.certificates || []).filter(
        (c) => typeof c.name === "string" && c.name.trim()
      );

  const customText = (id: string): string =>
    enabled(id)
      ? (resume.customData?.[id] || [])
          .filter((item) => item.visible)
          .map((item) => stripHtml(`${item.title} ${item.subtitle} ${item.description}`))
          .join(" ")
          .trim()
      : "";

  const objectiveText = enabled("selfEvaluation")
    ? stripHtml(resume.selfEvaluationContent)
    : "";
  const skillsHtml = enabled("skills") ? resume.skillContent || "" : "";
  const skillsText = stripHtml(skillsHtml);
  const competenciesText = customText(BCA_CUSTOM_IDS.competencies);
  const achievementsText = customText(BCA_CUSTOM_IDS.achievements);

  const checks: AtsCheck[] = [];

  // ---- Contact (20) ----
  const linkValues = (basic.customFields || []).map((f) => (f.value || "").trim());
  const hasLink =
    !!(basic.githubKey || "").trim() ||
    linkValues.some((v) => /linkedin|github|portfolio|https?:\/\/|www\.|\.[a-z]{2,}\//i.test(v));
  checks.push(
    make("name", "contact", "Name", 4, (basic.name || "").trim() ? 1 : 0, "Add your full name in the header."),
    make("email", "contact", "Email", 4, /\S+@\S+\.\S+/.test(basic.email || "") ? 1 : 0, "Add a valid email address."),
    make("phone", "contact", "Phone", 4, (basic.phone || "").replace(/\D/g, "").length >= 8 ? 1 : 0, "Add a phone number."),
    make("location", "contact", "City / location", 4, (basic.location || "").trim() ? 1 : 0, "Add your city and state."),
    make("link", "contact", "LinkedIn / GitHub / portfolio link", 4, hasLink ? 1 : 0, "Add a LinkedIn, GitHub or portfolio link as a custom field.")
  );

  // ---- Sections (33) ----
  checks.push(
    make("objective", "sections", "Career objective", 6, objectiveText ? 1 : 0, "Add a short career objective aligned to the role."),
    make("education", "sections", "Education", 6, visibleEducation.length > 0 ? 1 : 0, "Add your education (BCA, Class XII, Class X)."),
    make("skills", "sections", "Technical skills", 6, skillsText ? 1 : 0, "Add a Technical Skills section."),
    make("projects", "sections", "Projects", 6, visibleProjects.length > 0 ? 1 : 0, "Add at least one project."),
    make("experience", "sections", "Internships / work experience", 3, visibleExperience.length > 0 ? 1 : 0, "Add an internship, training or work experience if you have one."),
    make("certifications", "sections", "Certifications & workshops", 3, certificates.length > 0 ? 1 : 0, "Add certifications or workshops as text."),
    make("competencies", "sections", "Core competencies", 3, competenciesText ? 1 : 0, "Add 3–5 core competencies (soft skills).")
  );

  // ---- Content quality (32) ----
  const objectiveWords = wordCount(objectiveText);
  const objectiveRatio =
    objectiveWords === 0 ? 0 : objectiveWords >= 20 && objectiveWords <= 60 ? 1 : 0.5;
  checks.push(
    make(
      "objective-length",
      "content",
      "Objective length (20–60 words)",
      6,
      objectiveRatio,
      objectiveWords === 0
        ? "Write a 2–3 line objective (20–60 words)."
        : objectiveWords < 20
          ? `Objective is ${objectiveWords} words; aim for 20–60.`
          : `Objective is ${objectiveWords} words; shorten it to 60 or fewer.`
    )
  );

  const skillLines = (skillsHtml.match(/<li[\s\S]*?<\/li>/gi) || []).map(stripHtml);
  const categorizedLines = skillLines.filter((line) => line.includes(":"));
  checks.push(
    make(
      "skills-categorized",
      "content",
      "Skills grouped by category",
      6,
      categorizedLines.length >= 2 ? 1 : categorizedLines.length === 1 ? 0.5 : 0,
      "Group skills like “Languages: Python, Java” with one category per line."
    )
  );

  checks.push(
    make(
      "tech-stack",
      "content",
      "Projects list their tech stack",
      6,
      visibleProjects.length === 0
        ? 0
        : visibleProjects.filter((p) => (p.techStack || []).some((t) => t.trim())).length /
            visibleProjects.length,
      "Add the tech stack to each project."
    )
  );

  const impactItems = [
    ...visibleProjects.map((p) => stripHtml(p.description)),
    ...visibleExperience.map((e) => stripHtml(e.details)),
  ];
  checks.push(
    make(
      "metrics",
      "content",
      "Results with numbers",
      6,
      impactItems.length === 0
        ? 0
        : impactItems.filter(hasNumber).length / impactItems.length,
      "Add measurable results (users, % improvement, time saved) to projects and internships."
    )
  );

  const bulletSources = [
    ...visibleProjects.map((p) => p.description),
    ...visibleExperience.map((e) => e.details),
  ].filter((html) => stripHtml(html));
  checks.push(
    make(
      "bullets",
      "content",
      "Bullet points in projects & experience",
      4,
      bulletSources.length === 0
        ? 0
        : bulletSources.filter(hasListItems).length / bulletSources.length,
      "Use bullet points (one achievement per line)."
    )
  );

  checks.push(
    make(
      "achievements",
      "content",
      "Achievements & co-curricular",
      4,
      achievementsText ? 1 : 0,
      "Add achievements, contests or activities."
    )
  );

  // ---- Format (15) ----
  checks.push(
    make(
      "no-photo",
      "format",
      "No photo",
      5,
      (basic.photo || "").trim() ? 0 : 1,
      "Remove the photo; most ATS ignore images and some reject them."
    )
  );

  const layout = resume.templateId || "classic";
  checks.push(
    make(
      "template",
      "format",
      "ATS-friendly template layout",
      5,
      TABLE_LAYOUT_TEMPLATES.has(layout) ? 0 : 1,
      "This template uses a table-based layout. Choose a single-column template such as Classic."
    )
  );

  const allText = [
    objectiveText,
    skillsText,
    competenciesText,
    achievementsText,
    customText(BCA_CUSTOM_IDS.personal),
    ...visibleEducation.map((e) => stripHtml(`${e.school} ${e.major} ${e.degree} ${e.description}`)),
    ...impactItems,
    ...certificates.map((c) => `${c.name} ${c.issuer}`),
  ].join(" ");
  const totalWords = wordCount(allText);
  const lengthRatio =
    totalWords >= 150 && totalWords <= 900 ? 1 : totalWords === 0 ? 0 : 0.5;
  checks.push(
    make(
      "length",
      "format",
      "Length (about 1–2 pages)",
      5,
      lengthRatio,
      totalWords > 900
        ? `About ${totalWords} words; trim to fit 2 pages.`
        : `About ${totalWords} words; add more detail (aim for 150+).`
    )
  );

  const score = Math.round(checks.reduce((sum, c) => sum + c.points, 0));
  return {
    score,
    checks,
    grade: score >= 80 ? "good" : score >= 60 ? "fair" : "poor",
  };
}

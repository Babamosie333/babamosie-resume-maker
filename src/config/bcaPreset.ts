import { CustomItem, MenuSection } from "@/types/resume";
import { generateUUID } from "@/utils/uuid";

/** Section ids used by the BCA resume format (custom ids start with "custom"). */
export const BCA_CUSTOM_IDS = {
  competencies: "custom-competencies",
  achievements: "custom-achievements",
  personal: "custom-personal",
} as const;

interface BcaSection {
  id: string;
  title: string;
  icon: string;
}

/** Section order from the BCA resume format (header comes first). */
export const BCA_SECTIONS: BcaSection[] = [
  { id: "basic", title: "Profile", icon: "👤" },
  { id: "selfEvaluation", title: "Career Objective", icon: "🎯" },
  { id: "education", title: "Education", icon: "🎓" },
  { id: "skills", title: "Technical Skills", icon: "⚡" },
  { id: BCA_CUSTOM_IDS.competencies, title: "Core Competencies", icon: "🧠" },
  { id: "projects", title: "Projects", icon: "🚀" },
  { id: "experience", title: "Internships / Work Experience", icon: "💼" },
  { id: "certificates", title: "Certifications & Workshops", icon: "🏆" },
  { id: BCA_CUSTOM_IDS.achievements, title: "Achievements & Co-curricular", icon: "🥇" },
  { id: BCA_CUSTOM_IDS.personal, title: "Personal Details", icon: "📌" },
];

/** Older default titles that should be renamed when the preset is applied. */
const LEGACY_TITLES: Record<string, string[]> = {
  selfEvaluation: ["Self Evaluation", "自我评价"],
  skills: ["Skills", "专业技能"],
  experience: ["Experience", "工作经验"],
  certificates: ["Certificates", "证书"],
};

const emptyCustomItem = (): CustomItem => ({
  id: generateUUID(),
  title: "",
  subtitle: "",
  dateRange: "",
  description: "",
  visible: true,
});

/**
 * Reorders sections into the BCA order. Existing sections keep their
 * enabled/hidden state and custom titles; missing ones are added; any other
 * sections (e.g. extra custom sections) follow after the BCA sections.
 */
export const applyBcaOrder = (
  menuSections: MenuSection[] = [],
  customData: Record<string, CustomItem[]> = {}
): { menuSections: MenuSection[]; customData: Record<string, CustomItem[]> } => {
  const byId = new Map(menuSections.map((section) => [section.id, section]));
  const bcaIds = new Set(BCA_SECTIONS.map((section) => section.id));

  const ordered: MenuSection[] = BCA_SECTIONS.map((def) => {
    const existing = byId.get(def.id);
    if (!existing) {
      return { id: def.id, title: def.title, icon: def.icon, enabled: true, order: 0 };
    }
    const isLegacyTitle = (LEGACY_TITLES[def.id] || []).includes(existing.title);
    return {
      ...existing,
      title: isLegacyTitle || !existing.title ? def.title : existing.title,
    };
  });

  const rest = menuSections.filter((section) => !bcaIds.has(section.id));
  const merged = [...ordered, ...rest].map((section, index) => ({
    ...section,
    order: index,
  }));

  const nextCustomData = { ...customData };
  Object.values(BCA_CUSTOM_IDS).forEach((id) => {
    if (!nextCustomData[id] || nextCustomData[id].length === 0) {
      nextCustomData[id] = [emptyCustomItem()];
    }
  });

  return { menuSections: merged, customData: nextCustomData };
};

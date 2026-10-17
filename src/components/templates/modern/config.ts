import { ResumeTemplate } from "@/types/template";

export const modernConfig: ResumeTemplate = {
  id: "modern",
  name: "Two-Column Layout",
  description: "Classic two-column layout that highlights your personality",
  thumbnail: "modern",
  layout: "modern",
  colorScheme: {
    primary: "#000000",
    secondary: "#6b7280",
    background: "#ffffff",
    text: "#212529",
  },
  spacing: {
    sectionGap: 8,
    itemGap: 4,
    contentPadding: 0,
  },
  basic: {
    layout: "center",
  },
  availableSections: ["skills", "experience", "projects", "education", "selfEvaluation", "certificates"],
};

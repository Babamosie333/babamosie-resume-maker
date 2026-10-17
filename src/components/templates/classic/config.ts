import { ResumeTemplate } from "@/types/template";

export const classicConfig: ResumeTemplate = {
  id: "classic",
  name: "Classic",
  description: "Traditional, simple resume layout suitable for most job searches",
  thumbnail: "classic",
  layout: "classic",
  colorScheme: {
    primary: "#000000",
    secondary: "#4b5563",
    background: "#ffffff",
    text: "#212529",
  },
  spacing: {
    sectionGap: 16,
    itemGap: 12,
    contentPadding: 32,
  },
  basic: {
    layout: "left",
  },
  availableSections: ["skills", "experience", "projects", "education", "selfEvaluation", "certificates"],
};

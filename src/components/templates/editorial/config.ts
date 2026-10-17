import { ResumeTemplate } from "@/types/template";

export const editorialConfig: ResumeTemplate = {
  id: "editorial",
  name: "Editorial",
  description: "Magazine-style layout pairing large serif headings with a narrow sans-serif body and a side timeline for a premium look",
  thumbnail: "editorial",
  layout: "editorial",
  colorScheme: {
    primary: "#000000",
    secondary: "#666666",
    text: "#1a1a1a",
    background: "#FFFFFF",
  },
  spacing: {
    sectionGap: 32,
    itemGap: 16,
    contentPadding: 36,
  },
  basic: {
    layout: "left",
  },
  availableSections: ["basic", "experience", "education", "projects", "skills", "selfEvaluation", "certificates", "languages", "custom"],
};

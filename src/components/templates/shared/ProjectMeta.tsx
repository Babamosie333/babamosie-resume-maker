import React from "react";
import { GlobalSettings, Project } from "@/types/resume";

interface ProjectMetaProps {
    project: Project;
    globalSettings?: GlobalSettings;
}

/** Plain-text "Tech Stack" and "Duration" lines shown under a project header. */
const ProjectMeta: React.FC<ProjectMetaProps> = ({ project, globalSettings }) => {
    const techStack = (project.techStack || []).map((item) => item.trim()).filter(Boolean);
    const duration = project.duration?.trim();
    if (techStack.length === 0 && !duration) return null;

    return (
        <div
            className="mt-1"
            style={{
                fontSize: `${globalSettings?.baseFontSize || 14}px`,
                lineHeight: globalSettings?.lineHeight || 1.6,
            }}
        >
            {techStack.length > 0 && (
                <div>
                    <span className="font-semibold">Tech Stack: </span>
                    {techStack.join(", ")}
                </div>
            )}
            {duration && (
                <div>
                    <span className="font-semibold">Duration: </span>
                    {duration}
                </div>
            )}
        </div>
    );
};

export default ProjectMeta;

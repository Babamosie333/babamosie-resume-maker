import React from "react";
import { Certificate, GlobalSettings } from "@/types/resume";

interface CertificatesSectionProps {
    certificates: Certificate[];
    globalSettings?: GlobalSettings;
}

/** Plain-text certificates list (no images) so ATS parsers can read it. */
const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates, globalSettings }) => {
    const visible = (certificates || []).filter((cert) => cert.name && cert.name.trim());
    if (visible.length === 0) return null;

    return (
        <ul
            className="w-full mt-2 list-disc pl-5"
            style={{
                fontSize: `${globalSettings?.baseFontSize || 14}px`,
                lineHeight: globalSettings?.lineHeight || 1.6,
            }}
        >
            {visible.map((cert) => (
                <li key={cert.id}>
                    <span className="font-semibold">{cert.name}</span>
                    {cert.issuer ? <span> — {cert.issuer}</span> : null}
                    {cert.date ? <span> ({cert.date})</span> : null}
                </li>
            ))}
        </ul>
    );
};

export default CertificatesSection;

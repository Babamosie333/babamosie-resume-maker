import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import { Reorder } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "@/i18n/compat/client";
import { Button } from "@/components/ui/button";
import CertificateItem from "./CertificateItem";
import { Certificate } from "@/types/resume";
import { generateUUID } from "@/utils/uuid";

const CertificatesPanel = () => {
    const t = useTranslations("workbench.certificatesPanel");
    const { activeResume, updateCertificatesBatch, addCertificate } = useResumeStore();
    const { certificates = [] } = activeResume || {};

    const handleAdd = () => {
        const newCert: Certificate = {
            id: generateUUID(),
            name: "",
            issuer: "",
            date: "",
        };
        addCertificate(newCert);
    };

    return (
        <div className={cn("space-y-4 px-4 py-4 rounded-lg bg-card border-border")}>
            <p className="text-sm text-gray-500">{t("tips")}</p>

            {certificates.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-400 border border-dashed rounded-lg">
                    {t("empty")}
                </div>
            )}

            <Reorder.Group
                axis="y"
                values={certificates}
                onReorder={updateCertificatesBatch}
                className="space-y-3"
            >
                {certificates.map((cert) => (
                    <CertificateItem key={cert.id} certificate={cert} />
                ))}

                <Button onClick={handleAdd} className="w-full">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    {t("addButton")}
                </Button>
            </Reorder.Group>
        </div>
    );
};
export default CertificatesPanel;

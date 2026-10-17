import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Trash2 } from "lucide-react";
import { Certificate } from "@/types/resume";
import ThemeModal from "@/components/shared/ThemeModal";
import { useTranslations } from "@/i18n/compat/client";
import { useState } from "react";
import Field from "../Field";

const CertificateItem = ({ certificate }: { certificate: Certificate }) => {
    const { updateCertificate, removeCertificate, setDraggingProjectId } = useResumeStore();
    const dragControls = useDragControls();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const t = useTranslations("workbench.certificatesPanel");

    return (
        <Reorder.Item
            id={certificate.id}
            value={certificate}
            dragListener={false}
            dragControls={dragControls}
            onDragEnd={() => setDraggingProjectId(null)}
            className={cn(
                "rounded-lg border overflow-hidden flex flex-col group",
                "bg-card hover:border-primary/50 border-border"
            )}
        >
            <div className="flex">
                {/* Drag handle */}
                <div
                    onPointerDown={(e) => {
                        dragControls.start(e);
                        setDraggingProjectId(certificate.id);
                    }}
                    onPointerUp={() => setDraggingProjectId(null)}
                    onPointerCancel={() => setDraggingProjectId(null)}
                    className={cn(
                        "w-8 flex items-center justify-center border-r shrink-0 touch-none",
                        "border-border cursor-grab hover:bg-muted/50"
                    )}
                >
                    <GripVertical className="w-4 h-4 text-muted-foreground transition-transform group-hover:scale-110" />
                </div>

                <div className="flex-1 min-w-0 p-4 space-y-3">
                    <Field
                        label={t("name")}
                        value={certificate.name}
                        onChange={(value) => updateCertificate(certificate.id, { name: value })}
                        placeholder={t("namePlaceholder")}
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                        <Field
                            label={t("issuer")}
                            value={certificate.issuer}
                            onChange={(value) => updateCertificate(certificate.id, { issuer: value })}
                            placeholder={t("issuerPlaceholder")}
                        />
                        <Field
                            label={t("date")}
                            value={certificate.date}
                            onChange={(value) => updateCertificate(certificate.id, { date: value })}
                            placeholder={t("datePlaceholder")}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <ThemeModal
                isOpen={deleteDialogOpen}
                title={t("delete")}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={() => {
                    removeCertificate(certificate.id);
                    setDeleteDialogOpen(false);
                }}
            />
        </Reorder.Item>
    );
};

export default CertificateItem;

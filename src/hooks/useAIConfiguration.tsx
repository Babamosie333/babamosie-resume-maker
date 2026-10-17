import { useRouter } from "@/lib/navigation";
import { useTranslations } from "@/i18n/compat/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAIConfigStore } from "@/store/useAIConfigStore";
import { useDefaultAIAvailable } from "@/hooks/useDefaultAI";

export const useAIConfiguration = () => {
  const router = useRouter();
  const t = useTranslations("previewDock.grammarCheck");
  const isConfigured = useAIConfigStore((state) => state.isConfigured);
  const defaultAvailable = useDefaultAIAvailable();

  const checkConfiguration = () => {
    // A server-side default model is used when the visitor has none of their own.
    if (!isConfigured() && !defaultAvailable) {
      toast.error(
        <>
          <span>{t("configurePrompt")}</span>
          <Button
            variant="link"
            className="p-0 h-auto ml-1 font-bold underline decoration-[#D97757]/30 underline-offset-4 text-[#D97757]"
            onClick={() => router.push("/app/dashboard/ai")}
          >
            {t("configureButton")}
          </Button>
        </>
      );
      return false;
    }

    return true;
  };

  return {
    checkConfiguration,
  };
};

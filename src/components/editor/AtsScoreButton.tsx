import { useDeferredValue, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, CircleX, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet-no-overlay";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useResumeStore } from "@/store/useResumeStore";
import { computeAtsScore, type AtsCheck, type AtsGroup } from "@/lib/atsScore";
import { cn } from "@/lib/utils";

const GROUP_LABELS: Record<AtsGroup, string> = {
  contact: "Contact details",
  sections: "Sections",
  content: "Content quality",
  format: "Format",
};

const GROUP_ORDER: AtsGroup[] = ["contact", "sections", "content", "format"];

const scoreColor = (grade: "good" | "fair" | "poor") =>
  grade === "good"
    ? "text-green-600 dark:text-green-400"
    : grade === "fair"
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

const StatusIcon = ({ status }: { status: AtsCheck["status"] }) =>
  status === "pass" ? (
    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
  ) : status === "partial" ? (
    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
  ) : (
    <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
  );

/** Live ATS score badge in the editor header; opens a checklist drawer. */
export function AtsScoreButton() {
  const activeResume = useResumeStore((state) => state.activeResume);
  const deferredResume = useDeferredValue(activeResume);
  const [open, setOpen] = useState(false);

  const report = useMemo(
    () => (deferredResume ? computeAtsScore(deferredResume) : null),
    [deferredResume]
  );

  if (!report) return null;

  const failing = report.checks.filter((c) => c.status !== "pass");

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 px-2"
        onClick={() => setOpen(true)}
        aria-label={`ATS score ${report.score} out of 100`}
        title="Live ATS readiness estimate"
      >
        <Gauge className={cn("h-4 w-4", scoreColor(report.grade))} />
        <span className="text-sm font-medium">ATS</span>
        <span className={cn("text-sm font-semibold tabular-nums", scoreColor(report.grade))}>
          {report.score}
        </span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen} modal={false}>
        <SheetContent
          side="left"
          className="w-[400px] sm:w-[450px] p-0 flex flex-col gap-0 border-r shadow-lg bg-muted/30 backdrop-blur-xl"
        >
          <div className="p-6 pb-4 bg-background/80 sticky top-0 z-10 border-b">
            <div className="flex items-end justify-between">
              <div>
                <SheetTitle className="text-lg font-semibold">ATS readiness</SheetTitle>
                <SheetDescription className="text-xs">
                  Updates as you edit. This is an estimate based on common ATS rules, not a
                  real ATS result.
                </SheetDescription>
              </div>
              <div className={cn("text-3xl font-bold tabular-nums", scoreColor(report.grade))}>
                {report.score}
                <span className="text-base font-medium text-muted-foreground">/100</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {failing.length === 0
                ? "All checks passed."
                : `${failing.length} item${failing.length === 1 ? "" : "s"} to improve.`}
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-5 p-6">
              {GROUP_ORDER.map((group) => {
                const items = report.checks.filter((c) => c.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group} className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {GROUP_LABELS[group]}
                    </h3>
                    <ul className="space-y-2">
                      {items.map((check) => (
                        <li
                          key={check.id}
                          className="flex gap-2 rounded-lg border bg-background/70 p-3"
                        >
                          <StatusIcon status={check.status} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">{check.label}</span>
                              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                {check.points}/{check.max}
                              </span>
                            </div>
                            {check.status !== "pass" && (
                              <p className="mt-1 text-xs text-muted-foreground">{check.tip}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TechStackInputProps {
  label: string;
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

/** Chip input: type a technology and press Enter (or comma) to add it. */
const TechStackInput = ({
  label,
  placeholder,
  value,
  onChange,
}: TechStackInputProps) => {
  const [draft, setDraft] = useState("");

  const addDraft = () => {
    const parts = draft
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const existing = new Set(value.map((item) => item.toLowerCase()));
    const next = [...value];
    parts.forEach((part) => {
      if (!existing.has(part.toLowerCase())) {
        existing.add(part.toLowerCase());
        next.push(part);
      }
    });
    onChange(next);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs"
            >
              {item}
              <button
                type="button"
                aria-label={`Remove ${item}`}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onChange(value.filter((v) => v !== item))}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addDraft();
          } else if (e.key === "Backspace" && !draft && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={addDraft}
      />
    </div>
  );
};

export default TechStackInput;

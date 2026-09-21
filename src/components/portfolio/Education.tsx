import { useState, useCallback, useMemo, memo } from "react";
import {
  GraduationCap,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  Building2,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EducationItemData {
  _id: string;
  year: string;
  degree: string;
  institution: string;
  description: string;
  order: number;
}

const EducationTimelineItem = memo(function EducationTimelineItem({
  item,
  expanded,
  onToggle,
  isLast,
}: {
  item: EducationItemData;
  expanded: boolean;
  onToggle: (id: string) => void;
  isLast: boolean;
}) {
  const headerId = `edu-header-${item._id}`;
  const contentId = `edu-content-${item._id}`;

  const bulletPoints = useMemo(() => {
    if (!item.description) return [];
    const parsed = item.description
      .split(/(?:\r?\n|•|;\s*|\.\s+)/)
      .map((s) => s.trim())
      .map((s) => (s.endsWith(".") ? s.slice(0, -1) : s))
      .filter((s) => s.length > 2);
    return parsed.length > 0 ? parsed : [item.description];
  }, [item.description]);

  return (
    <div className="relative group">
      {/* Connecting gradient line */}
      {!isLast && (
        <div className="absolute left-[21px] sm:left-6 top-14 bottom-0 w-[2px] bg-gradient-to-b from-primary/80 via-primary/30 to-border/30" />
      )}

      {/* Timeline Node Circle */}
      <div className="absolute left-3.5 sm:left-4 top-6 w-4 h-4 bg-background border-2 border-primary rounded-full flex items-center justify-center transform transition-all duration-200 z-10 group-hover:scale-110">
        <div className="w-2 h-2 bg-primary rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Main Content Card */}
      <div className="ml-9 sm:ml-12 mb-6">
        <div
          className={`overflow-hidden rounded-xl border bg-card/90 backdrop-blur-sm transition-all duration-200 ${
            expanded
              ? "border-primary/40 shadow-sm"
              : "border-border/60 shadow-xs hover:border-primary/30 hover:shadow-sm"
          }`}
        >
          {/* Header Button */}
          <button
            id={headerId}
            type="button"
            className="w-full text-left p-4 sm:p-6 cursor-pointer hover:bg-muted/40 transition-colors duration-200 rounded-t-xl flex items-start justify-between gap-3 sm:gap-4"
            onClick={() => onToggle(item._id)}
            aria-expanded={expanded}
            aria-controls={contentId}
          >
            <div className="flex items-start gap-3 sm:gap-3.5 flex-1 min-w-0">
              <div className="p-2 sm:p-2.5 bg-primary/10 text-primary rounded-lg shrink-0 mt-0.5 border border-primary/20">
                <GraduationCap className="w-4 h-4" />
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight leading-snug break-words">
                  {item.degree}
                </h3>

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <Badge
                    variant="outline"
                    className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 border-primary/30 text-primary bg-primary/5 font-medium"
                  >
                    <Calendar className="w-3 h-3 mr-1 inline-block" />
                    {item.year}
                  </Badge>
                  <span className="inline-flex items-center text-[11px] sm:text-xs font-medium text-muted-foreground break-words">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-primary/80 shrink-0 inline-block" />
                    {item.institution}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`text-muted-foreground transition-transform duration-200 shrink-0 mt-1 p-1 rounded-md hover:bg-muted ${
                expanded ? "rotate-180 text-primary" : ""
              }`}
            >
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </button>

          {/* Expandable Content Body */}
          {expanded && (
            <div
              id={contentId}
              role="region"
              aria-labelledby={headerId}
              className="px-4 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-border/30 space-y-4 animate-in fade-in duration-200"
            >
              <ul className="space-y-2.5">
                {bulletPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 sm:gap-3 group/pt">
                    <span className="w-1.5 h-1.5 bg-primary/80 rounded-full mt-2 shrink-0 group-hover/pt:scale-125 transition-transform" />
                    <span className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {pt}.
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 flex flex-wrap gap-1.5 sm:gap-2 border-t border-border/30">
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-[11px] font-medium bg-secondary/50"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1 text-primary inline-block" /> Academic Excellence
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-[11px] font-medium bg-secondary/50"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1 text-primary inline-block" /> Computer Science & Engineering
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
EducationTimelineItem.displayName = "EducationTimelineItem";

export function Education() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const {
    data: education = [],
    isLoading,
    error,
    refetch,
  } = useQuery<EducationItemData[]>({
    queryKey: ["education"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/education`);
      if (!res.ok) {
        throw new Error("Failed to load education from server.");
      }
      return res.json();
    },
  });

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(education.map((e) => e._id)),
  );

  const handleToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  if (isLoading) {
    return (
      <section id="education" className="relative py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Education"
            title="My Education Journey"
            description="The academic foundation behind my engineering mindset."
          />

          <div className="relative mt-8 md:mt-10">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="ml-9 sm:ml-12 relative">
                  <Skeleton className="h-28 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="education"
        className="relative py-12 md:py-16 flex items-center justify-center"
      >
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/15 flex items-center justify-center text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Failed to load education
          </h3>
          <p className="text-sm text-muted-foreground">
            The portfolio server might be offline or failed to respond.
          </p>
          <Button onClick={() => refetch()} className="cursor-pointer rounded-xl">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="relative py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Education"
          title="My Education Journey"
          description="The academic foundation behind my engineering mindset."
        />

        <div className="relative mt-8 md:mt-10">
          <div className="space-y-2">
            {education.map((edu, i) => {
              const isExpanded = expandedIds.has(edu._id) || expandedIds.size === 0;
              return (
                <Reveal key={edu._id || edu.degree} delay={i * 0.06}>
                  <EducationTimelineItem
                    item={edu}
                    expanded={isExpanded}
                    onToggle={handleToggle}
                    isLast={i === education.length - 1}
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

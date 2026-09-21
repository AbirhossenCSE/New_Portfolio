import { useState, useCallback, useMemo, memo } from "react";
import {
  Briefcase,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExperienceItemData {
  _id?: string;
  role: string;
  company: string;
  duration: string;
  current?: boolean;
  description: string;
  order?: number;
  responsibilities?: string[];
  skills?: string[];
}

const ExperienceTimelineItem = memo(function ExperienceTimelineItem({
  item,
  expanded,
  onToggle,
  isLast,
}: {
  item: ExperienceItemData;
  expanded: boolean;
  onToggle: (id: string) => void;
  isLast: boolean;
}) {
  const itemId = item._id || `${item.company}-${item.role}`;
  const headerId = `exp-header-${itemId}`;
  const contentId = `exp-content-${itemId}`;

  // Split description lines into bullet points reliably
  const bulletPoints = useMemo(() => {
    if (item.responsibilities && item.responsibilities.length > 0) {
      return item.responsibilities;
    }
    if (!item.description) return [];

    // Split by linebreaks, bullets (•), or sentence endings (. )
    const parsed = item.description
      .split(/(?:\r?\n|•|;\s*|\.\s+)/)
      .map((s) => s.trim())
      .map((s) => (s.endsWith(".") ? s.slice(0, -1) : s))
      .filter((s) => s.length > 2);

    return parsed.length > 0 ? parsed : [item.description];
  }, [item.responsibilities, item.description]);

  return (
    <div className="relative group">
      {/* Connecting gradient line */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-0 w-[2px] bg-gradient-to-b from-primary/80 via-primary/30 to-border/30" />
      )}

      {/* Timeline node marker */}
      <div className="absolute left-4 top-6 w-4 h-4 bg-background border-2 border-primary rounded-full flex items-center justify-center transform transition-all duration-200 z-10 group-hover:scale-110">
        <div className="w-2 h-2 bg-primary rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Main content card with subtle shadow */}
      <div className="ml-12 mb-6">
        <div
          className={`overflow-hidden rounded-xl border bg-card/90 backdrop-blur-sm transition-all duration-200 ${
            expanded
              ? "border-primary/40 shadow-sm"
              : "border-border/60 shadow-xs hover:border-primary/30 hover:shadow-sm"
          }`}
        >
          {/* Header button */}
          <button
            id={headerId}
            type="button"
            className="w-full text-left p-5 sm:p-6 cursor-pointer hover:bg-muted/40 transition-colors duration-200 rounded-t-xl flex items-start justify-between gap-4"
            onClick={() => onToggle(itemId)}
            aria-expanded={expanded}
            aria-controls={contentId}
          >
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="p-2.5 bg-primary/10 text-primary rounded-lg shrink-0 mt-0.5 border border-primary/20">
                <Briefcase className="w-4 h-4" />
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight truncate">
                    {item.role}
                  </h3>
                  {item.current && (
                    <Badge className="bg-primary/15 text-primary border-primary/30 text-[11px] px-2 py-0.5 font-medium">
                      <Sparkles className="w-3 h-3 mr-1 inline-block" /> Current
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                  <span className="inline-flex items-center text-xs font-medium text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-primary/80 inline-block" />
                    {item.company}
                  </span>
                  <span className="text-xs text-border">•</span>
                  <Badge
                    variant="outline"
                    className="text-xs px-2.5 py-0.5 border-border/70 text-muted-foreground bg-muted/20 font-medium"
                  >
                    <Calendar className="w-3 h-3 mr-1 inline-block text-primary/70" />
                    {item.duration}
                  </Badge>
                </div>
              </div>
            </div>

            <div
              className={`text-muted-foreground transition-transform duration-200 shrink-0 mt-1 p-1 rounded-md hover:bg-muted ${
                expanded ? "rotate-180 text-primary" : ""
              }`}
            >
              <ChevronDown className="w-5 h-5" />
            </div>
          </button>

          {/* Expandable bullet points body */}
          {expanded && (
            <div
              id={contentId}
              role="region"
              aria-labelledby={headerId}
              className="px-5 sm:px-6 pb-6 pt-3 border-t border-border/30 space-y-4 animate-in fade-in duration-200"
            >
              <ul className="space-y-2.5">
                {bulletPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3 group/pt">
                    <span className="w-1.5 h-1.5 bg-primary/80 rounded-full mt-2 shrink-0 group-hover/pt:scale-125 transition-transform" />
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {pt}.
                    </span>
                  </li>
                ))}
              </ul>

              {item.skills && item.skills.length > 0 && (
                <div className="pt-3 flex flex-wrap gap-2 border-t border-border/30">
                  {item.skills.map((skill, sIdx) => (
                    <Badge
                      key={sIdx}
                      variant="secondary"
                      className="text-xs font-medium bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1 text-primary inline-block" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
ExperienceTimelineItem.displayName = "ExperienceTimelineItem";

export function Experience() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const {
    data: experiences = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ExperienceItemData[]>({
    queryKey: ["experiences"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/experience`);
      if (!res.ok) {
        throw new Error("Failed to load professional experience.");
      }
      return res.json();
    },
  });

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(experiences.map((exp) => exp._id || `${exp.company}-${exp.role}`))
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
      <section id="experience" className="relative py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Experience"
            title="My Professional Journey"
            description="Real-world experience delivering production web applications."
          />

          <div className="relative mt-8 md:mt-10">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="ml-12 relative">
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
        id="experience"
        className="relative py-12 md:py-16 flex items-center justify-center"
      >
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/15 flex items-center justify-center text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Unable to load experience
          </h3>
          <p className="text-sm text-muted-foreground">
            {(error as Error).message}
          </p>
          <Button onClick={() => refetch()} className="cursor-pointer rounded-xl">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="relative py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Experience"
          title="My Professional Journey"
          description="Real-world experience delivering production web applications."
        />

        {experiences.length === 0 ? (
          <div className="mt-8 text-center text-muted-foreground py-8 border border-dashed rounded-xl">
            No experience listed yet.
          </div>
        ) : (
          <div className="relative mt-8 md:mt-10">
            <div className="space-y-2">
              {experiences.map((job, i) => {
                const id = job._id || `${job.company}-${job.role}`;
                const isExpanded =
                  expandedIds.has(id) || expandedIds.size === 0;

                return (
                  <Reveal key={id} delay={i * 0.06}>
                    <ExperienceTimelineItem
                      item={job}
                      expanded={isExpanded}
                      onToggle={handleToggle}
                      isLast={i === experiences.length - 1}
                    />
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

import { GraduationCap, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface EducationItem {
  _id?: string;
  year: string;
  degree: string;
  institution: string;
  description: string;
  order: number;
}

export function Education() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const {
    data: education = [],
    isLoading,
    error,
    refetch,
  } = useQuery<EducationItem[]>({
    queryKey: ["education"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/education`);
      if (!res.ok) {
        throw new Error("Failed to load education from server.");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <section id="education" className="relative py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Education"
            title="My Education Journey"
            description="The academic foundation behind my engineering mindset."
          />

          <div className="relative mt-14 pl-8 sm:pl-10">
            <div className="absolute left-2.5 top-2 h-full w-px bg-border sm:left-3" />

            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[1.55rem] top-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-muted sm:-left-[1.85rem]" />
                  <Skeleton className="h-32 w-full rounded-2xl" />
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
        className="relative py-20 md:py-28 flex items-center justify-center"
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
          <Button onClick={() => refetch()} className="cursor-pointer">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Education"
          title="My Education Journey"
          description="The academic foundation behind my engineering mindset."
        />

        <div className="relative mt-14 pl-8 sm:pl-10">
          <div className="absolute left-2.5 top-2 h-full w-px bg-border sm:left-3" />

          <div className="space-y-8">
            {education.map((edu, i) => (
              <Reveal key={edu.degree} delay={i * 0.06}>
                <div className="relative">
                  <span className="absolute -left-[1.55rem] top-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-gradient-primary text-primary-foreground sm:-left-[1.85rem]">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </span>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {edu.year}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-foreground">
                      {edu.degree}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-primary">
                      {edu.institution}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {edu.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

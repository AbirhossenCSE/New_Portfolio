import { Building2, Briefcase, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ExperienceItem {
  _id?: string;
  role: string;
  company: string;
  duration: string;
  current: boolean;
  description: string;
  order: number;
}

export function Experience() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const { data: experiences = [], isLoading, error, refetch } = useQuery<ExperienceItem[]>({
    queryKey: ["experiences"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/experience`);
      if (!res.ok) {
        throw new Error("Failed to load professional experience.");
      }
      return res.json();
    }
  });

  return (
    <section id="experience" className="relative py-20 md:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-subtle" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Experience"
          title="My Professional Journey"
          description="Real-world experience delivering production web applications."
        />

        {/* Loading State */}
        {isLoading && (
          <div className="relative mt-14">
            <div className="absolute left-4 top-2 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2" />
            <div className="space-y-10">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`relative pl-12 md:pl-0 ${
                    i % 2 === 1 ? "md:pr-[52%] md:text-right" : "md:pl-[52%]"
                  }`}
                >
                  <span className="absolute left-4 top-6 z-10 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full border-2 border-background bg-gradient-primary md:left-1/2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  </span>
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-3">
                    <div className={`flex items-center gap-2 ${i % 2 === 1 ? "md:justify-end" : ""}`}>
                      <Skeleton className="h-6 w-32 rounded-full" />
                    </div>
                    <Skeleton className={`h-6 w-48 ${i % 2 === 1 ? "md:ml-auto" : ""}`} />
                    <Skeleton className={`h-4 w-36 ${i % 2 === 1 ? "md:ml-auto" : ""}`} />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-14 flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <h3 className="text-lg font-bold text-foreground">Unable to load experience</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">{(error as Error).message}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
              <RefreshCw className="h-4 w-4 mr-2" /> Retry connection
            </Button>
          </div>
        )}

        {/* Success State */}
        {!isLoading && !error && experiences.length === 0 && (
          <div className="mt-14 text-center text-muted-foreground">
            No professional experience listed in database. Check back later or log in to the admin panel to add them.
          </div>
        )}

        {!isLoading && !error && experiences.length > 0 && (
          <div className="relative mt-14">
            <div className="absolute left-4 top-2 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-10">
              {experiences.map((job, i) => (
                <Reveal key={job._id || job.company} delay={i * 0.05}>
                  <div
                    className={`relative pl-12 md:pl-0 ${
                      i % 2 === 0 ? "md:pr-[52%] md:text-right" : "md:pl-[52%]"
                    }`}
                  >
                    <span className="absolute left-4 top-6 z-10 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full border-2 border-background bg-gradient-primary md:left-1/2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                    </span>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                      <div
                        className={`flex items-center gap-2 ${
                          i % 2 === 0 ? "md:justify-end" : ""
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          <Briefcase className="h-3.5 w-3.5" />
                          {job.duration}
                        </span>
                        {job.current ? (
                          <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                            Current
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-3 text-xl font-bold text-foreground">{job.role}</h3>
                      <div
                        className={`mt-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground ${
                          i % 2 === 0 ? "md:justify-end" : ""
                        }`}
                      >
                        <Building2 className="h-4 w-4 text-primary" />
                        {job.company}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

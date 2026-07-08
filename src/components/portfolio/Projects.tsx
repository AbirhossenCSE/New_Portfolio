import { motion } from "framer-motion";
import { ArrowUpRight, Github, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ProjectItem {
  _id?: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  live: string;
  github: string;
  featured: boolean;
  order: number;
}

export function Projects() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const { data: projects = [], isLoading, error, refetch } = useQuery<ProjectItem[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/projects`);
      if (!res.ok) {
        throw new Error("Failed to load projects from server.");
      }
      return res.json();
    }
  });

  return (
    <section id="projects" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Selected work I'm proud of"
          description="Full-stack applications built with the MERN stack, Firebase, and modern tooling."
        />

        {/* Loading State */}
        {isLoading && (
          <div className="mt-16 space-y-16 md:space-y-24">
            {[1, 2].map((i) => (
              <div key={i} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                <div className={`overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-card ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
                </div>
                <div className={`space-y-4 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Skeleton className="h-10 w-28 rounded-xl" />
                    <Skeleton className="h-10 w-28 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <h3 className="text-lg font-bold text-foreground">Unable to load projects</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">{(error as Error).message}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
              <RefreshCw className="h-4 w-4 mr-2" /> Retry connection
            </Button>
          </div>
        )}

        {/* Success State */}
        {!isLoading && !error && projects.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground">
            No projects found in database. Check back later or log in to the admin panel to add them.
          </div>
        )}

        {!isLoading && !error && projects.length > 0 && (
          <div className="mt-16 space-y-16 md:space-y-24">
            {projects.map((project, i) => {
              const reversed = i % 2 === 1;
              return (
                <Reveal key={project._id || project.title}>
                  <article className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Image */}
                    <motion.a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      className={`group relative block ${reversed ? "lg:order-2" : ""}`}
                    >
                      <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-primary opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20" />
                      <div className="overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-card">
                        <div className="overflow-hidden rounded-2xl">
                          <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      </div>
                      <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full glass px-3 py-1.5 text-xs font-semibold text-foreground opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100">
                        View Live <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </motion.a>

                    {/* Content */}
                    <div className={reversed ? "lg:order-1" : ""}>
                      <span className="text-sm font-semibold text-primary">
                        Project {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                        {project.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                        >
                          Live Demo
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

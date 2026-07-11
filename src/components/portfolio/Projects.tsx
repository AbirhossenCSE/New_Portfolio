import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const {
    data: projects = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ProjectItem[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/projects`);
      if (!res.ok) {
        throw new Error("Failed to load projects from server.");
      }
      return res.json();
    },
  });

  // Sort projects by order ascending
  const sortedAll = [...projects].sort((a, b) => a.order - b.order);

  // Featured projects sorted by order ascending
  const featured = sortedAll.filter((p) => p.featured);

  // Non-featured projects sorted by order ascending
  const nonFeatured = sortedAll.filter((p) => !p.featured);

  // Build initialProjects: fill up to 4 with non-featured
  let initialProjects = featured.slice(0, 4);
  if (initialProjects.length < 4) {
    const needed = 4 - initialProjects.length;
    initialProjects = [...initialProjects, ...nonFeatured.slice(0, needed)];
  }

  // Build remainingProjects: all other projects not in initialProjects,
  // sorted featured first, then by order
  const initialIds = new Set(initialProjects.map((p) => p._id));
  const remainingProjects = sortedAll
    .filter((p) => !initialIds.has(p._id))
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.order - b.order;
    });

  const visibleProjects = isExpanded
    ? [...initialProjects, ...remainingProjects]
    : initialProjects;

  const isOdd = visibleProjects.length % 2 === 1;

  const handleToggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false);
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsExpanded(true);
    }
  };

  const renderProjectCard = (
    project: ProjectItem,
    index: number,
    isFullWidth: boolean = false,
  ) => {
    return (
      <article
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-lift relative",
          isFullWidth ? "md:flex-row md:items-stretch" : "",
        )}
      >
        {/* Image Container with Zoom effect */}
        <div
          className={cn(
            "relative aspect-[16/10] overflow-hidden rounded-t-3xl border-b border-border shrink-0",
            isFullWidth
              ? "md:aspect-auto md:w-1/2 md:rounded-tr-none md:rounded-l-3xl md:border-b-0 md:border-r"
              : "",
          )}
        >
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full glass px-3 py-1.5 text-xs font-semibold text-foreground opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100"
          >
            View Live <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Content Container */}
        <div className="flex flex-1 flex-col p-6 justify-between">
          <div className="flex-1">
            {/* Featured / Order indicator */}
            <div className="flex items-center gap-2">
              {project.featured && (
                <span className="rounded-full bg-gradient-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  Featured
                </span>
              )}
              <span className="text-xs font-semibold text-primary">
                Project {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3
              className={cn(
                "mt-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary leading-tight",
                isFullWidth ? "md:text-2xl" : "",
              )}
            >
              {project.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {project.description}
            </p>
          </div>

          <div>
            {/* Tech stack */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-secondary/40 px-2.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-lift"
              >
                Live Demo
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-foreground shadow-soft transition-all hover:border-primary/40 hover:text-primary"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section id="projects" ref={sectionRef} className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Selected work I'm proud of"
          description="Full-stack applications built with the MERN stack, Firebase, and modern tooling."
        />

        {/* Loading State */}
        {isLoading && (
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-card"
              >
                <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
                <div className="space-y-4 p-5 flex-1">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-12 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-12 w-full" />
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Skeleton className="h-9 flex-1 rounded-xl" />
                    <Skeleton className="h-9 flex-1 rounded-xl" />
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
            <h3 className="text-lg font-bold text-foreground">
              Unable to load projects
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              {(error as Error).message}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Retry connection
            </Button>
          </div>
        )}

        {/* Success State */}
        {!isLoading && !error && projects.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground">
            No projects found in database. Check back later or log in to the
            admin panel to add them.
          </div>
        )}

        {!isLoading && !error && projects.length > 0 && (
          <div className="space-y-12">
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
              {visibleProjects.map((project, i) => {
                const isLastItemAndOdd =
                  isOdd && i === visibleProjects.length - 1;
                return (
                  <Reveal
                    key={project._id || project.title}
                    className={isLastItemAndOdd ? "md:col-span-2" : ""}
                  >
                    {renderProjectCard(project, i, isLastItemAndOdd)}
                  </Reveal>
                );
              })}
            </div>

            {projects.length > 4 && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleToggleExpand}
                  className="cursor-pointer bg-gradient-primary text-primary-foreground font-semibold px-8 py-6 rounded-xl shadow-soft hover:shadow-lift transition-all duration-300"
                >
                  {isExpanded ? "Show Less" : "Load More"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

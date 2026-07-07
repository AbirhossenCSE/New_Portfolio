import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  return (
    <section id="projects" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Selected work I'm proud of"
          description="Full-stack applications built with the MERN stack, Firebase, and modern tooling."
        />

        <div className="mt-16 space-y-16 md:space-y-24">
          {projects.map((project, i) => {
            const reversed = i % 2 === 1;
            return (
              <Reveal key={project.title}>
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
      </div>
    </section>
  );
}

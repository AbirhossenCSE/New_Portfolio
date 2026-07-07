import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Cloud,
  Database,
  Layout,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { skillCategories } from "@/data/portfolio";
import { Reveal, staggerContainer, staggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

const categoryIcons: Record<string, LucideIcon> = {
  Frontend: Layout,
  Backend: Server,
  Database: Database,
  Tools: Wrench,
  Deployment: Cloud,
};

function SkillBar({ level }: { level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${level}%` } : { width: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full bg-gradient-primary"
      />
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative py-20 md:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-subtle" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Skills"
          title="Technologies I work with"
          description="A modern toolkit spanning the full stack — from pixel-perfect UI to reliable APIs."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, ci) => {
            const Icon = categoryIcons[cat.category] ?? Wrench;
            return (
              <Reveal key={cat.category} delay={ci * 0.06}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-card">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{cat.category}</h3>
                      <p className="text-xs text-muted-foreground">
                        {cat.skills.length} technologies
                      </p>
                    </div>
                  </div>

                  <motion.ul
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-40px" }}
                    className="space-y-4"
                  >
                    {cat.skills.map((skill) => (
                      <motion.li key={skill.name} variants={staggerItem}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {skill.name}
                          </span>
                          <span className="text-xs font-semibold text-primary">
                            {skill.level}%
                          </span>
                        </div>
                        <SkillBar level={skill.level} />
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {skill.description}
                        </p>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

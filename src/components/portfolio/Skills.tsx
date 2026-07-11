import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Cloud,
  Database,
  Layout,
  Server,
  Wrench,
  AlertCircle,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import {
  Reveal,
  staggerContainer,
  staggerItem,
} from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface SkillItem {
  _id?: string;
  name: string;
  description: string;
  level: number;
  category: string;
  order: number;
}

const categoryIcons: Record<string, LucideIcon> = {
  Frontend: Layout,
  Backend: Server,
  "Database & ORM": Database,
  Tools: Wrench,
  Deployment: Cloud,
};

const categoryOrderList = [
  "Frontend",
  "Backend",
  "Database & ORM",
  "Tools",
  "Deployment",
];

function SkillBar({ level }: { level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div
      ref={ref}
      className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
    >
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
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const {
    data: skills = [],
    isLoading,
    error,
    refetch,
  } = useQuery<SkillItem[]>({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/skills`);
      if (!res.ok) {
        throw new Error("Failed to load skills from server.");
      }
      return res.json();
    },
  });

  // Group flattened skills by category
  const groupedSkills = skills.reduce<Record<string, SkillItem[]>>(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {},
  );

  // Order categories and map to structure expected by renderer
  const categories = Object.keys(groupedSkills)
    .sort((a, b) => {
      const idxA = categoryOrderList.indexOf(a);
      const idxB = categoryOrderList.indexOf(b);
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    })
    .map((catName) => ({
      category: catName,
      skills: groupedSkills[catName].sort(
        (a, b) => a.order - b.order || a.name.localeCompare(b.name),
      ),
    }));

  return (
    <section id="skills" className="relative py-20 md:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-subtle" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Skills"
          title="Technologies I work with"
          description="A modern toolkit spanning the full stack — from pixel-perfect UI to reliable APIs."
        />

        {/* Loading State */}
        {isLoading && (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="mb-5 flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                      <Skeleton className="h-1.5 w-full rounded-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-14 flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <h3 className="text-lg font-bold text-foreground">
              Unable to load skills
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
        {!isLoading && !error && categories.length === 0 && (
          <div className="mt-14 text-center text-muted-foreground">
            No skills found in database. Check back later or log in to the admin
            panel to add them.
          </div>
        )}

        {!isLoading && !error && categories.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, ci) => {
              const Icon = categoryIcons[cat.category] ?? Wrench;
              return (
                <Reveal key={cat.category} delay={ci * 0.06}>
                  <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-card">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {cat.category}
                        </h3>
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
                        <motion.li
                          key={skill._id || skill.name}
                          variants={staggerItem}
                        >
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
        )}
      </div>
    </section>
  );
}

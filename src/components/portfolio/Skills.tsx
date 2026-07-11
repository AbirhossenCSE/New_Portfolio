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
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
      className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-muted"
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

function SkillCard({ skill }: { skill: SkillItem }) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card flex flex-col justify-between relative">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-foreground">
            {skill.name}
          </span>
          <span className="text-xs font-semibold text-primary">
            {skill.level}%
          </span>
        </div>

        <SkillBar level={skill.level} />
      </div>

      {skill.description && (
        <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {skill.description}
        </p>
      )}
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
          <div className="mt-14 space-y-8 animate-pulse">
            {/* Skeleton Tabs List */}
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto p-1.5 bg-muted/20 border border-border/10 rounded-2xl h-12 items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-xl" />
              ))}
            </div>

            {/* Skeleton Active Tab Header */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Skeleton Skills Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-5 shadow-soft h-[88px] flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
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

        {/* Empty State */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="mt-14 text-center text-muted-foreground">
            No skills found in database. Check back later or log in to the admin
            panel to add them.
          </div>
        )}

        {/* Success State */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="mt-14">
            <Tabs
              defaultValue={categories[0].category}
              className="w-full space-y-8"
            >
              <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/40 p-1.5 rounded-2xl border border-border/30 max-w-2xl mx-auto justify-center">
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat.category] ?? Wrench;
                  return (
                    <TabsTrigger
                      key={cat.category}
                      value={cat.category}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-soft"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{cat.category}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {categories.map((cat) => {
                const Icon = categoryIcons[cat.category] ?? Wrench;
                return (
                  <TabsContent
                    key={cat.category}
                    value={cat.category}
                    className="mt-6 focus-visible:outline-none"
                  >
                    <Reveal>
                      <div className="mb-6 flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
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

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {cat.skills.map((skill) => (
                          <SkillCard
                            key={skill._id || skill.name}
                            skill={skill}
                          />
                        ))}
                      </div>
                    </Reveal>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        )}
      </div>
    </section>
  );
}

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
import { getSkillIcon, getSkillColor } from "@/lib/skill-icons";
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
  icon?: string;
  badge?: string;
  level?: number;
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

const categoryDescriptions: Record<string, string> = {
  Frontend:
    "I build modern, responsive, and dynamic UIs with React.js. Reusable components & optimized performance.",
  Backend:
    "Robust, scalable server architectures, RESTful & GraphQL APIs, and asynchronous microservices.",
  "Database & ORM":
    "Efficient data modeling, query optimization, indexing, and seamless database interactions.",
  Tools:
    "Modern developer tooling, version control, CI/CD automation, and design-to-code workflows.",
  Deployment:
    "Cloud infrastructure, serverless deployments, containerization, and edge performance optimization.",
};

const categoryOrderList = [
  "Frontend",
  "Backend",
  "Database & ORM",
  "Tools",
  "Deployment",
];

function SkillCard({ skill }: { skill: SkillItem }) {
  const IconComponent = getSkillIcon(skill.icon, skill.name);
  const brandColor = getSkillColor(skill.name, skill.icon);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur-md shadow-soft transition-all duration-300 hover:border-border hover:shadow-lift"
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: brandColor,
      }}
    >
      {/* Subtle colored glow overlay on left border hover */}
      <div
        className="pointer-events-none absolute -left-2 top-0 bottom-0 w-16 opacity-15 transition-opacity duration-300 group-hover:opacity-35 blur-xl"
        style={{ backgroundColor: brandColor }}
      />

      {/* Original Brand SVG Icon inside rounded badge */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-card border border-border/80 shadow-soft transition-transform duration-300 group-hover:scale-110">
        <IconComponent
          className="h-6 w-6 text-xl"
          style={{ color: brandColor }}
        />
      </div>

      <h4 className="text-base font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary truncate">
        {skill.name}
      </h4>
    </motion.div>
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
    <section id="skills" className="relative py-12 md:py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-subtle" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Skills"
          title="Technologies I work with"
          description="A modern toolkit spanning the full stack — from pixel-perfect UI to reliable APIs."
        />

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 md:mt-10 space-y-8 animate-pulse">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card/80 p-4 shadow-soft flex items-center gap-3.5"
                >
                  <Skeleton className="h-11 w-11 rounded-2xl shrink-0" />
                  <Skeleton className="h-4 w-28 rounded" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 md:mt-10 flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-lg mx-auto">
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
          <div className="mt-8 md:mt-10 text-center text-muted-foreground">
            No skills found in database. Check back later or log in to the admin
            panel to add them.
          </div>
        )}

        {/* Success State */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="mt-8 md:mt-10">
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
                      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-soft">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground tracking-tight">
                              {cat.category}
                            </h3>
                            <p className="mt-0.5 text-xs text-muted-foreground max-w-xl leading-relaxed">
                              {categoryDescriptions[cat.category] ||
                                "Modern tools and frameworks for high-performance software development."}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                          <span className="h-[2px] w-12 bg-blue-500/40 rounded-full hidden md:inline-block" />
                          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
                            {cat.skills.length} technologies
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
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

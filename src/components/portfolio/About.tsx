import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Layers,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Download,
  ArrowRight,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import {
  Reveal,
  staggerContainer,
  staggerItem,
} from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const infoIcons = [MapPin, GraduationCap, Briefcase, Layers];

export function About() {
  const { data: profile, isLoading, error, refetch } = useProfile();

  if (isLoading) {
    return (
      <section id="about" className="relative py-20 md:py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="About Me"
            title="A little bit about who I am"
            description="Turning ideas into fast, elegant, and reliable web experiences."
          />
          <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <Skeleton className="h-7 w-3/4 rounded-xl" />
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-5 w-5/6 rounded" />
              <Skeleton className="h-5 w-4/5 rounded" />
              <div className="flex flex-wrap gap-2 pt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-9 w-24 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section
        id="about"
        className="relative py-24 flex items-center justify-center bg-background"
      >
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/15 flex items-center justify-center text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Failed to load profile details
          </h3>
          <p className="text-sm text-muted-foreground">
            The portfolio server might be offline or failed to respond.
          </p>
          <Button onClick={() => refetch()} className="cursor-pointer rounded-xl">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative py-12 md:py-16 overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/2 left-0 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About Me"
          title="Architecting digital products with passion"
          description="A detailed look into my background, engineering philosophy, and what drives my work."
        />

        <div className="mt-8 md:mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Portrait & Quick Stats */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Reveal className="relative mx-auto w-full">
              {/* Outer Decorative Gradient Frame */}
              <div className="absolute -inset-1.5 rounded-[2.2rem] bg-gradient-primary opacity-30 blur-xl transition-all duration-500 hover:opacity-50" />

              <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/80 p-2.5 shadow-card backdrop-blur-xl group">
                <div className="relative overflow-hidden rounded-[1.6rem]">
                  <img
                    src={profile.homeImage || profile.aboutImage}
                    alt={`${profile.name} portrait`}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Subtle Bottom Gradient for Badge Readability */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                  {/* Floating Status Badge overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-xs font-semibold text-white tracking-wide">
                        {profile.availability || "Open for Opportunities"}
                      </span>
                    </div>
                    <Code2 className="h-4 w-4 text-primary shrink-0" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Bio Paragraphs, Highlights & Tags */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Engineering & Design Philosophy</span>
              </div>
            </Reveal>

            <div className="space-y-3.5">
              {profile.aboutParagraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-[1.05rem] font-normal">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Core Highlights Checklist */}
            <Reveal delay={0.15}>
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-border/50">
                <div className="flex items-center gap-2.5 text-sm text-foreground font-medium">
                  <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span>Clean & Maintainable Code</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground font-medium">
                  <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span>Scalable Backend Architecture</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground font-medium">
                  <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span>User-Centric Responsive UI</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground font-medium">
                  <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span>Performance Optimization</span>
                </div>
              </div>
            </Reveal>

            {/* Interest & Tech Tags */}
            <Reveal delay={0.2}>
              <div className="pt-2 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Key Focus Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.aboutTags.map((tag) => (
                    <span
                      key={tag}
                      className="group flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-soft transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:scale-105 cursor-default"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 group-hover:bg-primary" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Action Bar */}
            {profile.resumeUrl && (
              <Reveal delay={0.25}>
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <Button
                    asChild
                    className="w-full sm:w-auto justify-center cursor-pointer rounded-xl bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-lift transition-all duration-300 px-6 py-5 font-semibold text-sm"
                  >
                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" /> Download Resume
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto justify-center cursor-pointer rounded-xl border-border hover:border-primary/50 hover:text-primary transition-all duration-300 px-6 py-5 font-semibold text-sm"
                  >
                    <a href="#contact">
                      Get In Touch <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* Quick Info Cards Bar (All 4 side-by-side in 1 row below section) */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {profile.quickInfo.map((info, i) => {
            const Icon = infoIcons[i % infoIcons.length];
            return (
              <motion.div
                key={info.label}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-4 shadow-soft backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-lift"
              >
                <div className="absolute top-0 right-0 h-16 w-16 -mr-4 -mt-4 rounded-full bg-primary/5 blur-xl group-hover:bg-primary/15 transition-all" />

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {info.label}
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm font-bold text-foreground leading-snug break-words">
                    {info.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

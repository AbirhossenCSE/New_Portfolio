import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Layers,
  AlertCircle,
  RefreshCw,
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
      <section id="about" className="relative py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="About Me"
            title="A little bit about who I am"
            description="Turning ideas into fast, elegant, and reliable web experiences."
          />
          <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="flex flex-col gap-6">
              <Skeleton className="aspect-[4/3] w-full rounded-[2rem]" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-6 w-full rounded" />
              <Skeleton className="h-6 w-5/6 rounded" />
              <Skeleton className="h-6 w-4/5 rounded" />
              <div className="flex flex-wrap gap-2 pt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
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
        className="relative py-25 md:py-32 flex items-center justify-center bg-background"
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
          <Button onClick={() => refetch()} className="cursor-pointer">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About Me"
          title="A little bit about who I am"
          description="Turning ideas into fast, elegant, and reliable web experiences."
        />

        <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="flex flex-col gap-6">
            <Reveal className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-primary opacity-15 blur-2xl" />
              <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-2 shadow-card">
                <img
                  src={profile.aboutImage}
                  alt={`${profile.name} portrait`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-[1.6rem] object-cover"
                />
              </div>
            </Reveal>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-2 gap-3"
            >
              {profile.quickInfo.map((info, i) => {
                const Icon = infoIcons[i % infoIcons.length];
                return (
                  <motion.div
                    key={info.label}
                    variants={staggerItem}
                    className="rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
                  >
                    <div className="mb-2 grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {info.label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                      {info.value}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="flex flex-col justify-center h-full">
            <div className="space-y-4">
              {profile.aboutParagraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-2">
                {profile.aboutTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

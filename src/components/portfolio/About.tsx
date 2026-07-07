import { motion } from "framer-motion";
import { Briefcase, GraduationCap, MapPin, Layers } from "lucide-react";
import { aboutParagraphs, aboutTags, profile, quickInfo } from "@/data/portfolio";
import { Reveal, staggerContainer, staggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

const infoIcons = [MapPin, GraduationCap, Briefcase, Layers];

export function About() {
  return (
    <section id="about" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About Me"
          title="A little bit about who I am"
          description="Turning ideas into fast, elegant, and reliable web experiences."
        />

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
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

          <div>
            <div className="space-y-4">
              {aboutParagraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-8 grid grid-cols-2 gap-3"
            >
              {quickInfo.map((info, i) => {
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
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{info.value}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-2">
                {aboutTags.map((tag) => (
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

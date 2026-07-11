import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Facebook,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { AnimatedCounter } from "./AnimatedCounter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const word = words[wordIndex % words.length];
    const done = text === word;
    const empty = text === "";

    let delay = deleting ? 45 : 90;
    if (done && !deleting) delay = 1600;
    if (empty && deleting) delay = 350;

    const timeout = setTimeout(() => {
      if (!deleting && done) {
        setDeleting(true);
      } else if (deleting && empty) {
        setDeleting(false);
        setWordIndex((i) => i + 1);
      } else {
        setText(
          deleting
            ? word.slice(0, text.length - 1)
            : word.slice(0, text.length + 1),
        );
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words]);

  return text;
}

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export function Hero() {
  const { data: profile, isLoading, error, refetch } = useProfile();
  const role = useTypewriter(profile?.roles || []);

  if (isLoading) {
    return (
      <section
        id="home"
        className="relative overflow-hidden pb-16 pt-32 sm:pt-36 md:pb-24 md:pt-40"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Skeleton className="h-8 w-44 rounded-full" />
            <Skeleton className="h-16 w-3/4 rounded-xl" />
            <Skeleton className="h-6 w-1/2 rounded-md" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-36 rounded-xl" />
              <Skeleton className="h-12 w-36 rounded-xl" />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <Skeleton className="aspect-square w-full rounded-[2rem]" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section
        id="home"
        className="relative overflow-hidden pb-16 pt-32 sm:pt-36 md:pb-24 md:pt-40 flex items-center justify-center"
      >
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/15 flex items-center justify-center text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Failed to load profile
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
    <section
      id="home"
      className="relative overflow-hidden pb-16 pt-32 sm:pt-36 md:pb-24 md:pt-40"
    >
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute -right-16 top-32 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-blob [animation-delay:-6s]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-blob [animation-delay:-12s]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--color-foreground) 12%, transparent) 1px, transparent 0)",
            backgroundSize: "36px 36px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Hi, I'm <span className="text-gradient">{profile.name}</span>
          </h1>

          <div className="mt-4 flex items-center text-xl font-semibold text-muted-foreground sm:text-2xl">
            <Sparkles className="mr-2 h-5 w-5 text-accent" />
            <span className="text-foreground">{role}</span>
            <span className="ml-0.5 inline-block h-6 w-0.5 animate-pulse bg-primary sm:h-7" />
          </div>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {profile.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              Download Resume
            </a>
            <button
              onClick={() => scrollTo("projects")}
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              Contact Me
            </button>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {[
              { icon: Github, href: profile.socials.github, label: "GitHub" },
              {
                icon: Linkedin,
                href: profile.socials.linkedin,
                label: "LinkedIn",
              },
              {
                icon: Facebook,
                href: profile.socials.facebook,
                label: "Facebook",
              },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:text-primary"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-primary opacity-20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-2 shadow-card">
            <img
              src={profile.homeImage}
              alt={`${profile.name} — Full-Stack Developer`}
              loading="eager"
              className="h-full w-full rounded-[1.6rem] object-cover"
            />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-5 top-10 rounded-2xl glass px-4 py-3 shadow-soft"
          >
            <p className="text-2xl font-extrabold text-foreground">
              <AnimatedCounter to={6} suffix="+" />
            </p>
            <p className="text-xs text-muted-foreground">Projects</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 bottom-10 rounded-2xl glass px-4 py-3 shadow-soft"
          >
            <p className="text-2xl font-extrabold text-foreground">
              <AnimatedCounter to={2} suffix="+" />
            </p>
            <p className="text-xs text-muted-foreground">Companies</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

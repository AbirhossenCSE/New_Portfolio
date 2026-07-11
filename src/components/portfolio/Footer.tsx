import { ArrowUp, Facebook, Github, Linkedin } from "lucide-react";
import { navItems, profile } from "@/data/portfolio";

const socials = [
  { icon: Github, href: profile.socials.github, label: "GitHub" },
  { icon: Linkedin, href: profile.socials.linkedin, label: "LinkedIn" },
  { icon: Facebook, href: profile.socials.facebook, label: "Facebook" },
];

export function Footer() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm text-center md:text-left">
            <button
              onClick={() => scrollTo("home")}
              className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-sm font-black text-primary-foreground">
                AH
              </span>
              Abir Hossen
            </button>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Full-Stack Developer building modern, scalable, and
              performance-driven web applications.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary/40 hover:text-primary"
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {profile.fullName}. All rights
            reserved.
          </p>
          <button
            onClick={() => scrollTo("home")}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
          >
            Back to top <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}

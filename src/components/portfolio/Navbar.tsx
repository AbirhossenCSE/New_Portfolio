import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { navItems, profile } from "@/data/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useTheme } from "@/hooks/useTheme";

const ids = navItems.map((n) => n.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2.5" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "glass py-2.5 shadow-soft"
            : "border border-transparent bg-transparent py-3"
        }`}
        style={{ marginInline: "1rem" }}
      >
        <button
          onClick={() => scrollTo("home")}
          className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight"
          aria-label="Go to top"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-sm font-black text-primary-foreground">
            AH
          </span>
          <span className="hidden sm:inline">
            Abir<span className="text-primary">.</span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  active === item.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {active === item.id ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/50 text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            Resume
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/50 text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mx-4 mt-2 overflow-hidden rounded-2xl glass p-2 shadow-soft lg:hidden"
          >
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                      active === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block rounded-xl bg-gradient-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                >
                  Download Resume
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

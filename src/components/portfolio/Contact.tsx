import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  CheckCircle2,
} from "lucide-react";
import { profile } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phoneIntl}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: profile.phone,
    href: profile.whatsapp,
  },
  {
    icon: MapPin,
    label: "Location",
    value: profile.location,
    href: undefined,
  },
];

const socials = [
  { icon: Linkedin, href: profile.socials.linkedin, label: "LinkedIn" },
  { icon: Github, href: profile.socials.github, label: "GitHub" },
  { icon: Facebook, href: profile.socials.facebook, label: "Facebook" },
];

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const rawMessage = String(data.get("message") ?? "").trim();

    const message = subject ? `${subject}\n\n${rawMessage}` : rawMessage;

    try {
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.status === 201) {
        setSent(true);
        form.reset();
        setTimeout(() => setSent(false), 4000);
      } else if (res.status === 400) {
        const errData = await res.json();
        if (errData.details && Array.isArray(errData.details)) {
          setError(errData.details.join(" "));
        } else {
          setError(errData.error || "Validation failed.");
        }
      } else if (res.status === 429) {
        setError("Too many messages sent, please try again later.");
      } else {
        setError("Something went wrong, please try again.");
      }
    } catch (err) {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 md:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-subtle" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Get In Touch"
          description="Feel free to reach out to me for collaborations, projects, or just a friendly hello. I'd love to connect with you!"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Left: contact info */}
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-card sm:p-8">
              <h3 className="text-xl font-bold text-foreground">
                Contact Details
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {profile.fullName} — let's build something great together.
              </p>

              <div className="mt-7 space-y-3">
                {contactInfo.map(({ icon: Icon, label, value, href }) => {
                  const inner = (
                    <div className="flex items-center gap-4 rounded-2xl border border-border bg-background/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {label}
                        </p>
                        <p className="truncate text-sm font-semibold text-foreground">
                          {value}
                        </p>
                      </div>
                    </div>
                  );
                  return href ? (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={label}>{inner}</div>
                  );
                })}
              </div>

              <div className="mt-auto pt-7">
                <p className="text-sm font-semibold text-foreground">
                  Follow me
                </p>
                <div className="mt-3 flex gap-3">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary/40 hover:text-primary"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.08}>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-border bg-card p-7 shadow-card sm:p-8"
            >
              <h3 className="text-xl font-bold text-foreground">
                Send a Message
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                I'll get back to you as soon as possible.
              </p>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Name" name="name" placeholder="Your name" />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
                <Field
                  label="Subject"
                  name="subject"
                  placeholder="How can I help?"
                />
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Write your message..."
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs text-destructive flex items-center gap-2">
                    <span className="font-semibold">Error:</span>
                    <span>{error}</span>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading || sent}
                  whileHover={loading || sent ? {} : { y: -2 }}
                  whileTap={loading || sent ? {} : { scale: 0.97 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-shadow hover:shadow-lift disabled:opacity-75 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : sent ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Message ready!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Message
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

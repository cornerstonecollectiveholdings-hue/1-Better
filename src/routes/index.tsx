import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { useState } from "react";

// ── Server function: waitlist submission ──────────────────────────
const submitWaitlist = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { name?: string; email?: string };
    if (!d.name || typeof d.name !== "string" || d.name.trim().length === 0) {
      throw new Error("Name is required");
    }
    if (!d.email || typeof d.email !== "string" || !d.email.includes("@")) {
      throw new Error("Valid email is required");
    }
    return { name: d.name.trim(), email: d.email.trim().toLowerCase() };
  })
  .handler(async ({ data }) => {
    const dir = path.resolve("data");
    const filePath = path.join(dir, "waitlist.json");

    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    let entries: { name: string; email: string; joinedAt: string }[] = [];
    if (existsSync(filePath)) {
      const raw = await readFile(filePath, "utf-8");
      entries = JSON.parse(raw);
    }

    // Prevent duplicate emails
    if (entries.some((e) => e.email === data.email)) {
      return { success: false, message: "You're already on the list!" };
    }

    entries.push({
      name: data.name,
      email: data.email,
      joinedAt: new Date().toISOString(),
    });

    await writeFile(filePath, JSON.stringify(entries, null, 2), "utf-8");
    return { success: true, message: "You're on the list! 🎉" };
  });

// ── Route ─────────────────────────────────────────────────────────
export const Route = createFileRoute("/")({
  component: Home,
});

// ── Theme icons (simple inline SVGs) ───────────────────────────────
const ThemeIcon = ({ type }: { type: "fitness" | "learning" | "sports" | "experiences" }) => {
  const paths: Record<string, JSX.Element> = {
    fitness: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M6.5 6.5L2 11l4.5 4.5M17.5 6.5L22 11l-4.5 4.5M10 2l2 20M8 6l8 12M6 8l12 4" />
      </svg>
    ),
    learning: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    sports: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        <path d="M2 12h20" />
      </svg>
    ),
    experiences: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  };
  return paths[type] ?? null;
};

// ── How It Works step data ─────────────────────────────────────────
const steps = [
  {
    number: "01",
    title: "Pick your theme",
    description: "Each month, we announce a new theme — Fitness, Learning, Sports, or Experiences. The anticipation is part of the journey.",
  },
  {
    number: "02",
    title: "Get your box",
    description: "Curated tools, prompts, and resources arrive at your door. Not stuff — a system for small, consistent growth.",
  },
  {
    number: "03",
    title: "Grow 1% daily",
    description: "Micro-challenges, reflections, and habits. One small step each day. No overwhelm, just progress.",
  },
  {
    number: "04",
    title: "Step out",
    description: "Every ~3 months, your box includes a voucher or ticket — a cooking class, a game, something real that pushes your comfort zone.",
  },
];

const themes = [
  { type: "fitness" as const, label: "Fitness", desc: "Movement, strength, and habits that stick — no gym intimidation required." },
  { type: "learning" as const, label: "Learning", desc: "Books, skills, and curiosity. Feed your mind one page at a time." },
  { type: "sports" as const, label: "Sports", desc: "Play, compete, or just have fun. Rediscover the joy of the game." },
  { type: "experiences" as const, label: "Experiences", desc: "Real-world adventures that push you just past comfortable." },
];

// ── Component ──────────────────────────────────────────────────────
function Home() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    try {
      const result = await submitWaitlist({ data: { name, email } });
      if (result.success) {
        setFormState("success");
        setMessage(result.message);
        form.reset();
      } else {
        setFormState("success"); // already on list is still a success
        setMessage(result.message);
      }
    } catch (err) {
      setFormState("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* ── Skip link ── */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-terracotta focus:text-white focus:px-4 focus:py-2 focus:rounded">
        Skip to content
      </a>

      {/* ── Header / Nav ── */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <a href="/" className="flex items-center gap-2 no-underline">
          <img src="/logo.png" alt="1% Better" className="h-10 w-auto" />
        </a>
        <nav className="flex items-center gap-6">
          <a
            href="/boxes"
            className="text-sm font-medium text-brand-stone hover:text-brand-charcoal transition-colors"
          >
            The Boxes
          </a>
          <a
            href="#waitlist"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-brand-terracotta text-white text-sm font-medium hover:bg-brand-terracotta/90 transition-colors"
          >
            Join the Waitlist
          </a>
        </nav>
      </header>

      <main id="main">
        {/* ── Hero ── */}
        <section className="px-6 pt-16 pb-24 md:pt-24 md:pb-32 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-brand-amber/20 text-brand-charcoal text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse" />
            Coming Summer 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-brand-charcoal leading-tight mb-6 max-w-3xl mx-auto">
            Be <span className="text-brand-terracotta">1% Better</span>{" "}
            <span className="block md:inline">every day.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-stone max-w-xl mx-auto mb-10 leading-relaxed">
            A monthly subscription box that helps you grow one small step at a time.
            Fitness, learning, sports, and real-world experiences — delivered to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-brand-terracotta text-white text-lg font-medium hover:bg-brand-terracotta/90 transition-colors shadow-card"
            >
              Join the Waitlist
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-brand-forest text-brand-forest text-lg font-medium hover:bg-brand-forest hover:text-brand-cream transition-colors"
            >
              How It Works
            </a>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="px-6 py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm font-medium text-brand-terracotta uppercase tracking-wider mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-brand-charcoal mb-14">
              Four steps. One percent.{" "}
              <span className="text-brand-stone font-normal">Every day.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="group">
                  <span className="text-5xl font-heading font-bold text-brand-amber/40 group-hover:text-brand-amber/70 transition-colors">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-heading font-semibold text-brand-charcoal mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-brand-stone leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Themes ── */}
        <section id="themes" className="px-6 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm font-medium text-brand-terracotta uppercase tracking-wider mb-3">
              Rotating Themes
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-brand-charcoal mb-14">
              Every month, something new.{" "}
              <span className="text-brand-stone font-normal">Never boring.</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {themes.map((theme) => (
                <div
                  key={theme.label}
                  className="group p-6 rounded-xl bg-white border border-brand-stone/15 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-brand-terracotta mb-4 group-hover:bg-brand-terracotta group-hover:text-white transition-colors">
                    <ThemeIcon type={theme.type} />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-brand-charcoal mb-2">
                    {theme.label}
                  </h3>
                  <p className="text-sm text-brand-stone leading-relaxed">{theme.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="px-6 py-20 md:py-28 bg-brand-forest text-white">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm font-medium text-brand-amber uppercase tracking-wider mb-3">
              Simple Pricing
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
              One box. One price.{" "}
              <span className="text-brand-amber">One percent.</span>
            </h2>
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-10 border border-white/10">
              <span className="text-sm font-medium text-brand-amber uppercase tracking-wider">Monthly</span>
              <div className="mt-4 mb-2">
                <span className="text-5xl font-heading font-bold">$45</span>
                <span className="text-brand-cream/60 text-lg ml-1">/mo</span>
              </div>
              <p className="text-brand-cream/70 mb-6">
                Free shipping. Cancel anytime.
              </p>
              <ul className="text-left space-y-3 mb-8">
                {[
                  "Curated theme box every month",
                  "Subtle daily growth prompts",
                  "Every ~3 months: an experience voucher",
                  "Quarterly & annual options coming soon",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-brand-cream/80">
                    <span className="text-brand-amber mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#waitlist"
                className="block w-full text-center px-6 py-3 rounded-full bg-brand-amber text-brand-charcoal font-semibold hover:bg-brand-amber/90 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </section>

        {/* ── Waitlist ── */}
        <section id="waitlist" className="px-6 py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-medium text-brand-terracotta uppercase tracking-wider mb-3">
              Join the Waitlist
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-brand-charcoal mb-4">
              Be the first to know.
            </h2>
            <p className="text-brand-stone leading-relaxed mb-10">
              We're launching soon. Sign up and we'll let you know the moment the first box is ready — plus
              an early-subscriber discount.
            </p>

            {formState === "success" ? (
              <div className="p-6 rounded-xl bg-brand-forest/10 border border-brand-forest/20">
                <p className="text-brand-forest font-medium text-lg">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="flex-1 px-5 py-3.5 rounded-full border border-brand-stone/30 bg-white text-brand-charcoal placeholder:text-brand-stone/60 focus:outline-none focus:ring-2 focus:ring-brand-terracotta/50 focus:border-brand-terracotta"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  required
                  className="flex-1 px-5 py-3.5 rounded-full border border-brand-stone/30 bg-white text-brand-charcoal placeholder:text-brand-stone/60 focus:outline-none focus:ring-2 focus:ring-brand-terracotta/50 focus:border-brand-terracotta"
                />
                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="px-8 py-3.5 rounded-full bg-brand-terracotta text-white font-medium hover:bg-brand-terracotta/90 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {formState === "submitting" ? "Joining..." : "Join"}
                </button>
              </form>
            )}
            {formState === "error" && (
              <p className="mt-4 text-red-600 text-sm">{message}</p>
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-auto px-6 py-12 border-t border-brand-stone/15">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="1% Better" className="h-8 w-auto opacity-70" />
            <span className="text-sm text-brand-stone">© 2026 1% Better</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-brand-stone">
            <a href="#" className="hover:text-brand-terracotta transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-terracotta transition-colors">TikTok</a>
            <a href="#" className="hover:text-brand-terracotta transition-colors">Podcast</a>
            <a href="/admin/waitlist" className="text-xs text-brand-stone/60 hover:text-brand-stone transition-colors lowercase">admin</a>
          </div>
        </div>
      </footer>
    </>
  );
}

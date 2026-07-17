import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/boxes")({
  component: BoxesPage,
});

// ── Box data ───────────────────────────────────────────────────────
const boxes = [
  {
    theme: "MOVEMENT",
    subtitle: "Fitness",
    tagline: "Get your body moving — no gym required.",
    items: [
      "Cork yoga block",
      "Resistance band set",
      "Pocket journal",
      "Workout towel",
    ],
    color: "bg-brand-terracotta",
    borderColor: "border-brand-terracotta/30",
    iconColor: "text-brand-terracotta",
    bgLight: "bg-brand-terracotta/5",
    verseNote: "Includes our monthly reflection card",
    badge: null,
  },
  {
    theme: "CURIOSITY",
    subtitle: "Learning",
    tagline: "Feed your mind. One small idea at a time.",
    items: [
      "Premium notebook",
      "Brass bookmark",
      "Daily question card deck",
      "Pencil set",
    ],
    color: "bg-brand-forest",
    borderColor: "border-brand-forest/30",
    iconColor: "text-brand-forest",
    bgLight: "bg-brand-forest/5",
    verseNote: "Includes our monthly reflection card",
    badge: null,
  },
  {
    theme: "CONNECTION",
    subtitle: "Experience",
    tagline: "Get out there. Try something new.",
    items: [
      "Insulated water bottle",
      "Premium socks",
      "Waterproof notepad",
      "Experience challenge card",
    ],
    color: "bg-brand-amber",
    borderColor: "border-brand-amber/40",
    iconColor: "text-brand-amber",
    bgLight: "bg-brand-amber/5",
    verseNote: "Includes our monthly reflection card",
    badge: "Quarterly Box",
  },
];

// ── Box item icon (small circle check) ─────────────────────────────
function BoxIcon({ theme }: { theme: string }) {
  const icons: Record<string, JSX.Element> = {
    MOVEMENT: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M6.5 6.5L2 11l4.5 4.5M17.5 6.5L22 11l-4.5 4.5M10 2l2 20M8 6l8 12M6 8l12 4" />
      </svg>
    ),
    CURIOSITY: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    CONNECTION: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  };
  return icons[theme] ?? null;
}

// ── Component ──────────────────────────────────────────────────────
function BoxesPage() {
  return (
    <>
      {/* ── Skip link ── */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-terracotta focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      {/* ── Header / Nav ── */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <a href="/" className="flex items-center gap-2 no-underline">
          <img src="/logo.png" alt="1% Better" className="h-10 w-auto" />
        </a>
        <nav className="flex items-center gap-6">
          <a
            href="/"
            className="text-sm font-medium text-brand-stone hover:text-brand-charcoal transition-colors"
          >
            Home
          </a>
          <a
            href="/boxes"
            className="text-sm font-medium text-brand-terracotta transition-colors"
          >
            The Boxes
          </a>
          <a
            href="/#waitlist"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-brand-terracotta text-white text-sm font-medium hover:bg-brand-terracotta/90 transition-colors"
          >
            Join the Waitlist
          </a>
        </nav>
      </header>

      <main id="main">
        {/* ── Page Hero ── */}
        <section className="px-6 pt-12 pb-20 md:pt-16 md:pb-24 max-w-6xl mx-auto text-center">
          <p className="text-sm font-medium text-brand-terracotta uppercase tracking-wider mb-3">
            The Boxes
          </p>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-brand-charcoal leading-tight mb-6">
            Three themes.{" "}
            <span className="text-brand-terracotta">Endless growth.</span>
          </h1>
          <p className="text-lg text-brand-stone max-w-xl mx-auto leading-relaxed">
            Each month, you'll receive a curated box around one of three themes —
            packed with tools and prompts designed to help you grow just 1% every day.
          </p>
        </section>

        {/* ── Box Cards ── */}
        <section className="px-6 pb-20 md:pb-28 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {boxes.map((box) => (
              <div
                key={box.theme}
                className={`group relative flex flex-col rounded-2xl border ${box.borderColor} ${box.bgLight} overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300`}
              >
                {/* Top color bar */}
                <div className={`h-2 w-full ${box.color}`} />

                {/* Badge */}
                {box.badge && (
                  <div className="absolute top-5 right-5">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-amber/20 text-brand-charcoal">
                      {box.badge}
                    </span>
                  </div>
                )}

                <div className="flex flex-col flex-1 p-6 pt-8">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl ${box.bgLight} flex items-center justify-center ${box.iconColor} mb-5 group-hover:scale-110 transition-transform`}
                  >
                    <BoxIcon theme={box.theme} />
                  </div>

                  {/* Theme label */}
                  <p className="text-xs font-semibold text-brand-stone uppercase tracking-widest mb-1">
                    {box.subtitle}
                  </p>
                  <h2 className="text-2xl font-heading font-bold text-brand-charcoal mb-3">
                    {box.theme}
                  </h2>

                  {/* Tagline */}
                  <p className="text-brand-stone leading-relaxed mb-6">
                    {box.tagline}
                  </p>

                  {/* Divider */}
                  <div className={`border-t ${box.borderColor} mb-5`} />

                  {/* Items */}
                  <h3 className="text-sm font-semibold text-brand-charcoal uppercase tracking-wider mb-3">
                    Inside the Box
                  </h3>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {box.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-brand-stone">
                        <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full ${box.color} flex items-center justify-center`}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-2.5 h-2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Verse hint */}
                  <div className={`rounded-xl ${box.bgLight} px-4 py-3 border ${box.borderColor}`}>
                    <p className="text-xs text-brand-stone flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 flex-shrink-0">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" />
                      </svg>
                      <span>{box.verseNote}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works (abridged) ── */}
        <section className="px-6 py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm font-medium text-brand-terracotta uppercase tracking-wider mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-brand-charcoal mb-4">
              Your monthly ritual.
            </h2>
            <p className="text-brand-stone leading-relaxed max-w-xl mx-auto mb-10">
              One box, delivered to your door. A theme, a set of tools, and a gentle
              nudge toward growth. No overwhelm — just one small step at a time.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-3xl mx-auto">
              <div>
                <span className="text-4xl font-heading font-bold text-brand-amber/40">01</span>
                <h3 className="text-lg font-heading font-semibold text-brand-charcoal mt-2 mb-2">
                  Unbox
                </h3>
                <p className="text-sm text-brand-stone leading-relaxed">
                  Open your monthly box. Discover the theme and curated items inside.
                </p>
              </div>
              <div>
                <span className="text-4xl font-heading font-bold text-brand-amber/40">02</span>
                <h3 className="text-lg font-heading font-semibold text-brand-charcoal mt-2 mb-2">
                  Engage
                </h3>
                <p className="text-sm text-brand-stone leading-relaxed">
                  Use the tools, prompts, and challenges. One small step each day.
                </p>
              </div>
              <div>
                <span className="text-4xl font-heading font-bold text-brand-amber/40">03</span>
                <h3 className="text-lg font-heading font-semibold text-brand-charcoal mt-2 mb-2">
                  Grow
                </h3>
                <p className="text-sm text-brand-stone leading-relaxed">
                  Over time, those 1% steps compound into real transformation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-brand-charcoal mb-4">
              Ready to get started?
            </h2>
            <p className="text-brand-stone leading-relaxed mb-8">
              Join the waitlist and be the first to know when our boxes launch.
            </p>
            <a
              href="/#waitlist"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-brand-terracotta text-white text-lg font-medium hover:bg-brand-terracotta/90 transition-colors shadow-card"
            >
              Join the Waitlist
            </a>
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
          </div>
        </div>
      </footer>
    </>
  );
}

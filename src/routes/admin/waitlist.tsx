import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { useState, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────
type WaitlistEntry = {
  name: string;
  email: string;
  joinedAt: string;
};

// ── Server function: read waitlist ───────────────────────────────────
// NOTE: This is a simple view for founders running from their garage.
// Auth should be added before this goes public — anyone with the URL
// can see the full waitlist. Add middleware or a token check before launch.
const getWaitlist = createServerFn({ method: "GET" }).handler(async () => {
  const filePath = path.resolve("data", "waitlist.json");

  if (!existsSync(filePath)) {
    return { entries: [], total: 0 };
  }

  const raw = await readFile(filePath, "utf-8");
  const entries: WaitlistEntry[] = JSON.parse(raw);

  // Sort by most recent first
  entries.sort(
    (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
  );

  return { entries, total: entries.length };
});

// ── Helpers ──────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Route ────────────────────────────────────────────────────────────
export const Route = createFileRoute("/admin/waitlist")({
  component: AdminWaitlist,
});

// ── Component ────────────────────────────────────────────────────────
function AdminWaitlist() {
  const [data, setData] = useState<{
    entries: WaitlistEntry[];
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWaitlist()
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load waitlist"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh bg-brand-cream">
      {/* ── Header ── */}
      <header className="px-6 py-4 border-b border-brand-stone/15 bg-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="no-underline">
              <img src="/logo.png" alt="1% Better" className="h-8 w-auto" />
            </a>
            <span className="text-sm text-brand-stone">/</span>
            <h1 className="text-lg font-heading font-semibold text-brand-terracotta">
              Waitlist
            </h1>
          </div>
          <a
            href="/"
            className="text-sm text-brand-stone hover:text-brand-terracotta transition-colors"
          >
            ← Back to site
          </a>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="px-6 py-8 max-w-5xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-brand-stone text-lg">Loading waitlist…</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : data ? (
          <>
            {/* ── Summary bar ── */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-heading font-semibold text-brand-charcoal">
                All Signups
              </h2>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-terracotta/10 text-brand-terracotta text-sm font-medium">
                <span className="font-semibold text-lg">{data.total}</span>
                <span>total</span>
              </div>
            </div>

            {data.entries.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-brand-stone/15">
                <p className="text-brand-stone text-lg">
                  No signups yet. Share the waitlist link!
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-brand-stone/15 overflow-hidden shadow-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-stone/15 bg-brand-cream">
                      <th className="text-left px-6 py-3 text-xs font-medium text-brand-stone uppercase tracking-wider">
                        Name
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-brand-stone uppercase tracking-wider">
                        Email
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-brand-stone uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.entries.map((entry, i) => (
                      <tr
                        key={entry.email}
                        className={
                          i < data.entries.length - 1
                            ? "border-b border-brand-stone/10"
                            : ""
                        }
                      >
                        <td className="px-6 py-3.5 text-sm text-brand-charcoal font-medium">
                          {entry.name}
                        </td>
                        <td className="px-6 py-3.5 text-sm text-brand-stone">
                          {entry.email}
                        </td>
                        <td className="px-6 py-3.5 text-sm text-brand-stone whitespace-nowrap">
                          {formatDate(entry.joinedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : null}
      </main>

      {/* ── Footer ── */}
      <footer className="mt-auto px-6 py-6 border-t border-brand-stone/15 text-center">
        <p className="text-xs text-brand-stone">
          1% Better — Waitlist Admin ·{" "}
          <a href="/" className="hover:text-brand-terracotta transition-colors">
            Back to site
          </a>
        </p>
      </footer>
    </div>
  );
}

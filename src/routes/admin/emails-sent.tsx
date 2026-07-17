import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────
type PendingEntry = {
  name: string;
  email: string;
  joinedAt: string;
};

// ── Server function: clear pending emails ────────────────────────────
const clearPendingEmails = createServerFn({ method: "POST" }).handler(async () => {
  const filePath = path.resolve("data", "pending-emails.json");

  if (!existsSync(filePath)) {
    return { count: 0, emails: [] as PendingEntry[] };
  }

  const raw = await readFile(filePath, "utf-8");
  const entries: PendingEntry[] = JSON.parse(raw);

  // Clear the file
  await writeFile(filePath, JSON.stringify([], null, 2), "utf-8");

  return { count: entries.length, emails: entries };
});

// ── Route ────────────────────────────────────────────────────────────
export const Route = createFileRoute("/admin/emails-sent")({
  component: AdminEmailsSent,
});

// ── Component ────────────────────────────────────────────────────────
function AdminEmailsSent() {
  const [result, setResult] = useState<{
    count: number;
    emails: PendingEntry[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClear = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clearPendingEmails();
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear pending emails");
    } finally {
      setLoading(false);
    }
  };

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
            <span className="text-sm text-brand-stone">admin</span>
            <span className="text-sm text-brand-stone">/</span>
            <h1 className="text-lg font-heading font-semibold text-brand-terracotta">
              Emails Sent
            </h1>
          </div>
          <a
            href="/admin/waitlist"
            className="text-sm text-brand-stone hover:text-brand-terracotta transition-colors"
          >
            ← Waitlist
          </a>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="px-6 py-8 max-w-5xl mx-auto">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-heading font-semibold text-brand-charcoal mb-4">
            Mark Pending Emails as Sent
          </h2>
          <p className="text-brand-stone mb-8 leading-relaxed">
            This clears the pending-emails queue. Use after you've sent welcome emails
            to all pending signups. The emails that were cleared will be shown below.
          </p>

          <button
            onClick={handleClear}
            disabled={loading}
            className="w-full px-6 py-3.5 rounded-full bg-brand-forest text-white font-medium hover:bg-brand-forest/90 disabled:opacity-50 transition-colors mb-8"
          >
            {loading ? "Clearing..." : "Mark All as Sent"}
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {result !== null && (
            <div className="p-6 rounded-xl bg-brand-forest/10 border border-brand-forest/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-heading font-bold text-brand-forest">
                  {result.count}
                </span>
                <span className="text-brand-stone">
                  {result.count === 1 ? "email" : "emails"} cleared
                </span>
              </div>

              {result.emails.length > 0 ? (
                <ul className="space-y-2">
                  {result.emails.map((entry) => (
                    <li
                      key={entry.email}
                      className="text-sm text-brand-charcoal bg-white rounded-lg px-4 py-2 border border-brand-stone/10"
                    >
                      <span className="font-medium">{entry.name}</span>{" "}
                      <span className="text-brand-stone">({entry.email})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-brand-stone">
                  No pending emails to clear.
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-auto px-6 py-6 border-t border-brand-stone/15 text-center">
        <p className="text-xs text-brand-stone">
          1% Better — Emails Admin ·{" "}
          <a href="/" className="hover:text-brand-terracotta transition-colors">
            Back to site
          </a>
        </p>
      </footer>
    </div>
  );
}

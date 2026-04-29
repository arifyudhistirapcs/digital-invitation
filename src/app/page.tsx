"use client";

import { useEffect, useState } from "react";

interface Guest {
  id: string;
  name: string;
  link: string;
  created_at: string;
}

export default function Home() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function fetchGuests() {
    const res = await fetch("/api/guests");
    const data = await res.json();
    if (Array.isArray(data)) setGuests(data);
  }

  useEffect(() => {
    fetchGuests();
  }, []);

  async function addGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || loading) return;
    setLoading(true);
    await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    await fetchGuests();
    setLoading(false);
  }

  async function deleteGuest(id: string) {
    await fetch("/api/guests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchGuests();
  }

  async function copyLink(link: string, id: string) {
    await navigator.clipboard.writeText(link);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:py-14">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-12">
        <p className="text-accent-light tracking-[0.3em] uppercase text-xs sm:text-sm mb-2">
          ✦ The Wedding of ✦
        </p>
        <h1
          className="text-3xl sm:text-5xl mb-2 text-foreground"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Yudhit &amp; Aryani
        </h1>
        <div className="flex items-center justify-center gap-3 my-4">
          <span className="h-px w-12 sm:w-20 bg-accent-light" />
          <span className="text-accent-light text-lg">❧</span>
          <span className="h-px w-12 sm:w-20 bg-accent-light" />
        </div>
        <p className="text-muted text-sm sm:text-base">
          Guest Invitation Link Generator
        </p>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-xl">
        <form onSubmit={addGuest} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama tamu (contoh: Fauzan & Putri)"
            className="flex-1 rounded-none border border-border bg-card px-4 py-3 text-sm sm:text-base text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent-light transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="rounded-none border border-accent bg-accent px-6 py-3 text-sm sm:text-base font-medium text-white tracking-wider uppercase hover:bg-accent-light hover:border-accent-light disabled:opacity-40 transition-colors"
          >
            {loading ? "..." : "Tambah"}
          </button>
        </form>

        {/* Counter */}
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px flex-1 bg-border" />
          <span className="text-muted text-xs sm:text-sm tracking-widest uppercase">
            Total Tamu: {guests.length}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Guest List */}
        {guests.length === 0 ? (
          <p className="text-center text-muted/60 text-sm italic py-8">
            Belum ada tamu yang ditambahkan
          </p>
        ) : (
          <ul className="space-y-3">
            {guests.map((g) => (
              <li
                key={g.id}
                className="border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="text-base sm:text-lg text-foreground"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {g.name}
                  </p>
                  <p className="truncate text-xs sm:text-sm text-muted/70 mt-0.5">
                    {g.link}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => copyLink(g.link, g.id)}
                    className="flex-1 sm:flex-none rounded-none border border-border px-4 py-1.5 text-xs sm:text-sm text-accent hover:bg-accent hover:text-white hover:border-accent transition-colors"
                  >
                    {copied === g.id ? "✓ Copied" : "Copy Link"}
                  </button>
                  <button
                    onClick={() => deleteGuest(g.id)}
                    className="rounded-none border border-border px-3 py-1.5 text-xs sm:text-sm text-muted hover:bg-red-800 hover:text-white hover:border-red-800 transition-colors"
                    aria-label={`Hapus ${g.name}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer ornament */}
      <div className="flex items-center justify-center gap-3 mt-12">
        <span className="h-px w-8 bg-border" />
        <span className="text-accent-light/50 text-xs tracking-[0.2em]">
          ✦
        </span>
        <span className="h-px w-8 bg-border" />
      </div>
    </main>
  );
}

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
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">💌 Undangan Digital</h1>
      <p className="text-sm text-gray-500 mb-6">
        Generate link undangan untuk setiap tamu
      </p>

      <form onSubmit={addGuest} className="flex gap-2 mb-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama tamu (contoh: Fauzan & Putri)"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "..." : "Tambah"}
        </button>
      </form>

      <div className="mb-4 text-sm text-gray-600">
        Total tamu: <span className="font-semibold">{guests.length}</span>
      </div>

      {guests.length === 0 ? (
        <p className="text-sm text-gray-400">Belum ada tamu.</p>
      ) : (
        <ul className="space-y-3">
          {guests.map((g) => (
            <li
              key={g.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{g.name}</p>
                <p className="truncate text-xs text-gray-400">{g.link}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => copyLink(g.link, g.id)}
                  className="rounded bg-gray-100 px-3 py-1 text-xs hover:bg-gray-200"
                >
                  {copied === g.id ? "✅ Copied" : "📋 Copy"}
                </button>
                <button
                  onClick={() => deleteGuest(g.id)}
                  className="rounded bg-red-50 px-3 py-1 text-xs text-red-600 hover:bg-red-100"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

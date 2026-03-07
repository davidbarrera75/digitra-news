"use client";

import { useState } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "cta" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-surface border border-border rounded-2xl p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-2">
        Recibe datos y tendencias del turismo
      </h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Un email semanal con lo más relevante del turismo en Latinoamérica. Sin spam.
      </p>
      {status === "success" ? (
        <p className="text-secondary font-medium">¡Suscrito! Revisa tu email.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="flex-1 px-4 py-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "..." : "Suscribirme"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-red-500 text-sm mt-3">Hubo un error. Intenta de nuevo.</p>
      )}
    </section>
  );
}

"use client";

interface RentalsCTAProps {
  variant?: "banner" | "sidebar" | "inline";
  articleId?: number;
}

export default function RentalsCTA({ variant = "banner", articleId }: RentalsCTAProps) {
  const handleClick = () => {
    if (articleId) {
      fetch("/api/cta-track", {
        method: "POST",
        body: JSON.stringify({
          articleId,
          ctaType: variant,
          ctaText: "Crea tu página gratis",
          destinationUrl: "https://digitra.rentals",
        }),
      });
    }
  };

  if (variant === "sidebar") {
    return (
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
        <p className="text-sm font-display font-semibold text-primary mb-2">
          ¿Tienes una propiedad vacacional?
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Crea tu página de reservas con IA y recibe huéspedes directos.
        </p>
        <a
          href="https://digitra.rentals"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block w-full text-center px-4 py-2.5 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Crea tu página gratis
        </a>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="my-8 p-5 bg-highlight/50 border border-amber-200 rounded-xl">
        <p className="text-sm text-body">
          <strong>¿Eres anfitrión?</strong>{" "}
          <a
            href="https://digitra.rentals"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="text-accent hover:underline font-medium"
          >
            Crea tu página de reservas gratis con Digitra Rentals →
          </a>
        </p>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-r from-primary to-slate-800 rounded-2xl p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
        ¿Tienes una propiedad vacacional?
      </h2>
      <p className="text-gray-300 mb-6 max-w-lg mx-auto">
        Crea tu página de reservas con inteligencia artificial y recibe huéspedes directos. Sin comisiones.
      </p>
      <a
        href="https://digitra.rentals"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors"
      >
        Crea tu página gratis →
      </a>
    </section>
  );
}

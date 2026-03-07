export const SITE_NAME = "Digitra News";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://digitra.news";
export const SITE_DESCRIPTION = "El primer medio turístico basado en datos de Latinoamérica. Precios de Airbnb, tendencias de viaje, destinos y análisis del mercado turístico.";

export const CATEGORIES = [
  { name: "Destinos", slug: "destinos", color: "#0EA5E9", description: "Guías, experiencias y rutas por ciudad" },
  { name: "Data Turismo", slug: "datos", color: "#10B981", description: "Precios, ocupación, rankings y reportes basados en datos" },
  { name: "Tendencias", slug: "tendencias", color: "#8B5CF6", description: "Búsquedas, proyecciones y análisis de la industria" },
  { name: "Alquiler Vacacional", slug: "alquiler-vacacional", color: "#F59E0B", description: "Tips para anfitriones, comparativas y guías de reserva" },
  { name: "Noticias", slug: "noticias", color: "#EF4444", description: "Curación diaria de noticias del sector turístico" },
] as const;

export const NAV_LINKS = CATEGORIES.map((c) => ({
  label: c.name,
  href: `/${c.slug}`,
}));

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

const POPULAR_CITIES = [
  { name: "Cartagena", href: "/pulse/cartagena" },
  { name: "Medellín", href: "/pulse/medellin" },
  { name: "Bogotá", href: "/pulse/bogota" },
  { name: "Santa Marta", href: "/pulse/santa-marta" },
  { name: "San Andrés", href: "/pulse/san-andres" },
];

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-7xl font-mono font-black text-accent mb-4">404</p>
      <h1 className="text-2xl font-display font-bold text-primary mb-2">
        Página no encontrada
      </h1>
      <p className="text-gray-500 mb-8">
        La página que buscas no existe o fue movida.
      </p>
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <Link
          href="/"
          className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white font-medium text-sm rounded-lg transition-colors"
        >
          Ir al inicio
        </Link>
        <Link
          href="/pulse"
          className="px-5 py-2.5 border border-gray-200 text-primary font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          Ver Pulse
        </Link>
        <Link
          href="/buscar"
          className="px-5 py-2.5 border border-gray-200 text-primary font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          Buscar
        </Link>
      </div>

      <div className="border-t border-gray-100 pt-6 mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Secciones</p>
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="px-3 py-1.5 text-xs border border-gray-100 rounded-full hover:bg-accent/10 hover:text-accent transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Destinos populares</p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_CITIES.map((city) => (
            <Link
              key={city.href}
              href={city.href}
              className="px-3 py-1.5 text-xs bg-gray-50 text-gray-600 rounded-full hover:bg-accent/10 hover:text-accent transition-colors"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

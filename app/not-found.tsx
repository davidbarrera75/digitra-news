import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-display font-bold text-primary mb-4">404</h1>
      <p className="text-lg text-gray-500 mb-8">
        La página que buscas no existe o fue movida.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
        <Link
          href="/"
          className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors"
        >
          Ir al inicio
        </Link>
        <Link
          href="/buscar"
          className="px-6 py-3 border border-border hover:bg-white text-primary font-medium rounded-lg transition-colors"
        >
          Buscar
        </Link>
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-4">O explora por sección:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="px-3 py-1.5 text-sm border border-border rounded-full hover:bg-white transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

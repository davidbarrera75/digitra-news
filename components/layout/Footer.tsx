import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-display font-bold text-white mb-3">
              {SITE_NAME}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              El primer medio turístico basado en datos de Latinoamérica.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 font-body">
              Secciones
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Digitra */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 font-body">
              Digitra
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://digitra.rentals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Digitra Rentals
                </a>
              </li>
              <li>
                <Link href="/pulse" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Pulse
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter mini */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 font-body">
              Newsletter
            </h4>
            <p className="text-gray-400 text-sm mb-3">
              Datos y tendencias del turismo en LATAM, cada semana.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Ir
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

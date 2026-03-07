import Link from "next/link";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Artículos", href: "/admin/articles" },
  { label: "Generar IA", href: "/admin/generate" },
  { label: "Curación", href: "/admin/curated" },
  { label: "Categorías", href: "/admin/categories" },
  { label: "Destinos", href: "/admin/destinations" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <Link href="/admin" className="text-sm font-bold">
              DN Admin
            </Link>
            <div className="flex items-center gap-4">
              {ADMIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/" className="text-xs text-gray-400 hover:text-white">
                Ver sitio →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}

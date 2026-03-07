interface PulseCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
  source?: string;
}

export default function PulseCard({ icon, title, children, source }: PulseCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
      {source && (
        <p className="text-[10px] text-gray-300 mt-3 pt-2 border-t border-gray-50">Fuente: {source}</p>
      )}
    </div>
  );
}

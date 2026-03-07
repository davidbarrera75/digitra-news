interface CategoryPillProps {
  name: string;
  color: string;
  size?: "sm" | "md";
}

export default function CategoryPill({ name, color, size = "sm" }: CategoryPillProps) {
  return (
    <span
      className={`category-pill ${size === "md" ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs"}`}
      style={{ backgroundColor: `${color}15`, color }}
    >
      {name}
    </span>
  );
}

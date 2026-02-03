import type { Category } from "../utils/mockData";

type CategoryListProps = {
  categories: Category[];
  activeCategoryId: string;
  onSelect: (id: string) => void;
};

export default function CategoryList({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryListProps) {
  return (
    <aside className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_50px_-35px_rgba(15,15,15,0.35)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        Categorias
      </p>
      <div className="mt-4">
        <label
          htmlFor="category-select"
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400"
        >
          Filtrar
        </label>
        <select
          id="category-select"
          value={activeCategoryId}
          onChange={(event) => onSelect(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
        >
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.count})
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}

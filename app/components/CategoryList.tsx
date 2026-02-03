import type { Category } from "../utils/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/40">
        <span>Categorias</span>
        <span>Filtro</span>
      </div>
      <Select value={activeCategoryId} onValueChange={onSelect}>
        <SelectTrigger
          id="category-select"
          className="h-11 w-full rounded-xl border-white/10 bg-[#202c33] text-sm font-medium text-white"
        >
          <SelectValue placeholder="Seleccionar" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-[#202c33] text-white">
          {categories.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name} ({item.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

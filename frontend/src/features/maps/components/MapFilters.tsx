import { Building2, Package } from "lucide-react";

interface MapFiltersProps {
  showProjects: boolean;
  showMaterials: boolean;
  onToggleProjects: () => void;
  onToggleMaterials: () => void;
}

export function MapFilters({
  showProjects,
  showMaterials,
  onToggleProjects,
  onToggleMaterials,
}: MapFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <span className="text-sm font-semibold text-gray-700">
        Map layers
      </span>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={showProjects}
          onChange={onToggleProjects}
          className="h-4 w-4 rounded"
        />

        <Building2 className="h-4 w-4 text-blue-600" />

        Projects
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={showMaterials}
          onChange={onToggleMaterials}
          className="h-4 w-4 rounded"
        />

        <Package className="h-4 w-4 text-emerald-600" />

        Available materials
      </label>
    </div>
  );
}
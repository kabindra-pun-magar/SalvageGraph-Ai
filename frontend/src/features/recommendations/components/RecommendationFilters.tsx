import type {
    RecommendationStatus,
} from "../services/recommendationService";

export type RecommendationFilter =
    | "ALL"
    | RecommendationStatus;

interface RecommendationFiltersProps {
    value: RecommendationFilter;
    onChange: (value: RecommendationFilter) => void;
}

const filters: {
    label: string;
    value: RecommendationFilter;
}[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
];

export function RecommendationFilters({
    value,
    onChange,
}: RecommendationFiltersProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
                const active = value === filter.value;

                return (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() => onChange(filter.value)}
                        aria-pressed={active}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                            active
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
}
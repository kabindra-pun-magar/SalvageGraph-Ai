import {
    ArrowUpRight,
    MapPin,
    Package,
    Truck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";

import type {
    Recommendation,
} from "../services/recommendationService";

interface RecommendationCardProps {
    recommendation: Recommendation;
}

function formatCurrency(
    value: number | string | null
): string {
    if (value === null || value === "") {
        return "Not available";
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "Not available";
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatStatus(status: string): string {
    return status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// function statusClasses(status: string): string {
//     switch (status) {
//         case "APPROVED":
//             return "bg-emerald-50 text-emerald-700";

//         case "REJECTED":
//             return "bg-red-50 text-red-700";

//         default:
//             return "bg-amber-50 text-amber-700";
//     }
// }

export function RecommendationCard({
    recommendation,
}: RecommendationCardProps) {
    const navigate = useNavigate();

    const match = recommendation.match;
    const material = match.material;
    const requirement = match.requirement;

    const environmental =
        recommendation.environmentalBenefit;

    const explanationLines =
        recommendation.explanation
            .split("\n")
            .map((line) => line.replace(/^✓\s*/, "").trim())
            .filter(Boolean);

    const openMatch = () => {
        navigate(
            `/requirements/${match.requirementId}/matches/${match.id}`
        );
    };

    return (
        <Card>
            <div className="space-y-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-slate-100 p-3">
                            <Package
                                size={23}
                                className="text-slate-700"
                            />
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                {material.type}
                                {material.subtype
                                    ? ` · ${material.subtype}`
                                    : ""}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Material code: {material.materialCode}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Project: {requirement.project.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge>
                            {formatStatus(recommendation.status)}
                        </Badge>

                        <div className="rounded-lg bg-slate-100 px-3 py-2">
                            <p className="text-xs text-slate-500">
                                Recommendation score
                            </p>

                            <p className="text-lg font-semibold text-slate-900">
                                {Number.isFinite(recommendation.score)
                                    ? `${recommendation.score.toFixed(2)} / 100`
                                    : "Not available"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">
                            Available quantity
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                            {material.quantity} {material.unit}
                        </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">
                            Estimated savings
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                            {formatCurrency(
                                recommendation.estimatedSaving
                            )}
                        </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                            <Truck size={14} />
                            Transport distance
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                            {match.distanceKm === null
                                ? "Not available"
                                : `${match.distanceKm.toLocaleString()} km`}
                        </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin size={14} />
                            Material location
                        </p>

                        <p className="mt-1 font-medium text-slate-900">
                            {material.location || "Not available"}
                        </p>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                        Recommendation explanation
                    </h4>

                    {explanationLines.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                            {explanationLines.map((line, index) => (
                                <li
                                    key={`${index}-${line}`}
                                    className="text-sm text-slate-600"
                                >
                                    • {line}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-2 text-sm text-slate-500">
                            No explanation is available.
                        </p>
                    )}
                </div>

                {environmental && (
                    <div className="rounded-lg border border-slate-200 p-4">
                        <h4 className="text-sm font-semibold text-slate-900">
                            Environmental estimate
                        </h4>

                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <p className="text-sm text-slate-600">
                                Estimated avoided material impact:{" "}
                                {environmental.estimatedAvoidedMaterialImpact
                                    ?? "Not available"}
                            </p>

                            <p className="text-sm text-slate-600">
                                Environmental score:{" "}
                                {environmental.environmentalScore
                                    ?? "Not available"}
                            </p>
                        </div>

                        <p className="mt-2 text-xs text-amber-700">
                            These figures are provisional estimates, not
                            independently validated environmental savings.
                        </p>

                        {environmental.methodology && (
                            <p className="mt-2 text-xs text-slate-500">
                                {environmental.methodology}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex justify-end border-t border-slate-100 pt-4">
                    <button
                        type="button"
                        onClick={openMatch}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                        View match details
                        <ArrowUpRight size={16} />
                    </button>
                </div>
            </div>
        </Card>
    );
}
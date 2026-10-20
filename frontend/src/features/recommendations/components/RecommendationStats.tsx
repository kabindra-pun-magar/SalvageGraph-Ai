import {
    CheckCircle2,
    Clock3,
    ListChecks,
    XCircle,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";

import type {
    Recommendation,
} from "../services/recommendationService";

interface RecommendationStatsProps {
    recommendations: Recommendation[];
}

export function RecommendationStats({
    recommendations,
}: RecommendationStatsProps) {
    const pending = recommendations.filter(
        (item) => item.status === "PENDING"
    ).length;

    const approved = recommendations.filter(
        (item) => item.status === "APPROVED"
    ).length;

    const rejected = recommendations.filter(
        (item) => item.status === "REJECTED"
    ).length;

    const stats = [
        {
            label: "Total recommendations",
            value: recommendations.length,
            icon: ListChecks,
        },
        {
            label: "Pending review",
            value: pending,
            icon: Clock3,
        },
        {
            label: "Approved",
            value: approved,
            icon: CheckCircle2,
        },
        {
            label: "Rejected",
            value: rejected,
            icon: XCircle,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <Card key={stat.label}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    {stat.label}
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-slate-900">
                                    {stat.value}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-100 p-3">
                                <Icon
                                    size={21}
                                    className="text-slate-700"
                                />
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
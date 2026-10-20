import { useMemo, useState } from "react";

import {
    AlertCircle,
    RefreshCw,
    Sparkles,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";

import { useRecommendations } from "../hooks/useRecommendations";

import { RecommendationCard } from "../components/RecommendationCard";

import { RecommendationFilters } from "../components/RecommendationFilters";

import type {
    RecommendationFilter,
} from "../components/RecommendationFilters";

import { RecommendationStats } from "../components/RecommendationStats";

export function RecommendationsPage() {
    const [filter, setFilter] =
        useState<RecommendationFilter>("ALL");

    const {
        data: recommendations,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useRecommendations();

    const filteredRecommendations = useMemo(() => {
        if (!recommendations) {
            return [];
        }

        const filtered =
            filter === "ALL"
                ? recommendations
                : recommendations.filter(
                    (item) => item.status === filter
                );

        return [...filtered].sort(
            (a, b) => b.score - a.score
        );
    }, [recommendations, filter]);

    if (isLoading) {
        return (
            <div className="space-y-5">
                <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-28 animate-pulse rounded-xl bg-slate-100"
                        />
                    ))}
                </div>

                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="h-64 animate-pulse rounded-xl bg-slate-100"
                    />
                ))}
            </div>
        );
    }

    if (isError || !recommendations) {
        const message =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred.";

        return (
            <Card>
                <div className="rounded-lg bg-red-50 p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle
                            size={22}
                            className="mt-0.5 text-red-600"
                        />

                        <div>
                            <h2 className="font-semibold text-red-800">
                                Unable to load recommendations
                            </h2>

                            <p className="mt-1 text-sm text-red-700">
                                {message}
                            </p>

                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
                            >
                                <RefreshCw size={15} />
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <Sparkles
                            size={24}
                            className="text-slate-700"
                        />

                        <h1 className="text-2xl font-semibold text-slate-900">
                            Recommendations
                        </h1>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        Explore ranked material reuse opportunities
                        based on the current matching system.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={isFetching ? "animate-spin" : ""}
                    />

                    Refresh
                </button>
            </div>

            <RecommendationStats
                recommendations={recommendations}
            />

            <div className="space-y-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Material reuse opportunities
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {filteredRecommendations.length}{" "}
                            {filteredRecommendations.length === 1
                                ? "recommendation"
                                : "recommendations"}{" "}
                            displayed
                        </p>
                    </div>

                    <RecommendationFilters
                        value={filter}
                        onChange={setFilter}
                    />
                </div>

                {filteredRecommendations.length === 0 ? (
                    <Card>
                        <div className="py-12 text-center">
                            <Sparkles
                                size={30}
                                className="mx-auto text-slate-400"
                            />

                            <h3 className="mt-3 font-semibold text-slate-900">
                                No recommendations found
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {filter === "ALL"
                                    ? "Recommendations will appear here when they are generated."
                                    : `There are no ${filter.toLowerCase()} recommendations.`}
                            </p>
                        </div>
                    </Card>
                ) : (
                    filteredRecommendations.map(
                        (recommendation) => (
                            <RecommendationCard
                                key={recommendation.id}
                                recommendation={recommendation}
                            />
                        )
                    )
                )}
            </div>
        </div>
    );
}
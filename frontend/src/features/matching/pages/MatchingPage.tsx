import { useMemo, useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Clock3,
    PackageSearch,
    RefreshCw,
    Search,
    Sparkles,
    Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

import { MatchCard } from "../components/MatchCard";

import { useRequirementMatches } from "../hooks/useRequirementMatches";
import { useRunMatching } from "../hooks/useRunMatching";

import { useAllRequirements } from "../../requirements/hooks/useRequirements";

export function MatchingPage() {
    const navigate = useNavigate();

    const [selectedRequirementId, setSelectedRequirementId] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [minimumScore, setMinimumScore] = useState("0");

    // Load requirements across the user's projects.
    const {
        data: requirements = [],
        isLoading: requirementsLoading,
        isError: requirementsError,
        refetch: refetchRequirements,
    } = useAllRequirements();

    // Find the selected requirement.
    const selectedRequirement = requirements.find(
        (requirement) => requirement.id === selectedRequirementId,
    );

    // Load existing matches for the selected requirement.
    const {
        data: matches = [],
        isLoading: matchesLoading,
        isError: matchesError,
        refetch: refetchMatches,
    } = useRequirementMatches(selectedRequirementId || undefined);

    // Run the matching engine.
    const runMatchingMutation = useRunMatching();

    // Sort matches by suitability score, highest first.
    const rankedMatches = useMemo(() => {
        return [...matches].sort(
            (a, b) =>
                (b.suitabilityScore ?? -1) -
                (a.suitabilityScore ?? -1),
        );
    }, [matches]);

    // Filter matches using the search, status, and minimum score.
    const filteredMatches = useMemo(() => {
        const query = search.trim().toLowerCase();
        const scoreThreshold = Number(minimumScore);

        return rankedMatches.filter((match) => {
            const matchesSearch =
                !query ||
                match.material.materialCode.toLowerCase().includes(query) ||
                match.material.type.toLowerCase().includes(query) ||
                (match.material.subtype ?? "")
                    .toLowerCase()
                    .includes(query) ||
                (match.material.location ?? "")
                    .toLowerCase()
                    .includes(query);

            const matchesStatus =
                statusFilter === "ALL" ||
                match.status.toUpperCase() === statusFilter;

            const score = match.suitabilityScore;

            const matchesScore =
                score !== null && score !== undefined
                    ? score >= scoreThreshold
                    : scoreThreshold === 0;

            return matchesSearch && matchesStatus && matchesScore;
        });
    }, [rankedMatches, search, statusFilter, minimumScore]);

    // Dashboard statistics.
    const highSuitabilityCount = matches.filter(
        (match) => (match.suitabilityScore ?? 0) >= 80,
    ).length;

    const pendingCount = matches.filter((match) =>
        ["PENDING", "NEEDS_INSPECTION"].includes(
            match.status.toUpperCase(),
        ),
    ).length;

    const totalEstimatedBenefit = matches.reduce(
        (total, match) => total + (match.economicBenefit ?? 0),
        0,
    );

    // Run matching for the selected requirement.
    const handleRunMatching = () => {
        if (!selectedRequirementId) {
            return;
        }

        runMatchingMutation.mutate(selectedRequirementId);
    };

    // Loading state.
    if (requirementsLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-28 animate-pulse rounded-xl bg-slate-100"
                        />
                    ))}
                </div>

                <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
            </div>
        );
    }

    // Requirements loading error.
    if (requirementsError) {
        return (
            <div className="space-y-6">
                <PageHeader />

                <Card>
                    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-5">
                        <AlertCircle
                            className="mt-0.5 text-red-600"
                            size={20}
                        />

                        <div className="flex-1">
                            <p className="font-semibold text-red-800">
                                Unable to load requirements
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                Check your connection and try loading the
                                requirements again.
                            </p>

                            <button
                                type="button"
                                onClick={() => void refetchRequirements()}
                                className="mt-3 rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <PageHeader />

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total matches"
                    value={matches.length}
                    detail="For the selected requirement"
                    icon={<PackageSearch size={20} />}
                />

                <StatCard
                    label="High suitability"
                    value={highSuitabilityCount}
                    detail="Suitability score of 80% or higher"
                    icon={<Target size={20} />}
                />

                <StatCard
                    label="Awaiting review"
                    value={pendingCount}
                    detail="Pending or inspection needed"
                    icon={<Clock3 size={20} />}
                />

                <StatCard
                    label="Estimated economic benefit"
                    value={formatBenefit(totalEstimatedBenefit)}
                    detail="Sum of returned match benefits"
                    icon={<Sparkles size={20} />}
                />
            </section>

            {/* Requirement selection and matching action */}
            <Card>
                <div className="space-y-5">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Find reusable materials
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Select a project's material requirement, then run
                            the matching engine to find candidate materials.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                        <div>
                            <label
                                htmlFor="matching-requirement"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Material requirement
                            </label>

                            <select
                                id="matching-requirement"
                                value={selectedRequirementId}
                                onChange={(event) =>
                                    setSelectedRequirementId(
                                        event.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                            >
                                <option value="">
                                    Select a requirement
                                </option>

                                {requirements.map((requirement) => (
                                    <option
                                        key={requirement.id}
                                        value={requirement.id}
                                    >
                                        {requirement.projectName} —{" "}
                                        {requirement.materialType}
                                        {requirement.subtype
                                            ? ` (${requirement.subtype})`
                                            : ""}{" "}
                                        · {requirement.quantity}{" "}
                                        {requirement.unit}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={handleRunMatching}
                            disabled={
                                !selectedRequirementId ||
                                runMatchingMutation.isPending
                            }
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    runMatchingMutation.isPending
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            {runMatchingMutation.isPending
                                ? "Running matching..."
                                : "Run Matching"}
                        </button>
                    </div>

                    {/* Selected requirement information */}
                    {selectedRequirement && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="info">
                                    {selectedRequirement.materialType}
                                </Badge>

                                {selectedRequirement.subtype && (
                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                        {selectedRequirement.subtype}
                                    </span>
                                )}

                                <span className="text-sm text-slate-500">
                                    Project: {selectedRequirement.projectName}
                                </span>
                            </div>

                            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                <RequirementDetail
                                    label="Required quantity"
                                    value={`${selectedRequirement.quantity} ${selectedRequirement.unit}`}
                                />

                                <RequirementDetail
                                    label="Required condition"
                                    value={
                                        selectedRequirement.requiredCondition ??
                                        "Not specified"
                                    }
                                />

                                <RequirementDetail
                                    label="Intended application"
                                    value={
                                        selectedRequirement.intendedApplication ||
                                        "Not specified"
                                    }
                                />

                                <RequirementDetail
                                    label="Dimensions"
                                    value={formatDimensions(
                                        selectedRequirement,
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {/* Empty requirements */}
                    {!requirements.length && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                            No requirements were found. Create a project and
                            add its material requirements before running
                            matching.

                            <button
                                type="button"
                                onClick={() => navigate("/requirements")}
                                className="ml-1 inline-flex items-center gap-1 font-semibold underline underline-offset-2"
                            >
                                View requirements
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    )}

                    {/* Matching error */}
                    {runMatchingMutation.isError && (
                        <div
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                        >
                            Matching could not be completed. Please try again.
                        </div>
                    )}

                    {/* Matching success */}
                    {runMatchingMutation.isSuccess && (
                        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                            <CheckCircle2 size={18} />

                            Matching completed. Results have been refreshed.
                        </div>
                    )}
                </div>
            </Card>

            {/* Matching results */}
            <section className="space-y-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Matching results
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {selectedRequirement
                                ? `Candidates for ${selectedRequirement.materialType} · ${selectedRequirement.projectName}`
                                : "Select a requirement to view its matches."}
                        </p>
                    </div>

                    {selectedRequirementId && (
                        <button
                            type="button"
                            onClick={() => void refetchMatches()}
                            disabled={matchesLoading}
                            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:self-auto"
                        >
                            <RefreshCw
                                size={15}
                                className={
                                    matchesLoading ? "animate-spin" : ""
                                }
                            />

                            Refresh results
                        </button>
                    )}
                </div>

                {/* No requirement selected */}
                {!selectedRequirementId ? (
                    <Card>
                        <div className="py-12 text-center">
                            <PackageSearch
                                size={42}
                                className="mx-auto text-slate-400"
                            />

                            <h3 className="mt-3 font-semibold text-slate-900">
                                Select a requirement to begin
                            </h3>

                            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                                Choose a requirement above to see saved matches,
                                or run matching to generate candidates.
                            </p>
                        </div>
                    </Card>
                ) : matchesLoading ? (
                    /* Matches loading */
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-52 animate-pulse rounded-xl bg-slate-100"
                            />
                        ))}
                    </div>
                ) : matchesError ? (
                    /* Matches error */
                    <Card>
                        <div className="rounded-lg border border-red-200 bg-red-50 p-5">
                            <p className="font-semibold text-red-800">
                                Unable to load matching results
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                Try refreshing the results or run matching
                                again.
                            </p>

                            <button
                                type="button"
                                onClick={() => void refetchMatches()}
                                className="mt-3 rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
                            >
                                Try again
                            </button>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Filters */}
                        <Card>
                            <div className="grid gap-3 md:grid-cols-3">
                                <div className="relative">
                                    <Search
                                        size={16}
                                        className="absolute left-3 top-3 text-slate-400"
                                    />

                                    <input
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search code, type, location..."
                                        aria-label="Search matches"
                                        className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="match-status"
                                        className="sr-only"
                                    >
                                        Filter by status
                                    </label>

                                    <select
                                        id="match-status"
                                        value={statusFilter}
                                        onChange={(event) =>
                                            setStatusFilter(event.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                                    >
                                        <option value="ALL">
                                            All statuses
                                        </option>
                                        <option value="PENDING">
                                            Pending
                                        </option>
                                        <option value="ACCEPTED">
                                            Accepted
                                        </option>
                                        <option value="REJECTED">
                                            Rejected
                                        </option>
                                        <option value="NEEDS_INSPECTION">
                                            Needs inspection
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="minimum-score"
                                        className="sr-only"
                                    >
                                        Minimum suitability score
                                    </label>

                                    <select
                                        id="minimum-score"
                                        value={minimumScore}
                                        onChange={(event) =>
                                            setMinimumScore(event.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                                    >
                                        <option value="0">
                                            Any suitability score
                                        </option>
                                        <option value="50">
                                            50% and above
                                        </option>
                                        <option value="70">
                                            70% and above
                                        </option>
                                        <option value="80">
                                            80% and above
                                        </option>
                                        <option value="90">
                                            90% and above
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-slate-500">
                                Showing {filteredMatches.length} of{" "}
                                {matches.length} matches
                            </p>
                        </Card>

                        {/* No saved matches */}
                        {matches.length === 0 ? (
                            <Card>
                                <div className="py-12 text-center">
                                    <PackageSearch
                                        size={42}
                                        className="mx-auto text-slate-400"
                                    />

                                    <h3 className="mt-3 font-semibold text-slate-900">
                                        No matches yet
                                    </h3>

                                    <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                                        Run matching for this requirement to
                                        find available materials that may be
                                        suitable.
                                    </p>
                                </div>
                            </Card>
                        ) : filteredMatches.length === 0 ? (
                            /* No matches for the current filters */
                            <Card>
                                <div className="py-10 text-center">
                                    <Search
                                        size={32}
                                        className="mx-auto text-slate-400"
                                    />

                                    <p className="mt-3 font-medium text-slate-900">
                                        No results match these filters
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setStatusFilter("ALL");
                                            setMinimumScore("0");
                                        }}
                                        className="mt-3 text-sm font-semibold text-slate-700 underline underline-offset-4"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            </Card>
                        ) : (
                            /* Ranked match cards */
                            <div className="space-y-5">
                                {filteredMatches.map((match, index) => (
                                    <MatchCard
                                        key={match.id}
                                        match={match}
                                        requirementId={selectedRequirementId}
                                        rank={index + 1}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Page header                                                                */
/* -------------------------------------------------------------------------- */

function PageHeader() {
    return (
        <header>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Sparkles size={16} />
                Reuse intelligence
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Material Matching
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Discover reusable construction materials for project
                requirements, compare suitability, and review potential economic
                benefits.
            </p>
        </header>
    );
}

/* -------------------------------------------------------------------------- */
/* Statistics card                                                            */
/* -------------------------------------------------------------------------- */

function StatCard({
    label,
    value,
    detail,
    icon,
}: {
    label: string;
    value: string | number;
    detail: string;
    icon: React.ReactNode;
}) {
    return (
        <Card>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-slate-500">{label}</p>

                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">{detail}</p>
                </div>

                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700">
                    {icon}
                </div>
            </div>
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/* Requirement detail                                                         */
/* -------------------------------------------------------------------------- */

function RequirementDetail({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div>
            <p className="text-xs text-slate-500">{label}</p>

            <p className="mt-1 font-medium text-slate-800">{value}</p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Formatting helpers                                                         */
/* -------------------------------------------------------------------------- */

function formatDimensions(requirement: {
    length: number | null;
    width: number | null;
    height: number | null;
    diameter: number | null;
}) {
    const dimensions = [
        requirement.length !== null
            ? `L ${requirement.length}`
            : null,
        requirement.width !== null
            ? `W ${requirement.width}`
            : null,
        requirement.height !== null
            ? `H ${requirement.height}`
            : null,
        requirement.diameter !== null
            ? `Ø ${requirement.diameter}`
            : null,
    ].filter(Boolean);

    return dimensions.length
        ? dimensions.join(" × ")
        : "Not specified";
}

function formatBenefit(value: number) {
    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
    }).format(value);
}
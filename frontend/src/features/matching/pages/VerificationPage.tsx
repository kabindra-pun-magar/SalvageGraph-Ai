import { useMemo, useState } from "react";

import { useQueries } from "@tanstack/react-query";

import {
    AlertCircle,
    CheckCircle,
    Clock,
    ClipboardCheck,
    Eye,
    FileCheck,
    LoaderCircle,
    Package,
    RefreshCw,
    Search,
    XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Card } from "../../../components/ui/Card";

import { useAllRequirements } from "../../requirements/hooks/useRequirements";

import { getRequirementMatches } from "../services/matchingService";

import type { Match } from "../services/matchingService";


type FilterStatus =
    | "ALL"
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED"
    | "NEEDS_INSPECTION";


interface RequirementItem {
    id: string;
    materialType: string;
    projectName?: string;
}


interface VerificationRecord {
    match: Match;
    requirementId: string;
    projectName: string;
}


export function VerificationPage() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const [activeFilter, setActiveFilter] =
        useState<FilterStatus>("ALL");

    const {
        data: requirements,
        isLoading: requirementsLoading,
        isError: requirementsError,
        refetch: refetchRequirements,
    } = useAllRequirements();

    const requirementList =
        (requirements ?? []) as RequirementItem[];

    const matchQueries = useQueries({
        queries: requirementList.map((requirement) => ({
            queryKey: ["matches", requirement.id],
            queryFn: () => getRequirementMatches(requirement.id),
            enabled: Boolean(requirement.id),
            retry: 1,
        })),
    });

    const isLoading =
        requirementsLoading ||
        matchQueries.some((query) => query.isLoading);

    const isError =
        requirementsError ||
        matchQueries.some((query) => query.isError);

    const records = useMemo<VerificationRecord[]>(() => {
        const result: VerificationRecord[] = [];

        requirementList.forEach((requirement, index) => {
            const matches = matchQueries[index]?.data ?? [];

            matches.forEach((match: Match) => {
                result.push({
                    match,
                    requirementId: requirement.id,
                    projectName: requirement.projectName ?? "Project",
                });
            });
        });

        return result;
    }, [requirementList, matchQueries]);

    const getRecordStatus = (match: Match): FilterStatus => {
        const recommendationStatus =
            match.recommendation?.status?.toUpperCase();

        const matchStatus = match.status.toUpperCase();

        if (
            matchStatus === "ACCEPTED" ||
            recommendationStatus === "APPROVED"
        ) {
            return "ACCEPTED";
        }

        if (
            matchStatus === "REJECTED" ||
            recommendationStatus === "REJECTED"
        ) {
            return "REJECTED";
        }

        if (
            matchStatus === "NEEDS_INSPECTION" ||
            recommendationStatus === "NEEDS_INSPECTION"
        ) {
            return "NEEDS_INSPECTION";
        }

        return "PENDING";
    };

    const counts = useMemo(() => {
        const result = {
            ALL: records.length,
            PENDING: 0,
            ACCEPTED: 0,
            REJECTED: 0,
            NEEDS_INSPECTION: 0,
        };

        records.forEach(({ match }) => {
            result[getRecordStatus(match)]++;
        });

        return result;
    }, [records]);

    const filteredRecords = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return records
            .filter(({ match }) => {
                if (activeFilter === "ALL") {
                    return true;
                }

                return getRecordStatus(match) === activeFilter;
            })
            .filter(({ match, projectName }) => {
                if (!normalizedSearch) {
                    return true;
                }

                return [
                    match.material.materialCode,
                    match.material.type,
                    match.material.subtype ?? "",
                    match.requirement.materialType,
                    projectName,
                    match.status,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(normalizedSearch);
            })
            .sort((a, b) => {
                const priority: Record<FilterStatus, number> = {
                    PENDING: 0,
                    NEEDS_INSPECTION: 1,
                    ACCEPTED: 2,
                    REJECTED: 3,
                    ALL: 4,
                };

                return (
                    priority[getRecordStatus(a.match)] -
                    priority[getRecordStatus(b.match)]
                );
            });
    }, [records, search, activeFilter]);

    const handleRefresh = async () => {
        await refetchRequirements();

        await Promise.all(
            matchQueries.map((query) => query.refetch())
        );
    };

    if (isLoading) {
        return <VerificationLoading />;
    }

    if (isError) {
        return (
            <div className="space-y-5">
                <PageHeader onRefresh={handleRefresh} />

                <Card>
                    <div className="flex flex-col items-center py-12 text-center">
                        <AlertCircle
                            size={36}
                            className="text-red-500"
                        />

                        <h2 className="mt-4 text-lg font-semibold text-slate-900">
                            Unable to load verification records
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Some requirements or matching results could
                            not be retrieved. Check your connection and
                            try again.
                        </p>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <PageHeader onRefresh={handleRefresh} />

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Pending Review"
                    value={counts.PENDING}
                    description="Awaiting a decision"
                    icon={<Clock size={21} />}
                    iconStyle="bg-blue-50 text-blue-700"
                />

                <StatCard
                    label="Accepted"
                    value={counts.ACCEPTED}
                    description="Approved for reuse"
                    icon={<CheckCircle size={21} />}
                    iconStyle="bg-emerald-50 text-emerald-700"
                />

                <StatCard
                    label="Rejected"
                    value={counts.REJECTED}
                    description="Rejected matches"
                    icon={<XCircle size={21} />}
                    iconStyle="bg-red-50 text-red-700"
                />

                <StatCard
                    label="Needs Inspection"
                    value={counts.NEEDS_INSPECTION}
                    description="Require further review"
                    icon={<ClipboardCheck size={21} />}
                    iconStyle="bg-amber-50 text-amber-700"
                />
            </section>

            {/* Records */}
            <Card>
                <div className="space-y-5">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Verification Records
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Review material matches and their current
                                verification status.
                            </p>
                        </div>

                        <div className="relative w-full lg:max-w-sm">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search material or project..."
                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                            />
                        </div>
                    </div>

                    {/* Status filters */}
                    <div className="flex flex-wrap gap-2">
                        <FilterButton
                            label="All"
                            count={counts.ALL}
                            active={activeFilter === "ALL"}
                            onClick={() => setActiveFilter("ALL")}
                        />

                        <FilterButton
                            label="Pending"
                            count={counts.PENDING}
                            active={activeFilter === "PENDING"}
                            onClick={() => setActiveFilter("PENDING")}
                        />

                        <FilterButton
                            label="Accepted"
                            count={counts.ACCEPTED}
                            active={activeFilter === "ACCEPTED"}
                            onClick={() => setActiveFilter("ACCEPTED")}
                        />

                        <FilterButton
                            label="Rejected"
                            count={counts.REJECTED}
                            active={activeFilter === "REJECTED"}
                            onClick={() => setActiveFilter("REJECTED")}
                        />

                        <FilterButton
                            label="Needs Inspection"
                            count={counts.NEEDS_INSPECTION}
                            active={
                                activeFilter === "NEEDS_INSPECTION"
                            }
                            onClick={() =>
                                setActiveFilter("NEEDS_INSPECTION")
                            }
                        />
                    </div>

                    {/* Table */}
                    {filteredRecords.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-center">
                            <Package
                                size={36}
                                className="text-slate-300"
                            />

                            <h3 className="mt-3 font-semibold text-slate-800">
                                No verification records found
                            </h3>

                            <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                                {records.length === 0
                                    ? "No matching records are available yet. Generate matches from the Matching page first."
                                    : "Try another status filter or search term."}
                            </p>

                            {records.length === 0 && (
                                <button
                                    type="button"
                                    onClick={() => navigate("/matching")}
                                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
                                >
                                    Go to Matching
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="text-xs text-slate-500">
                                Showing {filteredRecords.length} of{" "}
                                {records.length} records
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-y border-slate-200 bg-slate-50">
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Material
                                            </th>

                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Requirement
                                            </th>

                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Compatibility
                                            </th>

                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Condition
                                            </th>

                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Status
                                            </th>

                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {filteredRecords.map(
                                            ({
                                                match,
                                                requirementId,
                                                projectName,
                                            }) => {
                                                const status =
                                                    getRecordStatus(match);

                                                return (
                                                    <tr
                                                        key={match.id}
                                                        className="transition hover:bg-slate-50"
                                                    >
                                                        <td className="px-4 py-4">
                                                            <p className="font-semibold text-slate-900">
                                                                {
                                                                    match.material.materialCode
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-sm text-slate-500">
                                                                {
                                                                    match.material.type
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-400">
                                                                {projectName}
                                                            </p>
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <p className="text-sm font-medium text-slate-800">
                                                                {
                                                                    match.requirement.materialType
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {formatNumber(
                                                                    match.requirement.quantity
                                                                )}{" "}
                                                                {
                                                                    match.requirement.unit
                                                                }{" "}
                                                                required
                                                            </p>
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <ScoreValue
                                                                value={
                                                                    match.compatibilityScore
                                                                }
                                                            />
                                                        </td>

                                                        <td className="px-4 py-4 text-sm text-slate-700">
                                                            {match.material.conditionScore !==
                                                            null
                                                                ? `${formatNumber(match.material.conditionScore)}%`
                                                                : "Not assessed"}
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <StatusBadge
                                                                status={status}
                                                            />
                                                        </td>

                                                        <td className="px-4 py-4 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/requirements/${requirementId}/matches/${match.id}`
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                                                            >
                                                                <Eye
                                                                    size={16}
                                                                />

                                                                Review
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}


/* -------------------------------------------------------
   Components
------------------------------------------------------- */

function PageHeader({
    onRefresh,
}: {
    onRefresh: () => void;
}) {
    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3">
                        <FileCheck
                            size={25}
                            className="text-blue-700"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                            Verification
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Review and manage reusable material matches.
                        </p>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={onRefresh}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
                <RefreshCw size={16} />
                Refresh
            </button>
        </div>
    );
}


function StatCard({
    label,
    value,
    description,
    icon,
    iconStyle,
}: {
    label: string;
    value: number;
    description: string;
    icon: React.ReactNode;
    iconStyle: string;
}) {
    return (
        <Card>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm text-slate-500">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                        {description}
                    </p>
                </div>

                <div className={`shrink-0 rounded-xl p-3 ${iconStyle}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
}


function FilterButton({
    label,
    count,
    active,
    onClick,
}: {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
        >
            {label}

            <span
                className={`rounded-md px-1.5 py-0.5 text-xs ${
                    active
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-600"
                }`}
            >
                {count}
            </span>
        </button>
    );
}


function ScoreValue({
    value,
}: {
    value: number | null;
}) {
    if (value === null) {
        return (
            <span className="text-sm text-slate-400">
                N/A
            </span>
        );
    }

    const score = Math.max(0, Math.min(100, value));

    return (
        <div className="min-w-28">
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-800">
                    {formatNumber(value)}%
                </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}


function StatusBadge({
    status,
}: {
    status: FilterStatus;
}) {
    const styles: Record<FilterStatus, string> = {
        ALL: "border-slate-200 bg-slate-100 text-slate-700",
        PENDING: "border-blue-200 bg-blue-50 text-blue-700",
        ACCEPTED: "border-emerald-200 bg-emerald-50 text-emerald-700",
        REJECTED: "border-red-200 bg-red-50 text-red-700",
        NEEDS_INSPECTION:
            "border-amber-200 bg-amber-50 text-amber-800",
    };

    const labels: Record<FilterStatus, string> = {
        ALL: "All",
        PENDING: "Pending",
        ACCEPTED: "Accepted",
        REJECTED: "Rejected",
        NEEDS_INSPECTION: "Needs Inspection",
    };

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
        >
            {labels[status]}
        </span>
    );
}


function VerificationLoading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <LoaderCircle
                    size={24}
                    className="animate-spin text-slate-500"
                />

                <p className="text-sm text-slate-500">
                    Loading verification records...
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-32 animate-pulse rounded-xl bg-slate-100"
                    />
                ))}
            </div>

            <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
        </div>
    );
}


function formatNumber(value: number): string {
    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
    }).format(value);
}
import {
    ArrowLeft,
    CheckCircle,
    ClipboardList,
    Package,
    MapPin,
    TrendingUp,
    CalendarCheck,
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { Card } from "../../../components/ui/Card";


import { VerificationActions } from "../components/VerificationActions";

import { MatchScoreBreakdown } from "../components/MatchScoreBreakdown";

import { MatchBenefits } from "../components/MatchBenefits";

import { MatchComparison } from "../components/MatchComparison";

import { useRequirementMatches } from "../hooks/useRequirementMatches";



export function MatchDetailsPage() {
    const {
        requirementId,
        matchId,
    } = useParams<{
        requirementId: string;
        matchId: string;
    }>();

    const navigate = useNavigate();

    const {
        data: matches,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useRequirementMatches(requirementId);

    const match = matches?.find(
        (item) => item.id === matchId
    );

    const handleBack = () => {
        if (requirementId) {
            navigate(`/requirements/${requirementId}/matches`);
            return;
        }

        navigate("/matching");
    };

    if (isLoading) {
        return <MatchDetailsSkeleton />;
    }

    if (isError) {
        return (
            <div className="space-y-5">
                <BackButton onClick={handleBack} />

                <Card>
                    <div className="flex flex-col items-center py-10 text-center">
                        <div className="rounded-full bg-red-50 p-4">
                            <AlertCircle
                                size={30}
                                className="text-red-600"
                            />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-slate-900">
                            Unable to load match details
                        </h2>

                        <p className="mt-2 max-w-md text-sm text-slate-500">
                            Something went wrong while retrieving the
                            matching information. Please try again.
                        </p>

                        {error instanceof Error && (
                            <p className="mt-2 max-w-md break-words text-xs text-slate-400">
                                {error.message}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    isFetching ? "animate-spin" : ""
                                }
                            />

                            {isFetching ? "Retrying..." : "Try again"}
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    if (!match) {
        return (
            <div className="space-y-5">
                <BackButton onClick={handleBack} />

                <Card>
                    <div className="flex flex-col items-center py-10 text-center">
                        <div className="rounded-full bg-slate-100 p-4">
                            <Package
                                size={30}
                                className="text-slate-500"
                            />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-slate-900">
                            Match not found
                        </h2>

                        <p className="mt-2 max-w-md text-sm text-slate-500">
                            This match may no longer be available, or
                            it may not belong to the selected requirement.
                        </p>

                        <button
                            type="button"
                            onClick={handleBack}
                            className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                        >
                            Return to matches
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">

            {/* Navigation */}
            <BackButton onClick={handleBack} />

            {/* Page header */}
            <section className="space-y-4">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                Match Review
                            </h1>

                            <StatusBadge status={match.status} />
                        </div>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Review the material, compare it with the
                            project requirement, and verify whether it
                            is suitable for reuse.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Match reference
                        </p>

                        <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">
                            {match.id}
                        </p>
                    </div>
                </div>
            </section>

            {/* Match overview */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                <OverviewCard
                    icon={<TrendingUp size={20} />}
                    label="Compatibility score"
                    value={formatScore(match.compatibilityScore)}
                    description="Overall matching compatibility"
                />

                <OverviewCard
                    icon={<Package size={20} />}
                    label="Available material"
                    value={`${formatNumber(match.material.quantity)} ${match.material.unit}`}
                    description={match.material.materialCode}
                />

                <OverviewCard
                    icon={<MapPin size={20} />}
                    label="Distance"
                    value={
                        match.distanceKm !== null
                            ? `${formatNumber(match.distanceKm)} km`
                            : "Not available"
                    }
                    description="Estimated distance to source"
                />

                <OverviewCard
                    icon={<CalendarCheck size={20} />}
                    label="Review status"
                    value={formatStatus(match.status)}
                    description="Current verification state"
                />

            </section>

            {/* Main information */}
            <section className="grid gap-6 xl:grid-cols-2">

                {/* Available material */}
                <Card>
                    <div className="flex items-start gap-4">
                        <div className="shrink-0 rounded-xl bg-blue-50 p-3">
                            <Package
                                size={24}
                                className="text-blue-700"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Available resource
                            </p>

                            <h2 className="mt-1 break-words text-xl font-semibold text-slate-900">
                                {match.material.materialCode}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {match.material.type}

                                {match.material.subtype
                                    ? ` • ${match.material.subtype}`
                                    : ""}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <InfoItem
                            label="Available quantity"
                            value={`${formatNumber(match.material.quantity)} ${match.material.unit}`}
                        />

                        <InfoItem
                            label="Condition score"
                            value={
                                match.material.conditionScore !== null
                                    ? `${formatNumber(match.material.conditionScore)}%`
                                    : "Not assessed"
                            }
                        />

                        <InfoItem
                            label="Material type"
                            value={match.material.type}
                        />

                        <InfoItem
                            label="Subtype"
                            value={match.material.subtype ?? "Not specified"}
                        />
                    </div>

                    {match.material.location && (
                        <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3">
                            <MapPin
                                size={17}
                                className="mt-0.5 shrink-0 text-slate-500"
                            />

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Material location
                                </p>

                                <p className="mt-1 break-words text-sm text-slate-800">
                                    {match.material.location}
                                </p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Project requirement */}
                <Card>
                    <div className="flex items-start gap-4">
                        <div className="shrink-0 rounded-xl bg-violet-50 p-3">
                            <ClipboardList
                                size={24}
                                className="text-violet-700"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Project requirement
                            </p>

                            <h2 className="mt-1 break-words text-xl font-semibold text-slate-900">
                                {match.requirement.materialType}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Required material specifications
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <InfoItem
                            label="Required quantity"
                            value={`${formatNumber(match.requirement.quantity)} ${match.requirement.unit}`}
                        />

                        <InfoItem
                            label="Required condition"
                            value={
                                match.requirement.requiredCondition !== null
                                    ? `${formatNumber(match.requirement.requiredCondition)}%`
                                    : "Not specified"
                            }
                        />

                        <InfoItem
                            label="Material subtype"
                            value={match.requirement.subtype ?? "Not specified"}
                        />

                        <InfoItem
                            label="Intended application"
                            value={
                                match.requirement.intendedApplication ??
                                "Not specified"
                            }
                        />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <InfoItem
                            label="Required length"
                            value={formatDimension(match.requirement.length)}
                        />

                        <InfoItem
                            label="Required width"
                            value={formatDimension(match.requirement.width)}
                        />

                        <InfoItem
                            label="Required height"
                            value={formatDimension(match.requirement.height)}
                        />

                        <InfoItem
                            label="Required diameter"
                            value={formatDimension(match.requirement.diameter)}
                        />
                    </div>
                </Card>

            </section>

            {/* Material compatibility */}
            <section className="space-y-3">
                <SectionHeading
                    title="Compatibility analysis"
                    description="Compare the available material against the requested specifications."
                />

                <MatchComparison
                    requirement={{
                        materialType: match.requirement.materialType,
                        quantity: match.requirement.quantity,
                        unit: match.requirement.unit,
                        requiredCondition: match.requirement.requiredCondition,
                        intendedApplication: match.requirement.intendedApplication,
                    }}
                    material={{
                        type: match.material.type,
                        quantity: match.material.quantity,
                        unit: match.material.unit,
                        conditionScore: match.material.conditionScore,
                        subtype: match.material.subtype,
                    }}
                />
            </section>

            {/* Score breakdown */}
            <section className="space-y-3">
                <SectionHeading
                    title="Match score breakdown"
                    description="Review the individual scoring factors contributing to this match."
                />

                <MatchScoreBreakdown
                    compatibilityScore={match.compatibilityScore}
                    conditionScore={match.conditionScore}
                    quantityScore={match.quantityScore}
                    dimensionScore={match.dimensionScore}
                    suitabilityScore={match.suitabilityScore}
                />
            </section>

            {/* Economic and environmental benefits */}
            <section className="space-y-3">
                <SectionHeading
                    title="Reuse benefits"
                    description="Review the estimated transport cost, economic value, and environmental impact."
                />

                <MatchBenefits
                    distanceKm={match.distanceKm}
                    transportCost={match.transportCost}
                    economicBenefit={match.economicBenefit}
                    environmentalBenefit={
                        match.recommendation?.environmentalBenefit
                    }
                />
            </section>

            {/* Recommendation */}
            {match.recommendation && (
                <Card>
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 rounded-xl bg-emerald-50 p-3">
                            <CheckCircle
                                size={22}
                                className="text-emerald-700"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Recommendation
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                AI-assisted matching recommendation
                            </p>

                            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
                                {match.recommendation.explanation}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="text-xs font-medium text-slate-500">
                                    Recommendation status:
                                </span>

                                <StatusBadge
                                    status={match.recommendation.status}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Verification actions */}
            <section
                id="verification"
                className="scroll-mt-6 space-y-3"
            >
                <SectionHeading
                    title="Verification and decision"
                    description="Review the evidence before accepting, rejecting, or requesting further inspection."
                />

                <Card>
                    <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0 text-amber-700"
                        />

                        <div>
                            <p className="text-sm font-semibold text-amber-900">
                                Review before making a decision
                            </p>

                            <p className="mt-1 text-sm leading-6 text-amber-800">
                                Check material compatibility, available
                                quantity, condition, and transport
                                implications. Request an inspection if
                                the material requires physical verification.
                            </p>
                        </div>
                    </div>

                    <VerificationActions
                        matchId={match.id}
                        requirementId={requirementId!}
                        currentStatus={match.status}
                    />
                </Card>
            </section>

        </div>
    );
}


/* -------------------------------------------------------
   Reusable UI components
------------------------------------------------------- */

function BackButton({
    onClick,
}: {
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
            <ArrowLeft size={17} />
            Back to matches
        </button>
    );
}


function SectionHeading({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div>
            <h2 className="text-lg font-semibold text-slate-900">
                {title}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
                {description}
            </p>
        </div>
    );
}


function OverviewCard({
    icon,
    label,
    value,
    description,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    description: string;
}) {
    return (
        <Card>
            <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-lg bg-slate-100 p-2.5 text-slate-700">
                    {icon}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-500">
                        {label}
                    </p>

                    <p className="mt-1 break-words text-xl font-bold text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 break-words text-xs leading-5 text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
        </Card>
    );
}


function InfoItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                {value}
            </p>
        </div>
    );
}


function StatusBadge({
    status,
}: {
    status: string;
}) {
    const normalizedStatus = status.toUpperCase();

    let className =
        "border-slate-200 bg-slate-100 text-slate-700";

    if (
        normalizedStatus === "ACCEPTED" ||
        normalizedStatus === "APPROVED"
    ) {
        className =
            "border-emerald-200 bg-emerald-50 text-emerald-700";
    } else if (
        normalizedStatus === "REJECTED"
    ) {
        className =
            "border-red-200 bg-red-50 text-red-700";
    } else if (
        normalizedStatus === "NEEDS_INSPECTION"
    ) {
        className =
            "border-amber-200 bg-amber-50 text-amber-800";
    } else if (
        normalizedStatus === "EVALUATED"
    ) {
        className =
            "border-blue-200 bg-blue-50 text-blue-700";
    }

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${className}`}
        >
            {formatStatus(status)}
        </span>
    );
}


function MatchDetailsSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-5 w-32 rounded bg-slate-200" />

            <div className="space-y-3">
                <div className="h-8 w-64 max-w-full rounded bg-slate-200" />
                <div className="h-4 w-96 max-w-full rounded bg-slate-100" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-28 rounded-xl border border-slate-100 bg-slate-50"
                    />
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-72 rounded-xl border border-slate-100 bg-slate-50"
                    />
                ))}
            </div>

            <div className="h-56 rounded-xl border border-slate-100 bg-slate-50" />
            <div className="h-48 rounded-xl border border-slate-100 bg-slate-50" />
        </div>
    );
}


/* -------------------------------------------------------
   Formatting helpers
------------------------------------------------------- */

function formatNumber(value: number): string {
    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
    }).format(value);
}


function formatScore(value: number | null): string {
    if (value === null) {
        return "N/A";
    }

    return `${formatNumber(value)}%`;
}


function formatDimension(value: number | null): string {
    if (value === null) {
        return "Not specified";
    }

    return formatNumber(value);
}


function formatStatus(status: string): string {
    return status
        .toLowerCase()
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
}
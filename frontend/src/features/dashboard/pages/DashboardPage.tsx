import {
    Boxes,
    CheckCircle2,
    FolderKanban,
    MapPin,
    PackageSearch,
} from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { PageHeader } from "../../../components/common/PageHeader";
import { useDashboard } from "../hooks/useDashboard";
import { useRecentMaterials } from "../hooks/useRecentMaterials";
import { useRecentProjects } from "../hooks/useRecentProjects";

export function DashboardPage() {
    const dashboard = useDashboard();
    const recentProjects = useRecentProjects();
    const recentMaterials = useRecentMaterials();

    return (
        <div>
            <PageHeader
                title="Dashboard"
                description="Overview of material recovery and reuse activity."
                action={
                    <Button>
                        Register Material
                    </Button>
                }
            />

            {/* Summary */}
            {dashboard.isLoading ? (
                <div className="grid gap-4 md:grid-cols-3">
                    <DashboardSkeleton />
                    <DashboardSkeleton />
                    <DashboardSkeleton />
                </div>
            ) : dashboard.isError ? (
                <Card>
                    <div className="py-4">
                        <p className="font-medium text-slate-900">
                            Unable to load dashboard data
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Please check your connection and try again.
                        </p>
                    </div>
                </Card>
            ) : dashboard.data ? (
                <div className="grid gap-4 md:grid-cols-3">
                    <SummaryCard
                        title="Available Materials"
                        value={dashboard.data.availableMaterials}
                        description="Currently available for reuse"
                        icon={Boxes}
                        badge={
                            <Badge variant="success">
                                Available
                            </Badge>
                        }
                    />

                    <SummaryCard
                        title="Active Projects"
                        value={dashboard.data.activeProjects}
                        description="Projects in the workspace"
                        icon={FolderKanban}
                    />

                    <SummaryCard
                        title="Pending Recommendations"
                        value={dashboard.data.pendingRecommendations}
                        description="Recommendations awaiting review"
                        icon={PackageSearch}
                        badge={
                            dashboard.data.pendingRecommendations > 0 ? (
                                <Badge variant="warning">
                                    Review required
                                </Badge>
                            ) : (
                                <Badge variant="success">
                                    All reviewed
                                </Badge>
                            )
                        }
                    />
                </div>
            ) : null}

            {/* Recent Activity */}
            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                {/* Recent Projects */}
                <Card
                    title="Recent Projects"
                    description="Your latest projects in SalvageGraph."
                >
                    {recentProjects.isLoading ? (
                        <RecentProjectsSkeleton />
                    ) : recentProjects.isError ? (
                        <EmptyState message="Unable to load recent projects." />
                    ) : recentProjects.data?.length ? (
                        <div className="divide-y divide-slate-100">
                            {recentProjects.data.map((project) => (
                                <div
                                    key={project.id}
                                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-slate-900">
                                            {project.name}
                                        </p>

                                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                            {project.location && (
                                                <span className="inline-flex items-center gap-1">
                                                    <MapPin size={13} />
                                                    {project.location}
                                                </span>
                                            )}

                                            <span>
                                                Created{" "}
                                                {formatDate(
                                                    project.createdAt,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {project.deadline && (
                                        <Badge variant="neutral">
                                            Due{" "}
                                            {formatDate(
                                                project.deadline,
                                            )}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="No projects have been created yet." />
                    )}
                </Card>

                {/* Recent Materials */}
                <Card
                    title="Recent Materials"
                    description="Recently registered materials available in your inventory."
                >
                    {recentMaterials.isLoading ? (
                        <RecentMaterialsSkeleton />
                    ) : recentMaterials.isError ? (
                        <EmptyState message="Unable to load recent materials." />
                    ) : recentMaterials.data?.length ? (
                        <div className="divide-y divide-slate-100">
                            {recentMaterials.data.map((material) => (
                                <div
                                    key={material.id}
                                    className="py-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-slate-900">
                                                    {formatMaterialType(
                                                        material.type,
                                                    )}
                                                </p>

                                                <span className="text-xs text-slate-400">
                                                    {material.materialCode}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {material.quantity}{" "}
                                                {material.unit}
                                                {material.location
                                                    ? ` · ${material.location}`
                                                    : ""}
                                            </p>
                                        </div>

                                        <MaterialStatus
                                            status={material.status}
                                        />
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            Condition{" "}
                                            {material.conditionScore !==
                                            null
                                                ? `${material.conditionScore}%`
                                                : "Not assessed"}
                                        </span>

                                        {material.verification ===
                                            "VERIFIED" && (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                                                <CheckCircle2 size={13} />
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="No materials have been registered yet." />
                    )}
                </Card>
            </div>
        </div>
    );
}

interface SummaryCardProps {
    title: string;
    value: number;
    description: string;
    icon: React.ComponentType<{
        size?: number;
        strokeWidth?: number;
    }>;
    badge?: React.ReactNode;
}

function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    badge,
}: SummaryCardProps) {
    return (
        <Card className="relative overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>

                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                    <Icon size={20} strokeWidth={1.8} />
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                    {description}
                </p>

                {badge}
            </div>
        </Card>
    );
}

function DashboardSkeleton() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
                <div>
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

                    <div className="mt-4 h-9 w-20 animate-pulse rounded bg-slate-200" />
                </div>

                <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-100" />
            </div>

            <div className="mt-5 h-4 w-40 animate-pulse rounded bg-slate-100" />
        </div>
    );
}

function RecentProjectsSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="flex items-center justify-between border-b border-slate-100 pb-4"
                >
                    <div>
                        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

                        <div className="mt-2 h-3 w-56 animate-pulse rounded bg-slate-100" />
                    </div>

                    <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
                </div>
            ))}
        </div>
    );
}

function RecentMaterialsSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="border-b border-slate-100 pb-4"
                >
                    <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />

                    <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-100" />

                    <div className="mt-3 h-3 w-24 animate-pulse rounded bg-slate-100" />
                </div>
            ))}
        </div>
    );
}

function MaterialStatus({
    status,
}: {
    status: string;
}) {
    switch (status) {
        case "AVAILABLE":
            return <Badge variant="success">Available</Badge>;

        case "RESERVED":
            return <Badge variant="warning">Reserved</Badge>;

        case "ALLOCATED":
            return <Badge variant="info">Allocated</Badge>;

        case "USED":
            return <Badge variant="neutral">Used</Badge>;

        case "DISPOSED":
            return <Badge variant="danger">Disposed</Badge>;

        default:
            return <Badge>{status}</Badge>;
    }
}

function EmptyState({
    message,
}: {
    message: string;
}) {
    return (
        <div className="py-10 text-center">
            <Boxes
                size={28}
                className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm text-slate-500">
                {message}
            </p>
        </div>
    );
}

function formatMaterialType(type: string) {
    return (
        type.charAt(0) +
        type.slice(1).toLowerCase()
    );
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}
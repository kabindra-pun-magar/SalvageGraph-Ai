import {
    CalendarDays,
    FolderKanban,
    MapPin,
    Plus,
    Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "../../../components/common/PageHeader";
import { Badge } from "../../../components/ui/Badge";
import { Modal } from "../../../components/ui/Modal";
import { CreateProjectForm } from "../components/CreateProjectForm";
import { useProjects } from "../hooks/useProjects";

export function ProjectsPage() {
    const {
        data: projects,
        isLoading,
        isError,
    } = useProjects();

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] =
        useState(false);

    const filteredProjects = useMemo(() => {
        if (!projects) {
            return [];
        }

        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return projects;
        }

        return projects.filter((project) => {
            return (
                project.name.toLowerCase().includes(query) ||
                project.location?.toLowerCase().includes(query)
            );
        });
    }, [projects, searchQuery]);

    if (isLoading) {
        return <ProjectsLoadingState />;
    }

    if (isError) {
        return <ProjectsErrorState />;
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <PageHeader
                    title="Projects"
                    description="Manage construction projects and their material requirements."
                />

                <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                    <Plus size={17} strokeWidth={2} />
                    New Project
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search
                        size={18}
                        strokeWidth={1.8}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(event.target.value)
                        }
                        placeholder="Search projects..."
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    />
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>
                        {filteredProjects.length}{" "}
                        {filteredProjects.length === 1
                            ? "project"
                            : "projects"}
                    </span>
                </div>
            </div>

            {/* Projects */}
            {filteredProjects.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {/* Desktop table */}
                    <div className="hidden md:block">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/70">
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Project
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Location
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Deadline
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Created
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredProjects.map((project) => (
                                    <tr
                                        key={project.id}
                                        onClick={() =>
                                            navigate(`/projects/${project.id}`)
                                        }
                                        className="cursor-pointer transition-colors hover:bg-slate-50/60"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                                    <FolderKanban
                                                        size={18}
                                                        strokeWidth={1.8}
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                        {project.name}
                                                    </p>

                                                    <p className="mt-0.5 truncate text-xs text-slate-400">
                                                        ID:{" "}
                                                        {project.id.slice(
                                                            0,
                                                            8,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <MapPin
                                                    size={15}
                                                    strokeWidth={1.8}
                                                    className="shrink-0 text-slate-400"
                                                />

                                                <span>
                                                    {project.location ??
                                                        "Location not set"}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <CalendarDays
                                                    size={15}
                                                    strokeWidth={1.8}
                                                    className="shrink-0 text-slate-400"
                                                />

                                                <span>
                                                    {formatDate(
                                                        project.deadline,
                                                    )}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {formatDate(
                                                project.createdAt,
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <Badge variant="success">
                                                Active
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="divide-y divide-slate-100 md:hidden">
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() =>
                                    navigate(`/projects/${project.id}`)
                                }
                                className="cursor-pointer p-4 transition-colors hover:bg-slate-50"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                            <FolderKanban
                                                size={18}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {project.name}
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-400">
                                                ID:{" "}
                                                {project.id.slice(
                                                    0,
                                                    8,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <Badge variant="success">
                                        Active
                                    </Badge>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <MapPin
                                            size={15}
                                            className="text-slate-400"
                                        />

                                        <span>
                                            {project.location ??
                                                "Location not set"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <CalendarDays
                                            size={15}
                                            className="text-slate-400"
                                        />

                                        <span>
                                            Deadline:{" "}
                                            {formatDate(
                                                project.deadline,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <EmptyProjectsState
                    hasSearchQuery={
                        searchQuery.trim().length > 0
                    }
                />
            )}

            {/* Create Project Modal */}
            <Modal
                open={isCreateModalOpen}
                onClose={() =>
                    setIsCreateModalOpen(false)
                }
                title="Create project"
                description="Add a new construction project to SalvageGraph."
                size="lg"
            >
                <CreateProjectForm
                    onSuccess={() =>
                        setIsCreateModalOpen(false)
                    }
                    onCancel={() =>
                        setIsCreateModalOpen(false)
                    }
                />
            </Modal>
        </div>
    );
}

function ProjectsLoadingState() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Projects"
                description="Manage construction projects and their material requirements."
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                </div>

                <div className="divide-y divide-slate-100">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-4 px-6 py-5"
                        >
                            <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100" />

                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
                                <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                            </div>

                            <div className="hidden h-4 w-28 animate-pulse rounded bg-slate-100 sm:block" />
                            <div className="hidden h-4 w-24 animate-pulse rounded bg-slate-100 md:block" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProjectsErrorState() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Projects"
                description="Manage construction projects and their material requirements."
            />

            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-semibold text-red-800">
                    Unable to load projects
                </p>

                <p className="mt-1 text-sm text-red-600">
                    Please refresh the page and try again.
                </p>
            </div>
        </div>
    );
}

function EmptyProjectsState({
    hasSearchQuery,
}: {
    hasSearchQuery: boolean;
}) {
    return (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <FolderKanban
                    size={20}
                    strokeWidth={1.8}
                />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {hasSearchQuery
                    ? "No matching projects"
                    : "No projects yet"}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
                {hasSearchQuery
                    ? "Try changing your search terms."
                    : "Projects registered in SalvageGraph will appear here."}
            </p>
        </div>
    );
}

function formatDate(value: string | null): string {
    if (!value) {
        return "Not set";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not set";
    }

    return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}
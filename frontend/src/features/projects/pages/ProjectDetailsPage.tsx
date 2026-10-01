import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    DollarSign,
    Edit3,
    FileText,
    FolderKanban,
    MapPin,
    Navigation,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Modal } from "../../../components/ui/Modal";
import { CreateProjectForm } from "../components/CreateProjectForm";
import { useDeleteProject } from "../hooks/useDeleteProject";
import { useProject } from "../hooks/useProject";

export function ProjectDetailsPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    const [isEditModalOpen, setIsEditModalOpen] =
        useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false);

    const {
        data: project,
        isLoading,
        isError,
    } = useProject(projectId);

    const deleteProjectMutation = useDeleteProject();

    if (isLoading) {
        return <ProjectDetailsLoadingState />;
    }

    if (isError || !project) {
        return (
            <div className="space-y-6">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/projects")}
                >
                    <ArrowLeft size={16} />
                    Back to Projects
                </Button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm font-semibold text-red-800">
                        Unable to load project
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        The project could not be found or could not
                        be loaded.
                    </p>
                </div>
            </div>
        );
    }

    const handleDelete = async () => {
        if (!projectId) {
            return;
        }

        try {
            await deleteProjectMutation.mutateAsync(projectId);

            setIsDeleteModalOpen(false);

            navigate("/projects", {
                replace: true,
            });
        } catch {
            // Mutation state displays the error.
        }
    };

    return (
        <div className="space-y-6">
            {/* Back */}
            <button
                type="button"
                onClick={() => navigate("/projects")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
                <ArrowLeft size={16} />
                Back to Projects
            </button>

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <FolderKanban
                            size={23}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                {project.name}
                            </h1>

                            <Badge variant="success">
                                Active
                            </Badge>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Project ID: {project.id}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            setIsEditModalOpen(true)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    >
                        <Edit3 size={16} />
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setIsDeleteModalOpen(true)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Main information */}
                <Card className="xl:col-span-2">
                    <div className="border-b border-slate-200 pb-5">
                        <h2 className="text-base font-semibold text-slate-900">
                            Project overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Basic information and planning details.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <InfoItem
                            icon={MapPin}
                            label="Location"
                            value={
                                project.location ??
                                "Location not set"
                            }
                        />

                        <InfoItem
                            icon={DollarSign}
                            label="Budget"
                            value={formatBudget(
                                project.budget
                            )}
                        />

                        <InfoItem
                            icon={CalendarDays}
                            label="Deadline"
                            value={formatDate(
                                project.deadline
                            )}
                        />

                        <InfoItem
                            icon={Clock3}
                            label="Created"
                            value={formatDate(
                                project.createdAt
                            )}
                        />

                        <InfoItem
                            icon={Clock3}
                            label="Last updated"
                            value={formatDate(
                                project.updatedAt
                            )}
                        />

                        <InfoItem
                            icon={Navigation}
                            label="Coordinates"
                            value={formatCoordinates(
                                project.latitude,
                                project.longitude
                            )}
                        />
                    </div>
                </Card>

                {/* Location */}
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <MapPin
                                size={18}
                                strokeWidth={1.8}
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Location
                            </h2>

                            <p className="text-xs text-slate-500">
                                Project geographic information
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-900">
                            {project.location ??
                                "Location not set"}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                            {formatCoordinates(
                                project.latitude,
                                project.longitude
                            )}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Description */}
            <Card>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <FileText
                            size={18}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Description
                        </h2>

                        <p className="text-xs text-slate-500">
                            Project details and notes
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    {project.description ? (
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {project.description}
                        </p>
                    ) : (
                        <p className="text-sm italic text-slate-400">
                            No description has been added to this
                            project.
                        </p>
                    )}
                </div>
            </Card>

            {/* Project Resources */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Material Requirements */}
                <Card>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Material requirements
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Define and manage the materials
                                required for this project.
                            </p>
                        </div>

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <FileText
                                size={18}
                                strokeWidth={1.8}
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                                navigate(
                                    `/projects/${project.id}/requirements`
                                )
                            }
                        >
                            View Requirements
                        </Button>
                    </div>
                </Card>

                {/* Source Materials */}
                <Card>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Source materials
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Recovered materials associated
                                with this project.
                            </p>
                        </div>

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <FolderKanban
                                size={18}
                                strokeWidth={1.8}
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled
                        >
                            Coming soon
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Edit Project Modal */}
            <Modal
                open={isEditModalOpen}
                onClose={() =>
                    setIsEditModalOpen(false)
                }
                title="Edit project"
                description="Update the information for this project."
                size="lg"
            >
                <CreateProjectForm
                    mode="edit"
                    initialData={{
                        id: project.id,
                        name: project.name,
                        description: project.description,
                        location:
                            project.location ?? "",
                        latitude: project.latitude,
                        longitude: project.longitude,
                        budget: project.budget,
                        deadline: project.deadline,
                    }}
                    onSuccess={() => {
                        setIsEditModalOpen(false);
                    }}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                    }}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteModalOpen}
                onClose={() => {
                    if (
                        !deleteProjectMutation.isPending
                    ) {
                        setIsDeleteModalOpen(false);
                    }
                }}
                title="Delete project"
                description="This action cannot be undone."
                size="sm"
            >
                <div className="space-y-5">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-900">
                            Delete "{project.name}"?
                        </p>

                        <p className="mt-1 text-sm text-red-700">
                            The project and its associated project
                            data will be permanently deleted.
                        </p>
                    </div>

                    {deleteProjectMutation.isError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Unable to delete the project. Please
                            try again.
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={
                                deleteProjectMutation.isPending
                            }
                            onClick={() =>
                                setIsDeleteModalOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <button
                            type="button"
                            disabled={
                                deleteProjectMutation.isPending
                            }
                            onClick={handleDelete}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Trash2 size={16} />

                            {deleteProjectMutation.isPending
                                ? "Deleting..."
                                : "Delete project"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Info Item */
/* -------------------------------------------------------------------------- */

interface InfoItemProps {
    icon: typeof MapPin;
    label: string;
    value: string;
}

function InfoItem({
    icon: Icon,
    label,
    value,
}: InfoItemProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <Icon size={16} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {value}
                </p>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Loading */
/* -------------------------------------------------------------------------- */

function ProjectDetailsLoadingState() {
    return (
        <div className="space-y-6">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

            <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

                <div className="space-y-2">
                    <div className="h-6 w-64 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="h-72 animate-pulse rounded-xl bg-slate-100 xl:col-span-2" />
                <div className="h-72 animate-pulse rounded-xl bg-slate-100" />
            </div>

            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------------------------------- */

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

function formatBudget(
    value: string | number | null
): string {
    if (value === null || value === undefined) {
        return "Not set";
    }

    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "Not set";
    }

    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatCoordinates(
    latitude: number | null,
    longitude: number | null
): string {
    if (
        latitude === null ||
        longitude === null
    ) {
        return "Coordinates not set";
    }

    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}
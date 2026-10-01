import {
    ArrowLeft,
    Box,
    CalendarDays,
    Edit3,
    Ruler,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Modal } from "../../../components/ui/Modal";

import { CreateRequirementForm } from "../components/CreateRequirementForm";
import { useDeleteRequirement } from "../hooks/useDeleteRequirement";
import { useRequirement } from "../hooks/useRequirement";

import { Search } from "lucide-react";

import { useRunMatching } from "../../matching/hooks/useRunMatching";

export function RequirementDetailsPage() {
    const { requirementId } = useParams<{
        requirementId: string;
    }>();

    const navigate = useNavigate();

    const [isEditModalOpen, setIsEditModalOpen] =
        useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false);

    const {
        data: requirement,
        isLoading,
        isError,
        refetch,
    } = useRequirement(requirementId);

    const deleteRequirementMutation =
        useDeleteRequirement();

    if (isLoading) {
        return <RequirementDetailsLoadingState />;
    }

    const runMatchingMutation =
        useRunMatching();

    if (isError || !requirement) {
        return (
            <div className="space-y-6">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={16} />
                    Back
                </Button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm font-semibold text-red-800">
                        Unable to load requirement
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        The requirement could not be found or
                        could not be loaded.
                    </p>
                </div>
            </div>
        );
    }

    const handleFindMatches = async () => {

        if (!requirementId) {
            return;
        }

        try {

            await runMatchingMutation.mutateAsync(
                requirementId
            );

            navigate(
                `/requirements/${requirementId}/matches`
            );

        } catch {
            // mutation state handles error
        }
    };

    const handleDelete = async () => {
        try {
            await deleteRequirementMutation.mutateAsync({
                requirementId: requirement.id,
                projectId: requirement.projectId,
            });

            setIsDeleteModalOpen(false);

            navigate(
                `/projects/${requirement.projectId}/requirements`,
                { replace: true }
            );
        } catch {
            // Mutation state displays the error.
        }
    };

    return (
        <div className="space-y-6">
            {/* Back */}
            <button
                type="button"
                onClick={() =>
                    navigate(
                        `/projects/${requirement.projectId}/requirements`
                    )
                }
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
                <ArrowLeft size={16} />
                Back to Requirements
            </button>

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <Box
                            size={23}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                {formatLabel(
                                    requirement.materialType
                                )}
                            </h1>

                            <Badge variant="info">
                                Requirement
                            </Badge>
                        </div>

                        {requirement.subtype && (
                            <p className="mt-1 text-sm text-slate-500">
                                {requirement.subtype}
                            </p>
                        )}

                        <p className="mt-1 text-xs text-slate-400">
                            Requirement ID: {requirement.id}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        disabled={
                            runMatchingMutation.isPending
                        }
                        onClick={handleFindMatches}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <Search size={16} />

                        {
                            runMatchingMutation.isPending
                                ? "Finding..."
                                : "Find Matches"
                        }

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            setIsEditModalOpen(true)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >

                        <Edit3 size={16} />
                        Edit

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            setIsDeleteModalOpen(true)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >

                        <Trash2 size={16} />
                        Delete

                    </button>

                </div>
            </div>

            {/* Main Information */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <div className="border-b border-slate-200 pb-5">
                        <h2 className="text-base font-semibold text-slate-900">
                            Requirement overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Material quantity and quality
                            requirements.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <InfoItem
                            label="Material Type"
                            value={formatLabel(
                                requirement.materialType
                            )}
                        />

                        <InfoItem
                            label="Subtype"
                            value={
                                requirement.subtype ??
                                "Not specified"
                            }
                        />

                        <InfoItem
                            label="Quantity"
                            value={`${requirement.quantity} ${requirement.unit}`}
                        />

                        <InfoItem
                            label="Required Condition"
                            value={
                                requirement.requiredCondition !==
                                    null
                                    ? `${requirement.requiredCondition}%`
                                    : "Not specified"
                            }
                        />

                        <InfoItem
                            label="Created"
                            value={formatDate(
                                requirement.createdAt
                            )}
                        />

                        <InfoItem
                            label="Last updated"
                            value={formatDate(
                                requirement.updatedAt
                            )}
                        />
                    </div>
                </Card>

                {/* Dimensions */}
                <Card>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <Ruler
                                size={18}
                                strokeWidth={1.8}
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Dimensions
                            </h2>

                            <p className="text-xs text-slate-500">
                                Required physical dimensions
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        <DimensionItem
                            label="Length"
                            value={requirement.length}
                        />

                        <DimensionItem
                            label="Width"
                            value={requirement.width}
                        />

                        <DimensionItem
                            label="Height"
                            value={requirement.height}
                        />

                        <DimensionItem
                            label="Diameter"
                            value={requirement.diameter}
                        />
                    </div>
                </Card>
            </div>

            {/* Intended Application */}
            <Card>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <CalendarDays
                            size={18}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Intended Application
                        </h2>

                        <p className="text-xs text-slate-500">
                            How this material will be used
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    {requirement.intendedApplication ? (
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {requirement.intendedApplication}
                        </p>
                    ) : (
                        <p className="text-sm italic text-slate-400">
                            No intended application specified.
                        </p>
                    )}
                </div>
            </Card>

            {/* Edit Modal */}
            <Modal
                open={isEditModalOpen}
                onClose={() =>
                    setIsEditModalOpen(false)
                }
                title="Edit requirement"
                description="Update the material requirement."
                size="lg"
            >
                <CreateRequirementForm
                    mode="edit"
                    projectId={requirement.projectId}
                    initialData={requirement}
                    onSuccess={async () => {
                        setIsEditModalOpen(false);
                        await refetch();
                    }}
                    onCancel={() =>
                        setIsEditModalOpen(false)
                    }
                />
            </Modal>

            {/* Delete Modal */}
            <Modal
                open={isDeleteModalOpen}
                onClose={() => {
                    if (
                        !deleteRequirementMutation.isPending
                    ) {
                        setIsDeleteModalOpen(false);
                    }
                }}
                title="Delete requirement"
                description="This action cannot be undone."
                size="sm"
            >
                <div className="space-y-5">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-900">
                            Delete this requirement?
                        </p>

                        <p className="mt-1 text-sm text-red-700">
                            The requirement for{" "}
                            <strong>
                                {formatLabel(
                                    requirement.materialType
                                )}
                            </strong>{" "}
                            will be permanently deleted.
                        </p>
                    </div>

                    {deleteRequirementMutation.isError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Unable to delete the requirement.
                            Please try again.
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={
                                deleteRequirementMutation.isPending
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
                                deleteRequirementMutation.isPending
                            }
                            onClick={handleDelete}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Trash2 size={16} />

                            {deleteRequirementMutation.isPending
                                ? "Deleting..."
                                : "Delete requirement"}
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
    label: string;
    value: string;
}

function InfoItem({
    label,
    value,
}: InfoItemProps) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-medium text-slate-800">
                {value}
            </p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Dimension Item */
/* -------------------------------------------------------------------------- */

interface DimensionItemProps {
    label: string;
    value: number | null;
}

function DimensionItem({
    label,
    value,
}: DimensionItemProps) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-sm text-slate-500">
                {label}
            </span>

            <span className="text-sm font-medium text-slate-800">
                {value !== null
                    ? value
                    : "Not specified"}
            </span>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Loading */
/* -------------------------------------------------------------------------- */

function RequirementDetailsLoadingState() {
    return (
        <div className="space-y-6">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

            <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

                <div className="space-y-2">
                    <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="h-64 animate-pulse rounded-xl bg-slate-100 xl:col-span-2" />
                <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
            </div>

            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------------------------------- */

function formatLabel(value: string) {
    return value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
}

function formatDate(value: string): string {
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
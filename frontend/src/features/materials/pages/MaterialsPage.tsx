import {
    Package,
    Plus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Modal } from "../../../components/ui/Modal";

import { useDeleteMaterial } from "../hooks/useDeleteMaterial";
import { useMaterials } from "../hooks/useMaterials";

export default function MaterialsPage() {
    const navigate = useNavigate();

    const {
        data: materials,
        isLoading,
        isError,
    } = useMaterials();

    const deleteMaterialMutation = useDeleteMaterial();

    const [selectedMaterialId, setSelectedMaterialId] =
        useState<string | null>(null);

    const selectedMaterial = materials?.find(
        (material) => material.id === selectedMaterialId
    );

    const isDeleteModalOpen =
        selectedMaterialId !== null;

    const handleDelete = async () => {
        if (!selectedMaterialId) {
            return;
        }

        try {
            await deleteMaterialMutation.mutateAsync(
                selectedMaterialId
            );

            setSelectedMaterialId(null);
        } catch {
            // Mutation error is displayed inside the modal.
        }
    };

    if (isLoading) {
        return <MaterialsLoadingState />;
    }

    if (isError) {
        return (
            <div className="space-y-6">
                <PageHeader
                    onAdd={() => navigate("/materials/new")}
                />

                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm font-semibold text-red-800">
                        Unable to load materials
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        The materials could not be loaded.
                        Please try again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                onAdd={() => navigate("/materials/new")}
            />

            {/* Empty state */}
            {!materials || materials.length === 0 ? (
                <Card>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <Package
                                size={23}
                                strokeWidth={1.8}
                            />
                        </div>

                        <h2 className="mt-4 text-base font-semibold text-slate-900">
                            No materials yet
                        </h2>

                        <p className="mt-1 max-w-md text-sm text-slate-500">
                            Register your first construction
                            material to start building your
                            material inventory.
                        </p>

                        <Button
                            type="button"
                            className="mt-5"
                            onClick={() =>
                                navigate("/materials/new")
                            }
                        >
                            <Plus size={16} />
                            Add Material
                        </Button>
                    </div>
                </Card>
            ) : (
                <>
                    {/* Materials table */}
                    <Card className="overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Code
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Type
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Quantity
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Condition
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Verification
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {materials.map(
                                        (material) => (
                                            <tr
                                                key={material.id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() =>
                                                    navigate(
                                                        `/materials/${material.id}`
                                                    )
                                                }
                                                onKeyDown={(event) => {
                                                    if (
                                                        event.key ===
                                                            "Enter" ||
                                                        event.key ===
                                                            " "
                                                    ) {
                                                        event.preventDefault();

                                                        navigate(
                                                            `/materials/${material.id}`
                                                        );
                                                    }
                                                }}
                                                className="cursor-pointer transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-300"
                                            >
                                                {/* Code */}
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                                            <Package
                                                                size={
                                                                    15
                                                                }
                                                                strokeWidth={
                                                                    1.8
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">
                                                                {
                                                                    material.materialCode
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-slate-400">
                                                                ID:{" "}
                                                                {material.id.slice(
                                                                    0,
                                                                    8
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Type */}
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                                                    {
                                                        material.type
                                                    }
                                                </td>

                                                {/* Quantity */}
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                                                    {
                                                        material.quantity
                                                    }{" "}
                                                    {
                                                        material.unit
                                                    }
                                                </td>

                                                {/* Condition */}
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                                                    {material.conditionScore !==
                                                    null
                                                        ? `${material.conditionScore}/100`
                                                        : "Not assessed"}
                                                </td>

                                                {/* Status */}
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <MaterialStatusBadge
                                                        status={
                                                            material.status
                                                        }
                                                    />
                                                </td>

                                                {/* Verification */}
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <VerificationBadge
                                                        verification={
                                                            material.verification
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Delete modal */}
                    <Modal
                        open={isDeleteModalOpen}
                        onClose={() => {
                            if (
                                !deleteMaterialMutation.isPending
                            ) {
                                setSelectedMaterialId(null);
                            }
                        }}
                        title="Delete material"
                        description="This action cannot be undone."
                        size="sm"
                    >
                        <div className="space-y-5">
                            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                <p className="text-sm font-medium text-red-900">
                                    Delete "
                                    {
                                        selectedMaterial?.materialCode
                                    }
                                    "?
                                </p>

                                <p className="mt-1 text-sm text-red-700">
                                    The material and its associated
                                    data will be permanently deleted.
                                </p>
                            </div>

                            {deleteMaterialMutation.isError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    Unable to delete the material.
                                    Please try again.
                                </div>
                            )}

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={
                                        deleteMaterialMutation.isPending
                                    }
                                    onClick={() =>
                                        setSelectedMaterialId(
                                            null
                                        )
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    variant="danger"
                                    disabled={
                                        deleteMaterialMutation.isPending
                                    }
                                    onClick={handleDelete}
                                >
                                    {deleteMaterialMutation.isPending
                                        ? "Deleting..."
                                        : "Delete material"}
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Page Header */
/* -------------------------------------------------------------------------- */

interface PageHeaderProps {
    onAdd: () => void;
}

function PageHeader({
    onAdd,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Materials
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Manage your registered construction materials.
                </p>
            </div>

            <Button
                type="button"
                onClick={onAdd}
            >
                <Plus size={16} />
                Add Material
            </Button>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Status Badges */
/* -------------------------------------------------------------------------- */

function MaterialStatusBadge({
    status,
}: {
    status: string;
}) {
    switch (status) {
        case "AVAILABLE":
            return (
                <Badge variant="success">
                    Available
                </Badge>
            );

        case "RESERVED":
            return (
                <Badge variant="warning">
                    Reserved
                </Badge>
            );

        case "ALLOCATED":
            return (
                <Badge variant="info">
                    Allocated
                </Badge>
            );

        case "USED":
            return (
                <Badge>
                    Used
                </Badge>
            );

        case "DISPOSED":
            return (
                <Badge variant="danger">
                    Disposed
                </Badge>
            );

        default:
            return (
                <Badge>
                    {status}
                </Badge>
            );
    }
}

function VerificationBadge({
    verification,
}: {
    verification: string;
}) {
    switch (verification) {
        case "VERIFIED":
            return (
                <Badge variant="success">
                    Verified
                </Badge>
            );

        case "REJECTED":
            return (
                <Badge variant="danger">
                    Rejected
                </Badge>
            );

        case "NEEDS_INSPECTION":
            return (
                <Badge variant="warning">
                    Needs inspection
                </Badge>
            );

        case "PENDING":
        default:
            return (
                <Badge>
                    Pending
                </Badge>
            );
    }
}

/* -------------------------------------------------------------------------- */
/* Loading State */
/* -------------------------------------------------------------------------- */

function MaterialsLoadingState() {
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-32 animate-pulse rounded bg-slate-200" />

                    <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
                </div>

                <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200" />
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="h-12 animate-pulse bg-slate-50" />

                <div className="space-y-0">
                    {[1, 2, 3].map((row) => (
                        <div
                            key={row}
                            className="h-16 border-t border-slate-100 bg-white"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
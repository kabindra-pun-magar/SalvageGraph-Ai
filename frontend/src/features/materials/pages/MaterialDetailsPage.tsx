import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Edit3,
    FileText,
    Hash,
    MapPin,
    Package,
    Ruler,
    Trash2,
    User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Modal } from "../../../components/ui/Modal";

import { useDeleteMaterial } from "../hooks/useDeleteMaterial";
import { useMaterial } from "../hooks/useMaterial";

export default function MaterialDetailsPage() {
    const { materialId } = useParams<{ materialId: string }>();
    const navigate = useNavigate();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const {
        data: material,
        isLoading,
        isError,
    } = useMaterial(materialId);

    const deleteMaterialMutation = useDeleteMaterial();

    if (isLoading) {
        return <MaterialDetailsLoadingState />;
    }

    if (isError || !material) {
        return (
            <div className="space-y-6">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/materials")}
                >
                    <ArrowLeft size={16} />
                    Back to Materials
                </Button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm font-semibold text-red-800">
                        Unable to load material
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        The material could not be found or could not be loaded.
                    </p>
                </div>
            </div>
        );
    }

    const handleDelete = async () => {
        if (!materialId) return;

        try {
            await deleteMaterialMutation.mutateAsync(materialId);

            setIsDeleteModalOpen(false);

            navigate("/materials", {
                replace: true,
            });
        } catch {
            // Mutation error is displayed inside the modal.
        }
    };

    return (
        <div className="space-y-6">
            {/* Back */}
            <button
                type="button"
                onClick={() => navigate("/materials")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
                <ArrowLeft size={16} />
                Back to Materials
            </button>

            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <Package
                            size={23}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                {material.materialCode}
                            </h1>

                            <MaterialStatusBadge
                                status={material.status}
                            />

                            <VerificationBadge
                                verification={material.verification}
                            />
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Material ID: {material.id}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                        navigate(
                            `/materials/${material.id}/passport`
                        )
                    }
                >
                    <FileText size={16} className="mr-2" />
                    Passport
                </Button>
                
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/materials/${material.id}/edit`
                            )
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
                            Material overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Basic information and material characteristics.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <InfoItem
                            icon={Hash}
                            label="Material Code"
                            value={material.materialCode}
                        />

                        <InfoItem
                            icon={Package}
                            label="Material Type"
                            value={material.type}
                        />

                        <InfoItem
                            icon={FileText}
                            label="Subtype"
                            value={
                                material.subtype ??
                                "Subtype not set"
                            }
                        />

                        <InfoItem
                            icon={Package}
                            label="Quantity"
                            value={`${material.quantity} ${material.unit}`}
                        />

                        <InfoItem
                            icon={CheckCircle2}
                            label="Condition"
                            value={
                                material.conditionScore !== null
                                    ? `${material.conditionScore}/100`
                                    : "Not assessed"
                            }
                        />

                        <InfoItem
                            icon={CalendarDays}
                            label="Age"
                            value={
                                material.age !== null
                                    ? `${material.age} years`
                                    : "Age not set"
                            }
                        />

                        <InfoItem
                            icon={Clock3}
                            label="Created"
                            value={formatDate(material.createdAt)}
                        />

                        <InfoItem
                            icon={Clock3}
                            label="Last updated"
                            value={formatDate(material.updatedAt)}
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
                                Material geographic information
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-900">
                            {material.location ??
                                "Location not set"}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                            {formatCoordinates(
                                material.latitude,
                                material.longitude
                            )}
                        </p>
                    </div>
                </Card>
            </div>

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
                            Physical dimensions of the material
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoItem
                        icon={Ruler}
                        label="Length"
                        value={formatMeasurement(material.length)}
                    />

                    <InfoItem
                        icon={Ruler}
                        label="Width"
                        value={formatMeasurement(material.width)}
                    />

                    <InfoItem
                        icon={Ruler}
                        label="Height"
                        value={formatMeasurement(material.height)}
                    />

                    <InfoItem
                        icon={Ruler}
                        label="Diameter"
                        value={formatMeasurement(material.diameter)}
                    />
                </div>
            </Card>

            {/* Status & Verification */}
            <Card>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <CheckCircle2
                            size={18}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Status & Verification
                        </h2>

                        <p className="text-xs text-slate-500">
                            Current material lifecycle and verification state
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <InfoItem
                        icon={Package}
                        label="Material Status"
                        value={material.status}
                    />

                    <InfoItem
                        icon={CheckCircle2}
                        label="Verification"
                        value={material.verification}
                    />
                </div>
            </Card>

            {/* Source & Registration */}
            <Card>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <User
                            size={18}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Source & Registration
                        </h2>

                        <p className="text-xs text-slate-500">
                            Origin and registration information
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <InfoItem
                        icon={FileText}
                        label="Source Project"
                        value={
                            material.sourceProjectId ??
                            "No source project"
                        }
                    />

                    <InfoItem
                        icon={User}
                        label="Registered By"
                        value={material.registeredById}
                    />

                    <InfoItem
                        icon={CalendarDays}
                        label="Created"
                        value={formatDate(material.createdAt)}
                    />

                    <InfoItem
                        icon={Clock3}
                        label="Last Updated"
                        value={formatDate(material.updatedAt)}
                    />
                </div>
            </Card>

            {/* Delete Modal */}
            <Modal
                open={isDeleteModalOpen}
                onClose={() => {
                    if (!deleteMaterialMutation.isPending) {
                        setIsDeleteModalOpen(false);
                    }
                }}
                title="Delete material"
                description="This action cannot be undone."
                size="sm"
            >
                <div className="space-y-5">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-900">
                            Delete "{material.materialCode}"?
                        </p>

                        <p className="mt-1 text-sm text-red-700">
                            The material and its associated data will be permanently deleted.
                        </p>
                    </div>

                    {deleteMaterialMutation.isError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Unable to delete the material. Please try again.
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={deleteMaterialMutation.isPending}
                            onClick={() =>
                                setIsDeleteModalOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            disabled={deleteMaterialMutation.isPending}
                            onClick={handleDelete}
                        >
                            <Trash2 size={16} />

                            {deleteMaterialMutation.isPending
                                ? "Deleting..."
                                : "Delete material"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Components */
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
                <Icon
                    size={16}
                    strokeWidth={1.8}
                />
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
            return <Badge>{status}</Badge>;
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
            return <Badge>Pending</Badge>;
    }
}

/* -------------------------------------------------------------------------- */
/* Loading */
/* -------------------------------------------------------------------------- */

function MaterialDetailsLoadingState() {
    return (
        <div className="space-y-6">
            <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

            <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

                <div className="space-y-2">
                    <div className="h-6 w-64 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="h-72 animate-pulse rounded-xl bg-slate-100 xl:col-span-2" />
                <div className="h-72 animate-pulse rounded-xl bg-slate-100" />
            </div>

            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />

            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------------------------------- */

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

function formatMeasurement(
    value: number | null
): string {
    if (value === null || value === undefined) {
        return "Not set";
    }

    return String(value);
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
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    FileText,
    MapPin,
    Package,
    QrCode,
    Ruler,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

import { usePassport } from "../hooks/usePassport";
import { useCreatePassport } from "../hooks/useCreatePassport";
import { PassportHistory } from "../components/PassportHistory";
import { useGeneratePassportQR } from "../hooks/useGeneratePassportQR";

export default function PassportPage() {
    const { materialId } = useParams<{
        materialId: string;
    }>();

    const navigate = useNavigate();

    const {
        data: passport,
        isLoading,
        isError,
        refetch,
    } = usePassport(materialId);

    const createPassportMutation = useCreatePassport();
    const generateQRMutation = useGeneratePassportQR();

    const handleCreatePassport = async () => {
        if (!materialId) return;

        try {
            await createPassportMutation.mutateAsync(
                materialId
            );

            await refetch();
        } catch {
            // Error is displayed below the button.
        }
    };

    const handleGenerateQR = async () => {
        if (!passport) return;

        try {
            await generateQRMutation.mutateAsync({
                passportId: passport.id,
                materialId: passport.materialId,
            });

            await refetch();
        } catch {
            // Error is handled by the UI below.
        }
    };

    if (isLoading) {
        return <PassportLoadingState />;
    }

    return (
        <div className="space-y-6">
            {/* Back */}
            <button
                type="button"
                onClick={() =>
                    navigate(
                        materialId
                            ? `/materials/${materialId}`
                            : "/materials"
                    )
                }
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
                <ArrowLeft size={16} />
                Back to Material
            </button>

            {/* No Passport */}
            {isError || !passport ? (
                <PassportEmptyState
                    isCreating={
                        createPassportMutation.isPending
                    }
                    isCreateError={
                        createPassportMutation.isError
                    }
                    onCreate={handleCreatePassport}
                />
            ) : (
                <>
                    {/* Header */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                <FileText
                                    size={23}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                        Material Passport
                                    </h1>

                                    <Badge variant="success">
                                        Active
                                    </Badge>
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    {passport.passportCode}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                    navigate(
                                        `/materials/${passport.materialId}/passport/edit`
                                    )
                                }
                            >
                                Edit Passport
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "passport-qr"
                                        )
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                            >
                                <QrCode
                                    size={16}
                                    className="mr-2"
                                />
                                QR Code
                            </Button>
                        </div>
                    </div>

                    {/* Overview */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <Card className="xl:col-span-2">
                            <div className="border-b border-slate-200 pb-5">
                                <h2 className="text-base font-semibold text-slate-900">
                                    Passport Overview
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Permanent material identity and
                                    recovery information.
                                </p>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <InfoItem
                                    icon={FileText}
                                    label="Passport Code"
                                    value={
                                        passport.passportCode
                                    }
                                />

                                <InfoItem
                                    icon={Package}
                                    label="Material Type"
                                    value={
                                        passport.materialType
                                    }
                                />

                                <InfoItem
                                    icon={FileText}
                                    label="Subtype"
                                    value={
                                        passport.subtype ??
                                        "Not set"
                                    }
                                />

                                <InfoItem
                                    icon={Package}
                                    label="Quantity"
                                    value={`${passport.quantity} ${passport.unit}`}
                                />

                                <InfoItem
                                    icon={CheckCircle2}
                                    label="Condition"
                                    value={
                                        passport.conditionScore !==
                                            null
                                            ? `${passport.conditionScore}/100`
                                            : "Not assessed"
                                    }
                                />

                                <InfoItem
                                    icon={CalendarDays}
                                    label="Registered"
                                    value={formatDate(
                                        passport.registeredDate
                                    )}
                                />
                            </div>
                        </Card>

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
                                        Current material location
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-900">
                                    {passport.location ??
                                        "Location not set"}
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
                                    Physical dimensions recorded
                                    in the passport.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <InfoItem
                                icon={Ruler}
                                label="Length"
                                value={formatMeasurement(
                                    passport.dimensions?.length
                                )}
                            />

                            <InfoItem
                                icon={Ruler}
                                label="Width"
                                value={formatMeasurement(
                                    passport.dimensions?.width
                                )}
                            />

                            <InfoItem
                                icon={Ruler}
                                label="Height"
                                value={formatMeasurement(
                                    passport.dimensions?.height
                                )}
                            />

                            <InfoItem
                                icon={Ruler}
                                label="Diameter"
                                value={formatMeasurement(
                                    passport.dimensions?.diameter
                                )}
                            />
                        </div>
                    </Card>

                    {/* Source */}
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
                                    Source Information
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Origin information stored in the
                                    passport.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <InfoItem
                                icon={FileText}
                                label="Source"
                                value={
                                    passport.source ??
                                    "No source recorded"
                                }
                            />
                        </div>
                    </Card>

                    {/* Material History */}
                    <PassportHistory
                        materialId={passport.materialId}
                    />

                    {/* QR */}
                    <div id="passport-qr">
                        <PassportQRCode
                            passport={passport}
                            onGenerate={handleGenerateQR}
                            isGenerating={generateQRMutation.isPending}
                            isError={generateQRMutation.isError}
                        />
                    </div>

                    {/* Metadata */}
                    <Card>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <InfoItem
                                icon={CalendarDays}
                                label="Created"
                                value={formatDate(
                                    passport.createdAt
                                )}
                            />

                            <InfoItem
                                icon={CalendarDays}
                                label="Last Updated"
                                value={formatDate(
                                    passport.updatedAt
                                )}
                            />
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Empty State */
/* -------------------------------------------------------------------------- */

interface PassportEmptyStateProps {
    isCreating: boolean;
    isCreateError: boolean;
    onCreate: () => void;
}

function PassportEmptyState({
    isCreating,
    isCreateError,
    onCreate,
}: PassportEmptyStateProps) {
    return (
        <Card>
            <div className="mx-auto max-w-lg py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <FileText size={26} />
                </div>

                <h1 className="mt-5 text-xl font-semibold text-slate-900">
                    No Material Passport
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    This material does not have a passport yet.
                    Create one to establish its persistent material
                    identity and recovery record.
                </p>

                {isCreateError && (
                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        Unable to create the material passport.
                        Please try again.
                    </div>
                )}

                <div className="mt-6">
                    <Button
                        type="button"
                        disabled={isCreating}
                        onClick={onCreate}
                    >
                        {isCreating
                            ? "Creating Passport..."
                            : "Create Material Passport"}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/* QR Code */
/* -------------------------------------------------------------------------- */

function PassportQRCode({
    passport,
    onGenerate,
    isGenerating,
    isError,
}: {
    passport: {
        qrCode: string | null;
    };
    onGenerate: () => void;
    isGenerating: boolean;
    isError: boolean;
}) {
    return (
        <Card>
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <QrCode
                        size={18}
                        strokeWidth={1.8}
                    />
                </div>

                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Passport QR Code
                    </h2>

                    <p className="text-xs text-slate-500">
                        QR code associated with this material
                        passport.
                    </p>
                </div>
            </div>

            <div className="mt-6 flex min-h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
                {passport.qrCode ? (
                    <img
                        src={passport.qrCode}
                        alt="Material passport QR code"
                        className="h-48 w-48 rounded-lg bg-white p-2"
                    />
                ) : (
                    <div className="text-center">
                        <QrCode
                            size={36}
                            className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-medium text-slate-600">
                            QR code not generated
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Generate a QR code for this material
                            passport.
                        </p>

                        {isError && (
                            <p className="mt-3 text-sm text-red-600">
                                Unable to generate QR code. Please try
                                again.
                            </p>
                        )}

                        <Button
                            type="button"
                            className="mt-4"
                            disabled={isGenerating}
                            onClick={onGenerate}
                        >
                            <QrCode
                                size={16}
                                className="mr-2"
                            />

                            {isGenerating
                                ? "Generating QR Code..."
                                : "Generate QR Code"}
                        </Button>
                    </div>
                )}
            </div>
        </Card>
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
    value: number | null | undefined
): string {
    if (value === null || value === undefined) {
        return "Not set";
    }

    return String(value);
}

/* -------------------------------------------------------------------------- */
/* Loading */
/* -------------------------------------------------------------------------- */

function PassportLoadingState() {
    return (
        <div className="space-y-6">
            <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

            <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

                <div className="space-y-2">
                    <div className="h-7 w-64 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="h-72 animate-pulse rounded-xl bg-slate-100 xl:col-span-2" />
                <div className="h-72 animate-pulse rounded-xl bg-slate-100" />
            </div>

            <div className="h-48 animate-pulse rounded-xl bg-slate-100" />

            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
        </div>
    );
}
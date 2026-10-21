import { useState } from "react";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    ClipboardCheck,
    Loader2,
    ShieldCheck,
    X,
    XCircle,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { verifyMatch } from "../services/matchingService";

type VerificationDecision =
    | "ACCEPTED"
    | "REJECTED"
    | "NEEDS_INSPECTION";

interface VerificationActionsProps {
    matchId: string;
    requirementId: string;
    currentStatus: string;
}

const decisionOptions: {
    value: VerificationDecision;
    label: string;
    description: string;
    icon: typeof CheckCircle2;
    activeClass: string;
}[] = [
    {
        value: "ACCEPTED",
        label: "Accept Match",
        description:
            "Approve this material as a suitable candidate for the requirement.",
        icon: CheckCircle2,
        activeClass:
            "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100",
    },
    {
        value: "REJECTED",
        label: "Reject Match",
        description:
            "Reject this candidate because it does not meet the requirement.",
        icon: XCircle,
        activeClass:
            "border-red-500 bg-red-50 text-red-800 ring-2 ring-red-100",
    },
    {
        value: "NEEDS_INSPECTION",
        label: "Needs Inspection",
        description:
            "Flag this candidate for a physical inspection before approval.",
        icon: AlertTriangle,
        activeClass:
            "border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-100",
    },
];

function getStatusLabel(status: string): string {
    switch (status.toUpperCase()) {
        case "ACCEPTED":
            return "Accepted";

        case "REJECTED":
            return "Rejected";

        case "NEEDS_INSPECTION":
        case "EVALUATED":
            return "Needs Inspection";

        case "PENDING":
            return "Pending Verification";

        default:
            return status.replaceAll("_", " ");
    }
}

function getStatusClasses(status: string): string {
    switch (status.toUpperCase()) {
        case "ACCEPTED":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";

        case "REJECTED":
            return "border-red-200 bg-red-50 text-red-700";

        case "NEEDS_INSPECTION":
        case "EVALUATED":
            return "border-amber-200 bg-amber-50 text-amber-800";

        default:
            return "border-slate-200 bg-slate-100 text-slate-700";
    }
}

export function VerificationActions({
    matchId,
    requirementId,
    currentStatus,
}: VerificationActionsProps) {
    const queryClient = useQueryClient();

    const [selectedDecision, setSelectedDecision] =
        useState<VerificationDecision | null>(null);

    const [note, setNote] = useState("");

    const [showConfirmation, setShowConfirmation] =
        useState(false);

    const mutation = useMutation({
        mutationFn: async ({
            decision,
            note,
        }: {
            decision: VerificationDecision;
            note?: string;
        }) => {
            return verifyMatch(
                matchId,
                decision,
                note,
            );
        },

        onSuccess: async () => {
            // Refresh the match list so the new status appears.
            await queryClient.invalidateQueries({
                queryKey: ["matches", requirementId],
            });

            // Clear the confirmation and note after success.
            setShowConfirmation(false);
            setSelectedDecision(null);
            setNote("");
        },
    });

    const normalizedStatus = currentStatus.toUpperCase();

    const isFinalDecision = [
        "ACCEPTED",
        "REJECTED",
    ].includes(normalizedStatus);

    const handleSelectDecision = (
        decision: VerificationDecision,
    ) => {
        setSelectedDecision(decision);
        setShowConfirmation(false);
        mutation.reset();
    };

    const handleConfirm = () => {
        if (!selectedDecision) {
            return;
        }

        mutation.mutate({
            decision: selectedDecision,
            note: note.trim() || undefined,
        });
    };

    const selectedOption = decisionOptions.find(
        (option) => option.value === selectedDecision,
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                        <ShieldCheck size={24} />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Human Verification
                        </h2>

                        <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                            Review the matching result and record your
                            verification decision.
                        </p>
                    </div>
                </div>

                {/* Current status */}
                <div>
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                        Current status
                    </p>

                    <span
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(currentStatus)}`}
                    >
                        {getStatusLabel(currentStatus)}
                    </span>
                </div>
            </div>

            {/* Final decision information */}
            {isFinalDecision && (
                <div
                    className={`flex items-start gap-3 rounded-xl border p-4 ${
                        normalizedStatus === "ACCEPTED"
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-red-200 bg-red-50"
                    }`}
                >
                    {normalizedStatus === "ACCEPTED" ? (
                        <CheckCircle2
                            size={20}
                            className="mt-0.5 text-emerald-700"
                        />
                    ) : (
                        <XCircle
                            size={20}
                            className="mt-0.5 text-red-700"
                        />
                    )}

                    <div>
                        <p
                            className={`font-semibold ${
                                normalizedStatus === "ACCEPTED"
                                    ? "text-emerald-800"
                                    : "text-red-800"
                            }`}
                        >
                            This match has been reviewed
                        </p>

                        <p
                            className={`mt-1 text-sm ${
                                normalizedStatus === "ACCEPTED"
                                    ? "text-emerald-700"
                                    : "text-red-700"
                            }`}
                        >
                            Current decision:{" "}
                            {getStatusLabel(currentStatus)}.
                            You can record a new decision below if
                            reassessment is necessary.
                        </p>
                    </div>
                </div>
            )}

            {/* Decision selection */}
            <div className="space-y-3">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        Select a decision
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Choose the action that best reflects your review.
                    </p>
                </div>

                <div className="grid gap-3 lg:grid-cols-3">
                    {decisionOptions.map((option) => {
                        const Icon = option.icon;

                        const isSelected =
                            selectedDecision === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                disabled={mutation.isPending}
                                onClick={() =>
                                    handleSelectDecision(option.value)
                                }
                                aria-pressed={isSelected}
                                className={`flex h-full flex-col items-start rounded-xl border p-4 text-left transition ${
                                    isSelected
                                        ? option.activeClass
                                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                                } disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                                <div className="flex w-full items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-sm font-semibold">
                                        <Icon size={19} />
                                        {option.label}
                                    </span>

                                    {isSelected && (
                                        <CheckCircle2 size={17} />
                                    )}
                                </div>

                                <p className="mt-3 text-xs leading-5 opacity-80">
                                    {option.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Verification note */}
            <div className="space-y-2">
                <label
                    htmlFor="verification-note"
                    className="block text-sm font-semibold text-slate-900"
                >
                    Verification notes
                    <span className="ml-2 font-normal text-slate-400">
                        Optional
                    </span>
                </label>

                <textarea
                    id="verification-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    disabled={mutation.isPending}
                    placeholder="Explain your decision, record material concerns, or describe the inspection required..."
                    maxLength={1000}
                    rows={4}
                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                />

                <div className="flex justify-between gap-3 text-xs text-slate-400">
                    <span>
                        Add context to help with future material decisions.
                    </span>

                    <span>{note.length}/1000</span>
                </div>
            </div>

            {/* Confirmation panel */}
            {selectedDecision && showConfirmation && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-white p-2 text-slate-700 shadow-sm">
                            <ClipboardCheck size={20} />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">
                                Confirm verification decision
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                You are about to record:{" "}
                                <strong>
                                    {selectedOption?.label}
                                </strong>
                                .
                            </p>

                            {note.trim() && (
                                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Verification note
                                    </p>

                                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                        {note.trim()}
                                    </p>
                                </div>
                            )}

                            <p className="mt-3 text-xs leading-5 text-slate-500">
                                Please make sure your decision and notes
                                are correct before submitting.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={mutation.isPending}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Saving decision...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={16} />
                                    Confirm decision
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmation(false)
                            }
                            disabled={mutation.isPending}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* API success message */}
            {mutation.isSuccess && (
                <div
                    role="status"
                    className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                >
                    <CheckCircle2
                        size={20}
                        className="mt-0.5 text-emerald-700"
                    />

                    <div>
                        <p className="font-semibold text-emerald-800">
                            Verification updated successfully
                        </p>

                        <p className="mt-1 text-sm text-emerald-700">
                            Your decision has been saved and the matching
                            results are being refreshed.
                        </p>
                    </div>
                </div>
            )}

            {/* API error message */}
            {mutation.isError && (
                <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
                >
                    <AlertCircle
                        size={20}
                        className="mt-0.5 text-red-700"
                    />

                    <div>
                        <p className="font-semibold text-red-800">
                            Unable to update verification
                        </p>

                        <p className="mt-1 text-sm leading-6 text-red-700">
                            The server could not save your decision.
                            Check your connection and permissions, then
                            try again.
                        </p>
                    </div>
                </div>
            )}

            {/* Action buttons */}
            {!showConfirmation && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                    <p className="text-xs text-slate-500">
                        Your decision will be saved to the backend.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            mutation.reset();
                            setShowConfirmation(true);
                        }}
                        disabled={
                            !selectedDecision ||
                            mutation.isPending
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ShieldCheck size={17} />
                        Review decision
                    </button>
                </div>
            )}
        </div>
    );
}
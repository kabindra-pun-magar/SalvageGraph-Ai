import { History, Clock } from "lucide-react";

import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

import { useMaterialHistory } from "../hooks/useMaterialHistory";

interface PassportHistoryProps {
    materialId: string;
}

export function PassportHistory({
    materialId,
}: PassportHistoryProps) {
    const {
        data: history,
        isLoading,
        isError,
    } = useMaterialHistory(materialId);

    if (isLoading) {
        return (
            <Card>
                <div className="flex items-center gap-3 mb-6">
                    <History size={20} className="text-slate-600" />

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Material History
                        </h2>
                        <p className="text-sm text-slate-500">
                            Timeline of changes to this material
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="animate-pulse flex gap-4"
                        >
                            <div className="h-9 w-9 rounded-full bg-slate-200" />

                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-40 rounded bg-slate-200" />
                                <div className="h-3 w-64 rounded bg-slate-200" />
                                <div className="h-3 w-28 rounded bg-slate-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card>
                <div className="flex items-center gap-3">
                    <History size={20} className="text-slate-600" />

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Material History
                        </h2>

                        <p className="mt-1 text-sm text-red-600">
                            Unable to load material history.
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    if (!history || history.length === 0) {
        return (
            <Card>
                <div className="flex items-center gap-3 mb-6">
                    <History size={20} className="text-slate-600" />

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Material History
                        </h2>

                        <p className="text-sm text-slate-500">
                            Timeline of changes to this material
                        </p>
                    </div>
                </div>

                <div className="py-8 text-center">
                    <History
                        size={32}
                        className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                        No history available yet.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="mb-6 flex items-center gap-3">
                <History size={20} className="text-slate-600" />

                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Material History
                    </h2>

                    <p className="text-sm text-slate-500">
                        Timeline of changes to this material
                    </p>
                </div>
            </div>

            <div className="relative space-y-6">
                {history.map((entry, index) => (
                    <div
                        key={entry.id}
                        className="relative flex gap-4"
                    >
                        {index < history.length - 1 && (
                            <div className="absolute left-[17px] top-9 h-[calc(100%+24px)] w-px bg-slate-200" />
                        )}

                        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                            <History
                                size={16}
                                className="text-slate-600"
                            />
                        </div>

                        <div className="min-w-0 flex-1 pb-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    {formatHistoryAction(entry.action)}
                                </h3>

                                <Badge variant="neutral">
                                    {entry.action}
                                </Badge>
                            </div>

                            {entry.description && (
                                <p className="mt-1 text-sm text-slate-600">
                                    {entry.description}
                                </p>
                            )}

                            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock size={13} />

                                <span>
                                    {formatHistoryDate(entry.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function formatHistoryAction(action: string): string {
    return action
        .toLowerCase()
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(" ");
}

function formatHistoryDate(date: string): string {
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}
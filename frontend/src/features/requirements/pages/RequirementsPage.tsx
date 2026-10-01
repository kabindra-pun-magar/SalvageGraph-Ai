import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

import { useRequirements } from "../hooks/useRequirements";
import { CreateRequirementForm } from "../components/CreateRequirementForm";

export function RequirementsPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    const [showCreateForm, setShowCreateForm] = useState(false);

    const {
        data: requirements = [],
        isLoading,
        isError,
        error,
    } = useRequirements(projectId);

    if (!projectId) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Material Requirements"
                    description="View and manage material requirements."
                />

                <Card>
                    <div className="py-10 text-center">
                        <p className="text-sm text-slate-500">
                            No project was selected.
                        </p>

                        <Button
                            className="mt-4"
                            onClick={() => navigate("/projects")}
                        >
                            Go to Projects
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Material Requirements"
                description="Define the materials required for this project."
                action={
                    <Button
                        onClick={() =>
                            setShowCreateForm((value) => !value)
                        }
                    >
                        {showCreateForm
                            ? "Close Form"
                            : "Add Requirement"}
                    </Button>
                }
            />

            {/* Create Form */}
            {showCreateForm && (
                <CreateRequirementForm
                    projectId={projectId}
                    onSuccess={() => {
                        setShowCreateForm(false);
                    }}
                    onCancel={() => {
                        setShowCreateForm(false);
                    }}
                />
            )}

            {/* Loading */}
            {isLoading && (
                <Card>
                    <div className="py-12 text-center">
                        <p className="text-sm text-slate-500">
                            Loading requirements...
                        </p>
                    </div>
                </Card>
            )}

            {/* Error */}
            {isError && (
                <Card>
                    <div className="py-12 text-center">
                        <p className="text-sm font-medium text-red-600">
                            Failed to load requirements.
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            {error instanceof Error
                                ? error.message
                                : "Something went wrong."}
                        </p>
                    </div>
                </Card>
            )}

            {/* Empty State */}
            {!isLoading &&
                !isError &&
                requirements.length === 0 && (
                    <Card>
                        <div className="py-14 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                <span className="text-lg text-slate-500">
                                    +
                                </span>
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-900">
                                No material requirements
                            </h3>

                            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                                Add the materials that this project
                                requires for construction or reuse.
                            </p>

                            <Button
                                className="mt-5"
                                onClick={() =>
                                    setShowCreateForm(true)
                                }
                            >
                                Add Requirement
                            </Button>
                        </div>
                    </Card>
                )}

            {/* Requirements Table */}
            {!isLoading &&
                !isError &&
                requirements.length > 0 && (
                    <Card className="overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Material
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Quantity
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Condition
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Dimensions
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Application
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {requirements.map(
                                        (requirement) => (
                                            <tr
                                                key={requirement.id}
                                                className="transition hover:bg-slate-50"
                                            >
                                                {/* Material */}
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">
                                                            {formatLabel(
                                                                requirement.materialType
                                                            )}
                                                        </p>

                                                        {requirement.subtype && (
                                                            <p className="mt-0.5 text-xs text-slate-500">
                                                                {
                                                                    requirement.subtype
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Quantity */}
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-900">
                                                        {
                                                            requirement.quantity
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            requirement.unit
                                                        }
                                                    </p>
                                                </td>

                                                {/* Condition */}
                                                <td className="px-6 py-4">
                                                    {requirement.requiredCondition !==
                                                    null ? (
                                                        <Badge
                                                            variant={
                                                                requirement.requiredCondition >=
                                                                70
                                                                    ? "success"
                                                                    : requirement.requiredCondition >=
                                                                      40
                                                                    ? "warning"
                                                                    : "danger"
                                                            }
                                                        >
                                                            {
                                                                requirement.requiredCondition
                                                            }
                                                            %
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-sm text-slate-400">
                                                            Not specified
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Dimensions */}
                                                <td className="px-6 py-4">
                                                    <Dimensions
                                                        length={
                                                            requirement.length
                                                        }
                                                        width={
                                                            requirement.width
                                                        }
                                                        height={
                                                            requirement.height
                                                        }
                                                        diameter={
                                                            requirement.diameter
                                                        }
                                                    />
                                                </td>

                                                {/* Application */}
                                                <td className="max-w-xs px-6 py-4">
                                                    <p className="truncate text-sm text-slate-600">
                                                        {requirement.intendedApplication ||
                                                            "Not specified"}
                                                    </p>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Page Header */
/* -------------------------------------------------------------------------- */

interface PageHeaderProps {
    title: string;
    description: string;
    action?: React.ReactNode;
}

function PageHeader({
    title,
    description,
    action,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-xl font-semibold text-slate-900">
                    {title}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>
            </div>

            {action}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Dimensions */
/* -------------------------------------------------------------------------- */

interface DimensionsProps {
    length: number | null;
    width: number | null;
    height: number | null;
    diameter: number | null;
}

function Dimensions({
    length,
    width,
    height,
    diameter,
}: DimensionsProps) {
    const hasDimensions =
        length !== null ||
        width !== null ||
        height !== null ||
        diameter !== null;

    if (!hasDimensions) {
        return (
            <span className="text-sm text-slate-400">
                Not specified
            </span>
        );
    }

    return (
        <div className="space-y-0.5 text-xs text-slate-600">
            {length !== null && (
                <p>
                    L: <span className="font-medium">{length}</span>
                </p>
            )}

            {width !== null && (
                <p>
                    W: <span className="font-medium">{width}</span>
                </p>
            )}

            {height !== null && (
                <p>
                    H: <span className="font-medium">{height}</span>
                </p>
            )}

            {diameter !== null && (
                <p>
                    Ø:{" "}
                    <span className="font-medium">
                        {diameter}
                    </span>
                </p>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Label Formatting */
/* -------------------------------------------------------------------------- */

function formatLabel(value: string) {
    return value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
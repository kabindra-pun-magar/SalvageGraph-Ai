import {
    Box,
    Package,
    Ruler,
    Search,
    ArrowRight,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import { useMemo, useState } from "react";

import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

import {
    useAllRequirements,
} from "../hooks/useRequirements";


export function RequirementsDashboardPage() {

    const navigate =
        useNavigate();


    const [search, setSearch] =
        useState("");


    const {
        data: requirements,
        isLoading,
        isError,
    } =
        useAllRequirements();



    const filteredRequirements =
        useMemo(() => {

            if (!requirements) {
                return [];
            }


            const query =
                search
                    .trim()
                    .toLowerCase();


            if (!query) {
                return requirements;
            }


            return requirements.filter(
                (requirement) => {

                    return (

                        requirement.materialType
                            .toLowerCase()
                            .includes(query)

                        ||

                        (
                            requirement.subtype ??
                            ""
                        )
                            .toLowerCase()
                            .includes(query)

                        ||

                        requirement.projectName
                            .toLowerCase()
                            .includes(query)

                        ||

                        (
                            requirement.intendedApplication ??
                            ""
                        )
                            .toLowerCase()
                            .includes(query)

                    );

                }
            );

        }, [
            requirements,
            search,
        ]);




    if (isLoading) {

        return (

            <div className="space-y-6">

                <div>

                    <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />

                    <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-100" />

                </div>


                <div className="rounded-xl border border-slate-200 bg-white">

                    <div className="space-y-4 p-6">

                        {[1, 2, 3].map(
                            (item) => (

                                <div
                                    key={item}
                                    className="h-20 animate-pulse rounded-lg bg-slate-100"
                                />

                            )
                        )}

                    </div>

                </div>

            </div>

        );

    }




    if (isError) {

        return (

            <div className="space-y-6">

                <div>

                    <h1 className="text-2xl font-semibold text-slate-900">

                        Material Requirements

                    </h1>


                    <p className="mt-1 text-sm text-slate-500">

                        Manage project material requirements.

                    </p>

                </div>


                <Card>

                    <div className="rounded-lg border border-red-200 bg-red-50 p-5">

                        <p className="font-semibold text-red-800">

                            Unable to load requirements

                        </p>


                        <p className="mt-1 text-sm text-red-600">

                            The project requirements could not be loaded.

                        </p>

                    </div>

                </Card>

            </div>

        );

    }




    return (

        <div className="space-y-6">


            {/* Header */}

            <div>

                <h1 className="text-2xl font-semibold text-slate-900">

                    Material Requirements

                </h1>


                <p className="mt-1 text-sm text-slate-500">

                    View material requirements across your projects.

                </p>

            </div>




            {/* Search */}

            <Card>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


                    <div className="relative w-full md:max-w-md">

                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search requirements..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                        />

                    </div>


                    <p className="text-sm text-slate-500">

                        {filteredRequirements.length}{" "}

                        {filteredRequirements.length === 1
                            ? "requirement"
                            : "requirements"}

                    </p>

                </div>

            </Card>




            {/* Empty */}

            {
                filteredRequirements.length === 0 && (

                    <Card>

                        <div className="py-14 text-center">

                            <Box
                                size={42}
                                className="mx-auto text-slate-300"
                            />


                            <p className="mt-4 font-medium text-slate-700">

                                {
                                    search
                                        ? "No requirements found"
                                        : "No material requirements yet"
                                }

                            </p>


                            <p className="mt-1 text-sm text-slate-500">

                                {
                                    search
                                        ? "Try a different search term."
                                        : "Requirements created inside projects will appear here."
                                }

                            </p>

                        </div>

                    </Card>

                )
            }




            {/* Requirements List */}

            {
                filteredRequirements.length > 0 && (

                    <Card>

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px]">

                                <thead>

                                    <tr className="border-b border-slate-200 bg-slate-50">

                                        <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-500">

                                            Material

                                        </th>


                                        <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-500">

                                            Project

                                        </th>


                                        <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-500">

                                            Quantity

                                        </th>


                                        <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-500">

                                            Condition

                                        </th>


                                        <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-500">

                                            Dimensions

                                        </th>


                                        <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wide text-slate-500">

                                            Action

                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        filteredRequirements.map(
                                            (requirement) => (

                                                <tr
                                                    key={requirement.id}
                                                    className="border-b border-slate-100 transition hover:bg-slate-50"
                                                >


                                                    {/* Material */}

                                                    <td className="px-5 py-5">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

                                                                <Package
                                                                    size={18}
                                                                />

                                                            </div>


                                                            <div>

                                                                <p className="font-medium text-slate-900">

                                                                    {formatLabel(
                                                                        requirement.materialType
                                                                    )}

                                                                </p>


                                                                {
                                                                    requirement.subtype && (

                                                                        <p className="mt-0.5 text-xs text-slate-400">

                                                                            {
                                                                                requirement.subtype
                                                                            }

                                                                        </p>

                                                                    )
                                                                }

                                                            </div>

                                                        </div>

                                                    </td>




                                                    {/* Project */}

                                                    <td className="px-5 py-5">

                                                        <p className="text-sm font-medium text-slate-800">

                                                            {
                                                                requirement.projectName
                                                            }

                                                        </p>


                                                        <p className="mt-0.5 text-xs text-slate-400">

                                                            Project requirement

                                                        </p>

                                                    </td>




                                                    {/* Quantity */}

                                                    <td className="px-5 py-5">

                                                        <p className="text-sm font-medium text-slate-800">

                                                            {
                                                                requirement.quantity
                                                            }

                                                        </p>


                                                        <p className="text-xs text-slate-400">

                                                            {
                                                                requirement.unit
                                                            }

                                                        </p>

                                                    </td>




                                                    {/* Condition */}

                                                    <td className="px-5 py-5">

                                                        {
                                                            requirement.requiredCondition !== null ? (

                                                                <Badge variant="success">

                                                                    {
                                                                        requirement.requiredCondition
                                                                    }%

                                                                </Badge>

                                                            ) : (

                                                                <span className="text-sm text-slate-400">

                                                                    Not specified

                                                                </span>

                                                            )
                                                        }

                                                    </td>




                                                    {/* Dimensions */}

                                                    <td className="px-5 py-5">

                                                        <div className="flex items-start gap-2">

                                                            <Ruler
                                                                size={16}
                                                                className="mt-0.5 text-slate-400"
                                                            />


                                                            <div className="text-xs leading-5 text-slate-500">

                                                                {
                                                                    formatDimensions(
                                                                        requirement
                                                                    )
                                                                }

                                                            </div>

                                                        </div>

                                                    </td>




                                                    {/* Action */}

                                                    <td className="px-5 py-5 text-right">

                                                        <button

                                                            type="button"

                                                            onClick={() =>
                                                                navigate(
                                                                    `/requirements/${requirement.id}`
                                                                )
                                                            }

                                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"

                                                        >

                                                            View

                                                            <ArrowRight
                                                                size={15}
                                                            />

                                                        </button>

                                                    </td>


                                                </tr>

                                            )
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    </Card>

                )
            }


        </div>

    );

}



/* -------------------------------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------------------------------- */


function formatLabel(
    value: string
) {

    return value
        .toLowerCase()
        .replace(
            /_/g,
            " "
        )
        .replace(
            /\b\w/g,
            (char) =>
                char.toUpperCase()
        );

}



function formatDimensions(
    requirement: {
        length: number | null;
        width: number | null;
        height: number | null;
        diameter: number | null;
    }
) {

    const dimensions: string[] = [];


    if (
        requirement.length !== null
    ) {

        dimensions.push(
            `L: ${requirement.length}`
        );

    }


    if (
        requirement.width !== null
    ) {

        dimensions.push(
            `W: ${requirement.width}`
        );

    }


    if (
        requirement.height !== null
    ) {

        dimensions.push(
            `H: ${requirement.height}`
        );

    }


    if (
        requirement.diameter !== null
    ) {

        dimensions.push(
            `Ø: ${requirement.diameter}`
        );

    }


    if (
        dimensions.length === 0
    ) {

        return "Not specified";

    }


    return dimensions.map(
        (dimension, index) => (

            <span
                key={index}
                className="block"
            >
                {dimension}
            </span>

        )
    );

}
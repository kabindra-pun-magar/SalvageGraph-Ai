import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

import { usePassport } from "../hooks/usePassport";
import { useUpdatePassport } from "../hooks/useUpdatePassport";

interface PassportFormValues {
    subtype: string;
    quantity: string;
    unit: string;
    length: string;
    width: string;
    height: string;
    diameter: string;
    conditionScore: string;
    source: string;
    location: string;
}

export default function PassportEditPage() {
    const { materialId } = useParams<{
        materialId: string;
    }>();

    const navigate = useNavigate();

    const {
        data: passport,
        isLoading,
        isError,
    } = usePassport(materialId);

    const updatePassportMutation =
        useUpdatePassport();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PassportFormValues>({
        values: {
            subtype: passport?.subtype ?? "",
            quantity:
                passport?.quantity !== undefined
                    ? String(passport.quantity)
                    : "",
            unit: passport?.unit ?? "",
            length:
                passport?.dimensions?.length !== null &&
                passport?.dimensions?.length !== undefined
                    ? String(
                          passport.dimensions.length
                      )
                    : "",
            width:
                passport?.dimensions?.width !== null &&
                passport?.dimensions?.width !== undefined
                    ? String(
                          passport.dimensions.width
                      )
                    : "",
            height:
                passport?.dimensions?.height !== null &&
                passport?.dimensions?.height !== undefined
                    ? String(
                          passport.dimensions.height
                      )
                    : "",
            diameter:
                passport?.dimensions?.diameter !== null &&
                passport?.dimensions?.diameter !== undefined
                    ? String(
                          passport.dimensions.diameter
                      )
                    : "",
            conditionScore:
                passport?.conditionScore !== null &&
                passport?.conditionScore !== undefined
                    ? String(
                          passport.conditionScore
                      )
                    : "",
            source: passport?.source ?? "",
            location: passport?.location ?? "",
        },
    });

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError || !passport || !materialId) {
        return (
            <div className="space-y-6">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                        navigate(
                            materialId
                                ? `/materials/${materialId}/passport`
                                : "/materials"
                        )
                    }
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Passport
                </Button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm font-semibold text-red-800">
                        Unable to load passport
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        The material passport could not be
                        loaded.
                    </p>
                </div>
            </div>
        );
    }

    const onSubmit = async (
        values: PassportFormValues
    ) => {
        await updatePassportMutation.mutateAsync({
            passportId: passport.id,
            materialId: passport.materialId,
            input: {
                subtype:
                    values.subtype.trim() || undefined,

                quantity:
                    values.quantity !== ""
                        ? Number(values.quantity)
                        : undefined,

                unit:
                    values.unit.trim() || undefined,

                dimensions: {
                    ...(values.length !== ""
                        ? {
                              length: Number(
                                  values.length
                              ),
                          }
                        : {}),

                    ...(values.width !== ""
                        ? {
                              width: Number(
                                  values.width
                              ),
                          }
                        : {}),

                    ...(values.height !== ""
                        ? {
                              height: Number(
                                  values.height
                              ),
                          }
                        : {}),

                    ...(values.diameter !== ""
                        ? {
                              diameter: Number(
                                  values.diameter
                              ),
                          }
                        : {}),
                },

                conditionScore:
                    values.conditionScore !== ""
                        ? Number(
                              values.conditionScore
                          )
                        : undefined,

                source:
                    values.source.trim() ||
                    undefined,

                location:
                    values.location.trim() ||
                    undefined,
            },
        });

        navigate(
            `/materials/${passport.materialId}/passport`,
            {
                replace: true,
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Back */}
            <Button
                type="button"
                variant="ghost"
                onClick={() =>
                    navigate(
                        `/materials/${passport.materialId}/passport`
                    )
                }
                className="-ml-2"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Passport
            </Button>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                    Edit Material Passport
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Update the information stored in passport{" "}
                    <span className="font-medium text-slate-700">
                        {passport.passportCode}
                    </span>
                    .
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                {/* Basic Information */}
                <Card>
                    <div className="border-b border-slate-200 pb-5">
                        <h2 className="text-base font-semibold text-slate-900">
                            Passport Information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Update the editable passport
                            information.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            label="Passport Code"
                        >
                            <input
                                value={
                                    passport.passportCode
                                }
                                disabled
                                className={inputClass(
                                    true
                                )}
                            />
                        </FormField>

                        <FormField label="Material Type">
                            <input
                                value={
                                    passport.materialType
                                }
                                disabled
                                className={inputClass(
                                    true
                                )}
                            />
                        </FormField>

                        <FormField
                            label="Subtype"
                            error={
                                errors.subtype?.message
                            }
                        >
                            <input
                                {...register("subtype", {
                                    maxLength: {
                                        value: 100,
                                        message:
                                            "Subtype must contain at most 100 characters",
                                    },
                                })}
                                placeholder="e.g. Red Brick"
                                className={inputClass(
                                    !!errors.subtype
                                )}
                            />
                        </FormField>

                        <FormField
                            label="Quantity"
                            error={
                                errors.quantity?.message
                            }
                        >
                            <input
                                type="number"
                                step="any"
                                min="0"
                                {...register(
                                    "quantity",
                                    {
                                        validate: (
                                            value
                                        ) =>
                                            Number(
                                                value
                                            ) > 0 ||
                                            "Quantity must be greater than 0",
                                    }
                                )}
                                className={inputClass(
                                    !!errors.quantity
                                )}
                            />
                        </FormField>

                        <FormField
                            label="Unit"
                            error={
                                errors.unit?.message
                            }
                        >
                            <input
                                {...register("unit", {
                                    required:
                                        "Unit is required",
                                    maxLength: {
                                        value: 50,
                                        message:
                                            "Unit must contain at most 50 characters",
                                    },
                                })}
                                className={inputClass(
                                    !!errors.unit
                                )}
                            />
                        </FormField>

                        <FormField
                            label="Condition Score"
                            hint="0–100"
                            error={
                                errors.conditionScore
                                    ?.message
                            }
                        >
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                {...register(
                                    "conditionScore",
                                    {
                                        validate: (
                                            value
                                        ) => {
                                            if (
                                                value ===
                                                ""
                                            ) {
                                                return true;
                                            }

                                            const number =
                                                Number(
                                                    value
                                                );

                                            return (
                                                (number >=
                                                    0 &&
                                                    number <=
                                                        100) ||
                                                "Condition score must be between 0 and 100"
                                            );
                                        },
                                    }
                                )}
                                className={inputClass(
                                    !!errors.conditionScore
                                )}
                            />
                        </FormField>
                    </div>
                </Card>

                {/* Dimensions */}
                <Card>
                    <div className="border-b border-slate-200 pb-5">
                        <h2 className="text-base font-semibold text-slate-900">
                            Dimensions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Update the physical dimensions of
                            the material.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <FormField label="Length">
                            <input
                                type="number"
                                step="any"
                                min="0"
                                {...register(
                                    "length"
                                )}
                                className={inputClass()}
                            />
                        </FormField>

                        <FormField label="Width">
                            <input
                                type="number"
                                step="any"
                                min="0"
                                {...register(
                                    "width"
                                )}
                                className={inputClass()}
                            />
                        </FormField>

                        <FormField label="Height">
                            <input
                                type="number"
                                step="any"
                                min="0"
                                {...register(
                                    "height"
                                )}
                                className={inputClass()}
                            />
                        </FormField>

                        <FormField label="Diameter">
                            <input
                                type="number"
                                step="any"
                                min="0"
                                {...register(
                                    "diameter"
                                )}
                                className={inputClass()}
                            />
                        </FormField>
                    </div>
                </Card>

                {/* Source & Location */}
                <Card>
                    <div className="border-b border-slate-200 pb-5">
                        <h2 className="text-base font-semibold text-slate-900">
                            Source & Location
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Update the source and current
                            location information.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            label="Source"
                            error={
                                errors.source?.message
                            }
                        >
                            <input
                                {...register("source", {
                                    maxLength: {
                                        value: 255,
                                        message:
                                            "Source must contain at most 255 characters",
                                    },
                                })}
                                placeholder="e.g. Project UUID"
                                className={inputClass(
                                    !!errors.source
                                )}
                            />
                        </FormField>

                        <FormField
                            label="Location"
                            error={
                                errors.location?.message
                            }
                        >
                            <input
                                {...register(
                                    "location",
                                    {
                                        maxLength: {
                                            value: 255,
                                            message:
                                                "Location must contain at most 255 characters",
                                        },
                                    }
                                )}
                                placeholder="e.g. Birendranagar, Surkhet, Nepal"
                                className={inputClass(
                                    !!errors.location
                                )}
                            />
                        </FormField>
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={
                            isSubmitting ||
                            updatePassportMutation.isPending
                        }
                        onClick={() =>
                            navigate(
                                `/materials/${passport.materialId}/passport`
                            )
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            updatePassportMutation.isPending
                        }
                    >
                        {isSubmitting ||
                        updatePassportMutation.isPending
                            ? "Saving..."
                            : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Form Field */
/* -------------------------------------------------------------------------- */

interface FormFieldProps {
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}

function FormField({
    label,
    error,
    children,
}: FormFieldProps) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
            </label>

            {children}

            {error && (
                <p className="mt-1.5 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Input Styling */
/* -------------------------------------------------------------------------- */

function inputClass(disabled = false) {
    return [
        "h-10 w-full rounded-lg border px-3 text-sm outline-none transition",
        "placeholder:text-slate-400",
        disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500"
            : "border-slate-200 bg-white text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
    ].join(" ");
}

/* -------------------------------------------------------------------------- */
/* Loading */
/* -------------------------------------------------------------------------- */

function LoadingState() {
    return (
        <div className="space-y-6">
            <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

            <div className="space-y-2">
                <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-96 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />

            <div className="h-48 animate-pulse rounded-xl bg-slate-100" />

            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
        </div>
    );
}
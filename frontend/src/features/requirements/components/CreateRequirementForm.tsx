import type { ReactNode } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

import {
    createMaterialRequirement,
    updateMaterialRequirement,
    type MaterialRequirement,
    type CreateMaterialRequirementInput,
    type UpdateMaterialRequirementInput,
} from "../services/requirementService";

import { MATERIAL_TYPES } from "../constants/materialTypes";

interface CreateRequirementFormProps {
    projectId: string;
    mode?: "create" | "edit";
    initialData?: MaterialRequirement;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface RequirementFormValues {
    materialType: string;
    subtype: string;
    quantity: string;
    unit: string;
    requiredCondition: string;
    length: string;
    width: string;
    height: string;
    diameter: string;
    intendedApplication: string;
}

const UNITS = [
    "pieces",
    "meters",
    "kg",
    "tons",
    "m³",
    "m²",
];

export function CreateRequirementForm({
    projectId,
    mode = "create",
    initialData,
    onSuccess,
    onCancel,
}: CreateRequirementFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RequirementFormValues>({
        defaultValues: {
            materialType: "",
            subtype: "",
            quantity: "",
            unit: "",
            requiredCondition: "",
            length: "",
            width: "",
            height: "",
            diameter: "",
            intendedApplication: "",
        },
    });

    useEffect(() => {
        if (mode === "edit" && initialData) {
            reset({
                materialType: initialData.materialType,
                subtype: initialData.subtype ?? "",
                quantity: String(initialData.quantity),
                unit: initialData.unit,
                requiredCondition:
                    initialData.requiredCondition !== null
                        ? String(initialData.requiredCondition)
                        : "",
                length:
                    initialData.length !== null
                        ? String(initialData.length)
                        : "",
                width:
                    initialData.width !== null
                        ? String(initialData.width)
                        : "",
                height:
                    initialData.height !== null
                        ? String(initialData.height)
                        : "",
                diameter:
                    initialData.diameter !== null
                        ? String(initialData.diameter)
                        : "",
                intendedApplication:
                    initialData.intendedApplication ?? "",
            });
        }
    }, [mode, initialData, reset]);

    const onSubmit = async (values: RequirementFormValues) => {
        if (mode === "edit" && initialData) {
            const input: UpdateMaterialRequirementInput = {
                materialType: values.materialType,
                subtype: values.subtype.trim() || undefined,
                quantity: Number(values.quantity),
                unit: values.unit,

                requiredCondition:
                    values.requiredCondition !== ""
                        ? Number(values.requiredCondition)
                        : undefined,

                length:
                    values.length !== ""
                        ? Number(values.length)
                        : undefined,

                width:
                    values.width !== ""
                        ? Number(values.width)
                        : undefined,

                height:
                    values.height !== ""
                        ? Number(values.height)
                        : undefined,

                diameter:
                    values.diameter !== ""
                        ? Number(values.diameter)
                        : undefined,

                intendedApplication:
                    values.intendedApplication.trim() || undefined,
            };

            await updateMaterialRequirement(
                initialData.id,
                input
            );
        } else {
            const input: CreateMaterialRequirementInput = {
                materialType: values.materialType,
                subtype: values.subtype.trim() || undefined,
                quantity: Number(values.quantity),
                unit: values.unit,

                requiredCondition:
                    values.requiredCondition !== ""
                        ? Number(values.requiredCondition)
                        : undefined,

                length:
                    values.length !== ""
                        ? Number(values.length)
                        : undefined,

                width:
                    values.width !== ""
                        ? Number(values.width)
                        : undefined,

                height:
                    values.height !== ""
                        ? Number(values.height)
                        : undefined,

                diameter:
                    values.diameter !== ""
                        ? Number(values.diameter)
                        : undefined,

                intendedApplication:
                    values.intendedApplication.trim() || undefined,
            };

            await createMaterialRequirement(
                projectId,
                input
            );

            reset();
        }

        onSuccess?.();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            {/* Basic Information */}
            <Card>
                <div className="border-b border-slate-200 pb-5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Requirement Information
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Specify the material required for this project.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Material Type */}
                    <FormField
                        label="Material Type"
                        required
                        error={errors.materialType?.message}
                    >
                        <select
                            {...register("materialType", {
                                required:
                                    "Material type is required",
                            })}
                            className={inputClass(
                                !!errors.materialType
                            )}
                        >
                            <option value="">
                                Select material type
                            </option>

                            {MATERIAL_TYPES.map((type) => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {formatLabel(type)}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    {/* Subtype */}
                    <FormField
                        label="Subtype"
                        error={errors.subtype?.message}
                    >
                        <input
                            {...register("subtype", {
                                maxLength: {
                                    value: 100,
                                    message:
                                        "Subtype must not exceed 100 characters",
                                },
                            })}
                            placeholder="e.g. Red brick"
                            className={inputClass(
                                !!errors.subtype
                            )}
                        />
                    </FormField>

                    {/* Quantity */}
                    <FormField
                        label="Quantity"
                        required
                        error={errors.quantity?.message}
                    >
                        <input
                            type="number"
                            step="any"
                            min="0"
                            {...register("quantity", {
                                required:
                                    "Quantity is required",
                                validate: (value) =>
                                    Number(value) > 0 ||
                                    "Quantity must be greater than 0",
                            })}
                            placeholder="e.g. 500"
                            className={inputClass(
                                !!errors.quantity
                            )}
                        />
                    </FormField>

                    {/* Unit */}
                    <FormField
                        label="Unit"
                        required
                        error={errors.unit?.message}
                    >
                        <select
                            {...register("unit", {
                                required: "Unit is required",
                            })}
                            className={inputClass(
                                !!errors.unit
                            )}
                        >
                            <option value="">
                                Select unit
                            </option>

                            {UNITS.map((unit) => (
                                <option
                                    key={unit}
                                    value={unit}
                                >
                                    {unit}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
            </Card>

            {/* Physical Requirements */}
            <Card>
                <div className="border-b border-slate-200 pb-5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Physical Requirements
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Specify the required dimensions and minimum
                        condition for the material.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Required Condition */}
                    <FormField
                        label="Required Condition"
                        hint="0–100"
                        error={
                            errors.requiredCondition?.message
                        }
                    >
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            {...register(
                                "requiredCondition",
                                {
                                    validate: (value) => {
                                        if (value === "") {
                                            return true;
                                        }

                                        const number = Number(value);

                                        return (
                                            (number >= 0 &&
                                                number <= 100) ||
                                            "Condition must be between 0 and 100"
                                        );
                                    },
                                }
                            )}
                            placeholder="e.g. 70"
                            className={inputClass(
                                !!errors.requiredCondition
                            )}
                        />
                    </FormField>

                    {/* Length */}
                    <FormField
                        label="Length"
                        error={errors.length?.message}
                    >
                        <input
                            type="number"
                            step="any"
                            min="0"
                            {...register("length", {
                                validate: (value) => {
                                    if (value === "") {
                                        return true;
                                    }

                                    return (
                                        Number(value) > 0 ||
                                        "Length must be greater than 0"
                                    );
                                },
                            })}
                            placeholder="e.g. 2.5"
                            className={inputClass(
                                !!errors.length
                            )}
                        />
                    </FormField>

                    {/* Width */}
                    <FormField
                        label="Width"
                        error={errors.width?.message}
                    >
                        <input
                            type="number"
                            step="any"
                            min="0"
                            {...register("width", {
                                validate: (value) => {
                                    if (value === "") {
                                        return true;
                                    }

                                    return (
                                        Number(value) > 0 ||
                                        "Width must be greater than 0"
                                    );
                                },
                            })}
                            placeholder="e.g. 1.2"
                            className={inputClass(
                                !!errors.width
                            )}
                        />
                    </FormField>

                    {/* Height */}
                    <FormField
                        label="Height"
                        error={errors.height?.message}
                    >
                        <input
                            type="number"
                            step="any"
                            min="0"
                            {...register("height", {
                                validate: (value) => {
                                    if (value === "") {
                                        return true;
                                    }

                                    return (
                                        Number(value) > 0 ||
                                        "Height must be greater than 0"
                                    );
                                },
                            })}
                            placeholder="e.g. 0.5"
                            className={inputClass(
                                !!errors.height
                            )}
                        />
                    </FormField>

                    {/* Diameter */}
                    <FormField
                        label="Diameter"
                        error={errors.diameter?.message}
                    >
                        <input
                            type="number"
                            step="any"
                            min="0"
                            {...register("diameter", {
                                validate: (value) => {
                                    if (value === "") {
                                        return true;
                                    }

                                    return (
                                        Number(value) > 0 ||
                                        "Diameter must be greater than 0"
                                    );
                                },
                            })}
                            placeholder="e.g. 0.1"
                            className={inputClass(
                                !!errors.diameter
                            )}
                        />
                    </FormField>
                </div>
            </Card>

            {/* Application */}
            <Card>
                <div className="border-b border-slate-200 pb-5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Intended Application
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Describe how the required material will be
                        used in the project.
                    </p>
                </div>

                <div className="mt-6">
                    <FormField
                        label="Intended Application"
                        error={
                            errors.intendedApplication?.message
                        }
                    >
                        <textarea
                            {...register("intendedApplication", {
                                maxLength: {
                                    value: 255,
                                    message:
                                        "Intended application must not exceed 255 characters",
                                },
                            })}
                            rows={4}
                            placeholder="e.g. Flooring for residential rooms"
                            className={[
                                "w-full rounded-lg border bg-white px-3 py-2.5",
                                "text-sm text-slate-900 outline-none transition",
                                "placeholder:text-slate-400",
                                "focus:ring-2 focus:ring-slate-100",
                                errors.intendedApplication
                                    ? "border-red-300 focus:border-red-400"
                                    : "border-slate-200 focus:border-slate-400",
                            ].join(" ")}
                        />
                    </FormField>
                </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? mode === "edit"
                            ? "Saving..."
                            : "Creating..."
                        : mode === "edit"
                        ? "Save Changes"
                        : "Create Requirement"}
                </Button>
            </div>
        </form>
    );
}

/* -------------------------------------------------------------------------- */
/* Form Field */
/* -------------------------------------------------------------------------- */

interface FormFieldProps {
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: ReactNode;
}

function FormField({
    label,
    required,
    hint,
    error,
    children,
}: FormFieldProps) {
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-slate-700">
                    {label}

                    {required && (
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    )}
                </label>

                {hint && (
                    <span className="text-xs text-slate-400">
                        {hint}
                    </span>
                )}
            </div>

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

function inputClass(hasError = false) {
    return [
        "h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition",
        "placeholder:text-slate-400",
        "focus:ring-2 focus:ring-slate-100",
        hasError
            ? "border-red-300 focus:border-red-400"
            : "border-slate-200 focus:border-slate-400",
    ].join(" ");
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
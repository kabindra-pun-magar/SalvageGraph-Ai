import type { ReactNode } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

import {
    createMaterial,
    updateMaterial,
    type CreateMaterialInput,
    type Material,
    type UpdateMaterialInput,
} from "../services/materialService";

interface CreateMaterialFormProps {
    mode?: "create" | "edit";
    initialData?: Material;
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface MaterialFormValues {
    materialCode: string;
    type: string;
    subtype: string;
    quantity: string;
    unit: string;
    length: string;
    width: string;
    height: string;
    diameter: string;
    conditionScore: string;
    age: string;
    sourceProjectId: string;
    location: string;
    latitude: string;
    longitude: string;
}

const MATERIAL_TYPES = [
    "TILE",
    "BRICK",
    "PIPE",
    "REBAR",
    "TIMBER",
    "CONCRETE",
    "SAND",
    "WOOD",
    "GLASS",
    "OTHER",
];

const UNITS = [
    "pieces",
    "meters",
    "kg",
    "tons",
    "m³",
    "m²",
];

export function CreateMaterialForm({
    mode = "create",
    initialData,
    onSuccess,
    onCancel,
}: CreateMaterialFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<MaterialFormValues>({
        defaultValues: {
            materialCode: "",
            type: "",
            subtype: "",
            quantity: "",
            unit: "",
            length: "",
            width: "",
            height: "",
            diameter: "",
            conditionScore: "",
            age: "",
            sourceProjectId: "",
            location: "",
            latitude: "",
            longitude: "",
        },
    });

    useEffect(() => {
        if (mode === "edit" && initialData) {
            reset({
                materialCode: initialData.materialCode,
                type: initialData.type,
                subtype: initialData.subtype ?? "",
                quantity: String(initialData.quantity),
                unit: initialData.unit,

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

                conditionScore:
                    initialData.conditionScore !== null
                        ? String(initialData.conditionScore)
                        : "",

                age:
                    initialData.age !== null
                        ? String(initialData.age)
                        : "",

                sourceProjectId:
                    initialData.sourceProjectId ?? "",

                location:
                    initialData.location ?? "",

                latitude:
                    initialData.latitude !== null
                        ? String(initialData.latitude)
                        : "",

                longitude:
                    initialData.longitude !== null
                        ? String(initialData.longitude)
                        : "",
            });
        }
    }, [mode, initialData, reset]);

    const onSubmit = async (values: MaterialFormValues) => {
        const input: CreateMaterialInput = {
            materialCode: values.materialCode.trim(),
            type: values.type,
            subtype: values.subtype.trim() || undefined,
            quantity: Number(values.quantity),
            unit: values.unit,

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

            conditionScore:
                values.conditionScore !== ""
                    ? Number(values.conditionScore)
                    : undefined,

            age:
                values.age !== ""
                    ? Number(values.age)
                    : undefined,

            sourceProjectId:
                values.sourceProjectId.trim() || undefined,

            location:
                values.location.trim() || undefined,

            latitude:
                values.latitude !== ""
                    ? Number(values.latitude)
                    : undefined,

            longitude:
                values.longitude !== ""
                    ? Number(values.longitude)
                    : undefined,
        };

        if (mode === "edit" && initialData) {
            const updateInput: UpdateMaterialInput = input;

            await updateMaterial(
                initialData.id,
                updateInput
            );
        } else {
            await createMaterial(input);
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
                        Basic Information
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Enter the basic information about the
                        construction material.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                        label="Material Code"
                        required
                        error={errors.materialCode?.message}
                    >
                        <input
                            {...register("materialCode", {
                                required:
                                    "Material code is required",
                                minLength: {
                                    value: 2,
                                    message:
                                        "Material code must contain at least 2 characters",
                                },
                            })}
                            placeholder="e.g. MAT-001"
                            className={inputClass(
                                !!errors.materialCode
                            )}
                        />
                    </FormField>

                    <FormField
                        label="Material Type"
                        required
                        error={errors.type?.message}
                    >
                        <select
                            {...register("type", {
                                required:
                                    "Material type is required",
                            })}
                            className={inputClass(
                                !!errors.type
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

                    <FormField
                        label="Subtype"
                        error={errors.subtype?.message}
                    >
                        <input
                            {...register("subtype")}
                            placeholder="e.g. Red brick"
                            className={inputClass()}
                        />
                    </FormField>

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

                    <FormField
                        label="Unit"
                        required
                        error={errors.unit?.message}
                    >
                        <select
                            {...register("unit", {
                                required:
                                    "Unit is required",
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

            {/* Physical Information */}
            <Card>
                <div className="border-b border-slate-200 pb-5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Physical Information
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Add dimensions and physical condition
                        information when available.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <FormField
                        label="Length"
                        error={errors.length?.message}
                    >
                        <input
                            type="number"
                            step="any"
                            min="0"
                            {...register("length")}
                            placeholder="e.g. 2.5"
                            className={inputClass()}
                        />
                    </FormField>

                    <FormField
                        label="Width"
                        error={errors.width?.message}
                    >
                        <input
                            type="number"
                            step="any"
                            min="0"
                            {...register("width")}
                            placeholder="e.g. 1.2"
                            className={inputClass()}
                        />
                    </FormField>

                    <FormField
                        label="Height"
                        error={errors.height?.message}
                    >
                        <input
                            type="number"
                            step="any"
                            min="0"
                            {...register("height")}
                            placeholder="e.g. 0.5"
                            className={inputClass()}
                        />
                    </FormField>

                    <FormField
                        label="Diameter"
                        error={errors.diameter?.message}
                    >
                        <input
                            type="number"
                            step="any"
                            min="0"
                            {...register("diameter")}
                            placeholder="e.g. 0.1"
                            className={inputClass()}
                        />
                    </FormField>

                    <FormField
                        label="Condition Score"
                        hint="0–100"
                        error={
                            errors.conditionScore?.message
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
                                    validate: (value) => {
                                        if (value === "") {
                                            return true;
                                        }

                                        const number =
                                            Number(value);

                                        return (
                                            (number >= 0 &&
                                                number <= 100) ||
                                            "Condition score must be between 0 and 100"
                                        );
                                    },
                                }
                            )}
                            placeholder="e.g. 85"
                            className={inputClass(
                                !!errors.conditionScore
                            )}
                        />
                    </FormField>

                    <FormField
                        label="Age"
                        hint="Years"
                        error={errors.age?.message}
                    >
                        <input
                            type="number"
                            min="0"
                            step="1"
                            {...register("age")}
                            placeholder="e.g. 5"
                            className={inputClass()}
                        />
                    </FormField>
                </div>
            </Card>

            {/* Location */}
            <Card>
                <div className="border-b border-slate-200 pb-5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Location
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Specify where the material is currently
                        located.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <FormField
                            label="Location"
                            error={errors.location?.message}
                        >
                            <input
                                {...register("location")}
                                placeholder="e.g. Surkhet, Nepal"
                                className={inputClass()}
                            />
                        </FormField>
                    </div>

                    <FormField
                        label="Latitude"
                        hint="-90 to 90"
                        error={errors.latitude?.message}
                    >
                        <input
                            type="number"
                            step="any"
                            min="-90"
                            max="90"
                            {...register("latitude", {
                                validate: (value) => {
                                    if (value === "") {
                                        return true;
                                    }

                                    const number =
                                        Number(value);

                                    return (
                                        (number >= -90 &&
                                            number <= 90) ||
                                        "Latitude must be between -90 and 90"
                                    );
                                },
                            })}
                            placeholder="e.g. 28.6000"
                            className={inputClass(
                                !!errors.latitude
                            )}
                        />
                    </FormField>

                    <FormField
                        label="Longitude"
                        hint="-180 to 180"
                        error={errors.longitude?.message}
                    >
                        <input
                            type="number"
                            step="any"
                            min="-180"
                            max="180"
                            {...register("longitude", {
                                validate: (value) => {
                                    if (value === "") {
                                        return true;
                                    }

                                    const number =
                                        Number(value);

                                    return (
                                        (number >= -180 &&
                                            number <= 180) ||
                                        "Longitude must be between -180 and 180"
                                    );
                                },
                            })}
                            placeholder="e.g. 81.6330"
                            className={inputClass(
                                !!errors.longitude
                            )}
                        />
                    </FormField>
                </div>
            </Card>

            {/* Source Information */}
            <Card>
                <div className="border-b border-slate-200 pb-5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Source Information
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Optionally associate this material with
                        its source project.
                    </p>
                </div>

                <div className="mt-6">
                    <FormField
                        label="Source Project ID"
                        error={
                            errors.sourceProjectId?.message
                        }
                    >
                        <input
                            {...register("sourceProjectId")}
                            placeholder="Project UUID"
                            className={inputClass()}
                        />
                    </FormField>

                    <p className="mt-2 text-xs text-slate-400">
                        Leave this empty if the material is not
                        associated with a source project.
                    </p>
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
                            : "Registering..."
                        : mode === "edit"
                            ? "Save Changes"
                            : "Register Material"}
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
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
}
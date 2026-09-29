import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useCreateProject } from "../hooks/useCreateProject";
import { useUpdateProject } from "../hooks/useUpdateProject";

const createProjectSchema = z.object({
    name: z
        .string()
        .min(2, "Project name must be at least 2 characters")
        .max(150, "Project name must not exceed 150 characters"),

    description: z
        .string()
        .max(1000, "Description must not exceed 1000 characters")
        .optional(),

    location: z
        .string()
        .min(2, "Location is required")
        .max(255, "Location must not exceed 255 characters"),

    latitude: z
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
        .optional(),

    longitude: z
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
        .optional(),

    budget: z
        .number()
        .positive("Budget must be greater than 0")
        .optional(),

    deadline: z.string().optional(),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

interface CreateProjectFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: {
        id?: string;
        name: string;
        description: string | null;
        location: string;
        latitude: number | null;
        longitude: number | null;
        budget: string | number | null;
        deadline: string | null;
    };
    mode?: "create" | "edit";
}

export function CreateProjectForm({
    onSuccess,
    onCancel,
    initialData,
    mode = "create",
}: CreateProjectFormProps) {
    const createProjectMutation = useCreateProject();
    const updateProjectMutation = useUpdateProject();

    const isEditMode = mode === "edit";

    const {
        register,
        handleSubmit,
        formState: { errors},
    } = useForm<CreateProjectFormData>({
        resolver: zodResolver(createProjectSchema),

        defaultValues: {
            name: initialData?.name ?? "",
            description: initialData?.description ?? "",
            location: initialData?.location ?? "",
            latitude: initialData?.latitude ?? undefined,
            longitude: initialData?.longitude ?? undefined,
            budget:
                initialData?.budget !== null &&
                initialData?.budget !== undefined
                    ? Number(initialData.budget)
                    : undefined,
            deadline: initialData?.deadline
                ? new Date(initialData.deadline).toISOString().slice(0, 16)
                : "",
        },
    });

    const isPending =
        createProjectMutation.isPending || updateProjectMutation.isPending;

    const isError =
        createProjectMutation.isError || updateProjectMutation.isError;

    const onSubmit = async (data: CreateProjectFormData) => {
        try {
            const payload = {
                name: data.name.trim(),
                description: data.description?.trim() || undefined,
                location: data.location.trim(),
                latitude: data.latitude,
                longitude: data.longitude,
                budget: data.budget,
                deadline: data.deadline
                    ? new Date(data.deadline).toISOString()
                    : undefined,
            };

            if (isEditMode && initialData?.id) {
                await updateProjectMutation.mutateAsync({
                    projectId: initialData.id,
                    input: payload,
                });
            } else {
                await createProjectMutation.mutateAsync(payload);
            }

            onSuccess();
        } catch {
            // Error is handled by the mutation state.
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            {/* Basic information */}
            <div>
                <h3 className="text-sm font-semibold text-slate-900">
                    Project information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    {isEditMode
                        ? "Update the basic details of the construction project."
                        : "Add the basic details of the construction project."}
                </p>
            </div>

            <div className="space-y-4">
                <Input
                    label="Project name"
                    placeholder="e.g. Kathmandu Commercial Complex"
                    error={errors.name?.message}
                    {...register("name")}
                />

                <div>
                    <label
                        htmlFor="description"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        rows={4}
                        placeholder="Briefly describe the project..."
                        className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        {...register("description")}
                    />

                    {errors.description && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.description.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Location */}
            <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-900">
                    Project location
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Location information can later be used for GIS and
                    material matching.
                </p>
            </div>

            <div className="space-y-4">
                <Input
                    label="Location"
                    placeholder="e.g. Kathmandu, Nepal"
                    error={errors.location?.message}
                    {...register("location")}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        label="Latitude"
                        type="number"
                        step="any"
                        placeholder="e.g. 27.7172"
                        error={errors.latitude?.message}
                        {...register("latitude", {
                            setValueAs: (value) =>
                                value === "" ? undefined : Number(value),
                        })}
                    />

                    <Input
                        label="Longitude"
                        type="number"
                        step="any"
                        placeholder="e.g. 85.3240"
                        error={errors.longitude?.message}
                        {...register("longitude", {
                            setValueAs: (value) =>
                                value === "" ? undefined : Number(value),
                        })}
                    />
                </div>
            </div>

            {/* Project planning */}
            <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-900">
                    Project planning
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Optional financial and scheduling information.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                    label="Budget"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 5000000"
                    error={errors.budget?.message}
                    {...register("budget", {
                        setValueAs: (value) =>
                            value === "" ? undefined : Number(value),
                    })}
                />

                <Input
                    label="Deadline"
                    type="datetime-local"
                    error={errors.deadline?.message}
                    {...register("deadline")}
                />
            </div>

            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {isEditMode
                        ? "Unable to update the project. Please check your information and try again."
                        : "Unable to create the project. Please check your information and try again."}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isPending}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isPending}
                >
                    {isPending
                        ? isEditMode
                            ? "Saving..."
                            : "Creating..."
                        : isEditMode
                          ? "Save changes"
                          : "Create project"}
                </Button>
            </div>
        </form>
    );
}
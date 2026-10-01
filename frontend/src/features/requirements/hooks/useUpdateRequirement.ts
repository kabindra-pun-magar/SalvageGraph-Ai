import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    updateMaterialRequirement,
    type UpdateMaterialRequirementInput,
} from "../services/requirementService";

interface UpdateRequirementVariables {
    requirementId: string;
    projectId: string;
    input: UpdateMaterialRequirementInput;
}

export function useUpdateRequirement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            requirementId,
            input,
        }: UpdateRequirementVariables) =>
            updateMaterialRequirement(requirementId, input),

        onSuccess: (requirement) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "requirements",
                    requirement.projectId,
                ],
            });

            queryClient.setQueryData(
                ["requirement", requirement.id],
                requirement
            );
        },
    });
}
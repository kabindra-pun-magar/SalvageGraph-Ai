import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMaterialRequirement } from "../services/requirementService";

interface DeleteRequirementVariables {
    requirementId: string;
    projectId: string;
}

export function useDeleteRequirement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            requirementId,
        }: DeleteRequirementVariables) =>
            deleteMaterialRequirement(requirementId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "requirements",
                    variables.projectId,
                ],
            });

            queryClient.removeQueries({
                queryKey: [
                    "requirement",
                    variables.requirementId,
                ],
            });
        },
    });
}
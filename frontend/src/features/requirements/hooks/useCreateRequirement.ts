import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createMaterialRequirement,
    type CreateMaterialRequirementInput,
} from "../services/requirementService";

interface CreateRequirementVariables {
    projectId: string;
    input: CreateMaterialRequirementInput;
}

export function useCreateRequirement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            projectId,
            input,
        }: CreateRequirementVariables) =>
            createMaterialRequirement(projectId, input),

        onSuccess: (requirement) => {
            queryClient.invalidateQueries({
                queryKey: [
                    "requirements",
                    requirement.projectId,
                ],
            });
        },
    });
}
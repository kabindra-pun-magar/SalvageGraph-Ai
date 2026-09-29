import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    updateMaterial,
    type UpdateMaterialInput,
} from "../services/materialService";

interface UpdateMaterialVariables {
    materialId: string;
    input: UpdateMaterialInput;
}

export function useUpdateMaterial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            materialId,
            input,
        }: UpdateMaterialVariables) =>
            updateMaterial(materialId, input),

        onSuccess: (material) => {
            queryClient.invalidateQueries({
                queryKey: ["materials"],
            });

            queryClient.setQueryData(
                ["material", material.id],
                material,
            );
        },
    });
}
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createMaterial,
    type CreateMaterialInput,
} from "../services/materialService";

export function useCreateMaterial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateMaterialInput) =>
            createMaterial(input),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["materials"],
            });
        },
    });
}
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { deleteMaterial } from "../services/materialService";

export function useDeleteMaterial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMaterial,

        onSuccess: (_, materialId) => {
            queryClient.invalidateQueries({
                queryKey: ["materials"],
            });

            queryClient.removeQueries({
                queryKey: ["material", materialId],
            });
        },
    });
}
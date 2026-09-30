import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { createPassport } from "../services/passportService";

export function useCreatePassport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (materialId: string) =>
            createPassport(materialId),

        onSuccess: (passport) => {
            queryClient.setQueryData(
                ["passport", passport.materialId],
                passport
            );

            queryClient.invalidateQueries({
                queryKey: ["material", passport.materialId],
            });
        },
    });
}
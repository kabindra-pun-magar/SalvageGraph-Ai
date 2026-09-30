import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    updatePassport,
    type UpdatePassportInput,
} from "../services/passportService";

interface UpdatePassportVariables {
    passportId: string;
    materialId: string;
    input: UpdatePassportInput;
}

export function useUpdatePassport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            passportId,
            input,
        }: UpdatePassportVariables) =>
            updatePassport(passportId, input),

        onSuccess: (passport) => {
            queryClient.setQueryData(
                ["passport", passport.materialId],
                passport
            );

            queryClient.invalidateQueries({
                queryKey: ["material", passport.materialId],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "material-history",
                    passport.materialId,
                ],
            });
        },
    });
}
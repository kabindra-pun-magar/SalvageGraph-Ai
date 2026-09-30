import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { generatePassportQRCode } from "../services/passportService";

interface GeneratePassportQRVariables {
    passportId: string;
    materialId: string;
}

export function useGeneratePassportQR() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            passportId,
        }: GeneratePassportQRVariables) =>
            generatePassportQRCode(passportId),

        onSuccess: (passport) => {
            queryClient.setQueryData(
                ["passport", passport.materialId],
                passport
            );

            queryClient.invalidateQueries({
                queryKey: [
                    "material-history",
                    passport.materialId,
                ],
            });
        },
    });
}
import { useQuery } from "@tanstack/react-query";

import { getPassport } from "../services/passportService";

export function usePassport(
    materialId: string | undefined
) {
    return useQuery({
        queryKey: ["passport", materialId],
        queryFn: () => getPassport(materialId!),
        enabled: Boolean(materialId),
    });
}
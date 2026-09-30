import { useQuery } from "@tanstack/react-query";

import { getMaterialHistory } from "../services/passportService";

export function useMaterialHistory(
    materialId: string | undefined
) {
    return useQuery({
        queryKey: ["material-history", materialId],
        queryFn: () => getMaterialHistory(materialId!),
        enabled: Boolean(materialId),
    });
}
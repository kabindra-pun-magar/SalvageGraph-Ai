import { useQuery } from "@tanstack/react-query";
import { getMaterialById } from "../services/materialService";

export function useMaterial(materialId: string | undefined) {
    return useQuery({
        queryKey: ["material", materialId],
        queryFn: () => getMaterialById(materialId!),
        enabled: Boolean(materialId),
    });
}
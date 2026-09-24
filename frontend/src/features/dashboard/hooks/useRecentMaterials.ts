import { useQuery } from "@tanstack/react-query";
import { getRecentMaterials } from "../services/materialService";

export function useRecentMaterials() {
    return useQuery({
        queryKey: ["materials", "recent"],
        queryFn: getRecentMaterials,
    });
}
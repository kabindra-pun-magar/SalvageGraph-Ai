import { useQuery } from "@tanstack/react-query";
import { getMaterials } from "../services/materialService";

export function useMaterials() {
    return useQuery({
        queryKey: ["materials"],
        queryFn: getMaterials,
    });
}
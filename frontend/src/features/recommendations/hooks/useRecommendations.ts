import { useQuery } from "@tanstack/react-query";

import {
    getRecommendations,
} from "../services/recommendationService";

export function useRecommendations() {
    return useQuery({
        queryKey: ["recommendations"],
        queryFn: getRecommendations,
    });
}
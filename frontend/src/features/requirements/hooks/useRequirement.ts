import { useQuery } from "@tanstack/react-query";

import { getMaterialRequirement } from "../services/requirementService";

export function useRequirement(
    requirementId: string | undefined
) {
    return useQuery({
        queryKey: ["requirement", requirementId],
        queryFn: () =>
            getMaterialRequirement(requirementId!),
        enabled: Boolean(requirementId),
    });
}
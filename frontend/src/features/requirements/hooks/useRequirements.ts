import { useQuery } from "@tanstack/react-query";

import { getProjectRequirements } from "../services/requirementService";

export function useRequirements(
    projectId: string | undefined
) {
    return useQuery({
        queryKey: ["requirements", projectId],
        queryFn: () =>
            getProjectRequirements(projectId!),
        enabled: Boolean(projectId),
    });
}
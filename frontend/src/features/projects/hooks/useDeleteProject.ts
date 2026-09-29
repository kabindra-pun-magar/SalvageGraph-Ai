import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../services/projectService";

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProject,

        onSuccess: (_, projectId) => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });

            queryClient.removeQueries({
                queryKey: ["project", projectId],
            });
        },
    });
}
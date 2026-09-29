import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    updateProject,
    type UpdateProjectInput,
} from "../services/projectService";

interface UpdateProjectVariables {
    projectId: string;
    input: UpdateProjectInput;
}

export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            projectId,
            input,
        }: UpdateProjectVariables) =>
            updateProject(projectId, input),

        onSuccess: (project) => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });

            queryClient.setQueryData(
                ["project", project.id],
                project
            );
        },
    });
}
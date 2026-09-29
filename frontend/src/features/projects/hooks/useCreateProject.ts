import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createProject,
    type CreateProjectInput,
} from "../services/projectService";

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateProjectInput) =>
            createProject(input),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });
        },
    });
}
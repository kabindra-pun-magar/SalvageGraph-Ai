import { useQuery } from "@tanstack/react-query";
import {
    getProjectById,
    getProjects,
} from "../services/projectService";

export function useProject(projectId?: string) {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getProjectById(projectId as string),
        enabled: Boolean(projectId),
    });
}

export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: getProjects,
    });
}
import { useQuery } from "@tanstack/react-query";
import { getRecentProjects } from "../services/projectService";

export function useRecentProjects() {
    return useQuery({
        queryKey: ["projects", "recent"],
        queryFn: getRecentProjects,
    });
}
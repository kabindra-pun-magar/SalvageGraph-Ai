import { api } from "../../../services/api";

export interface RecentProject {
    id: string;
    name: string;
    location: string | null;
    deadline: string | null;
    createdAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function getRecentProjects(): Promise<RecentProject[]> {
    const response = await api.get<ApiResponse<RecentProject[]>>(
        "/projects/recent",
    );

    return response.data.data;
}
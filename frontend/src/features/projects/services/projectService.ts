import { api } from "../../../services/api";

export interface Project {
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

export async function getProjects(): Promise<Project[]> {
    const response = await api.get<ApiResponse<Project[]>>(
        "/projects",
    );

    return response.data.data;
}
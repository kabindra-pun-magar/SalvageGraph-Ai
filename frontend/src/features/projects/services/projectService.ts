import { api } from "../../../services/api";

export interface Project {
    id: string;
    name: string;
    location: string | null;
    deadline: string | null;
    createdAt: string;
}

export interface CreateProjectInput {
    name: string;
    description?: string;
    location: string;
    latitude?: number;
    longitude?: number;
    budget?: number;
    deadline?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function getProjects(): Promise<Project[]> {
    const response = await api.get<ApiResponse<Project[]>>(
        "/projects"
    );

    return response.data.data;
}

export async function createProject(
    input: CreateProjectInput
): Promise<Project> {
    const response = await api.post<ApiResponse<Project>>(
        "/projects",
        input
    );

    return response.data.data;
}

export interface ProjectDetails extends Project {
    description: string | null;
    latitude: number | null;
    longitude: number | null;
    budget: string | number | null;
    updatedAt: string;
}

export async function getProjectById(
    projectId: string
): Promise<ProjectDetails> {
    const response = await api.get<ApiResponse<ProjectDetails>>(
        `/projects/${projectId}`
    );

    return response.data.data;
}

export interface UpdateProjectInput {
    name?: string;
    description?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    budget?: number;
    deadline?: string;
}

export async function updateProject(
    projectId: string,
    input: UpdateProjectInput
): Promise<ProjectDetails> {
    const response = await api.put<ApiResponse<ProjectDetails>>(
        `/projects/${projectId}`,
        input
    );

    return response.data.data;
}

export async function deleteProject(
    projectId: string
): Promise<void> {
    await api.delete(`/projects/${projectId}`);
}
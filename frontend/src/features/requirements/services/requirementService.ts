import { api } from "../../../services/api";

export interface MaterialRequirement {
    id: string;
    projectId: string;
    materialType: string;
    subtype: string | null;

    quantity: string | number;
    unit: string;

    requiredCondition: number | null;

    length: number | null;
    width: number | null;
    height: number | null;
    diameter: number | null;

    intendedApplication: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface CreateMaterialRequirementInput {
    materialType: string;
    subtype?: string;
    quantity: number;
    unit: string;
    requiredCondition?: number;
    length?: number;
    width?: number;
    height?: number;
    diameter?: number;
    intendedApplication?: string;
}

export interface UpdateMaterialRequirementInput {
    materialType?: string;
    subtype?: string;
    quantity?: number;
    unit?: string;
    requiredCondition?: number;
    length?: number;
    width?: number;
    height?: number;
    diameter?: number;
    intendedApplication?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function getProjectRequirements(
    projectId: string
): Promise<MaterialRequirement[]> {
    const response = await api.get<
        ApiResponse<MaterialRequirement[]>
    >(`/projects/${projectId}/requirements`);

    return response.data.data;
}

export async function getMaterialRequirement(
    requirementId: string
): Promise<MaterialRequirement> {
    const response = await api.get<
        ApiResponse<MaterialRequirement>
    >(`/requirements/${requirementId}`);

    return response.data.data;
}

export async function createMaterialRequirement(
    projectId: string,
    input: CreateMaterialRequirementInput
): Promise<MaterialRequirement> {
    const response = await api.post<
        ApiResponse<MaterialRequirement>
    >(`/projects/${projectId}/requirements`, input);

    return response.data.data;
}

export async function updateMaterialRequirement(
    requirementId: string,
    input: UpdateMaterialRequirementInput
): Promise<MaterialRequirement> {
    const response = await api.put<
        ApiResponse<MaterialRequirement>
    >(`/requirements/${requirementId}`, input);

    return response.data.data;
}

export async function deleteMaterialRequirement(
    requirementId: string
): Promise<void> {
    await api.delete(`/requirements/${requirementId}`);
}
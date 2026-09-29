import { api } from "../../../services/api";

export interface Material {
    id: string;
    materialCode: string;
    type: string;
    subtype: string | null;

    quantity: string | number;
    unit: string;
    estimatedUnitValue: string | number | null;

    length: number | null;
    width: number | null;
    height: number | null;
    diameter: number | null;

    conditionScore: number | null;
    age: number | null;

    sourceProjectId: string | null;

    location: string | null;
    latitude: number | null;
    longitude: number | null;

    status: string;
    verification: string;

    registeredById: string;

    createdAt: string;
    updatedAt: string;
}

export interface CreateMaterialInput {
    materialCode: string;
    type: string;
    subtype?: string;

    quantity: number;
    unit: string;
    estimatedUnitValue?: number;

    length?: number;
    width?: number;
    height?: number;
    diameter?: number;

    conditionScore?: number;
    age?: number;

    sourceProjectId?: string;

    location?: string;
    latitude?: number;
    longitude?: number;
}

export interface UpdateMaterialInput {
    materialCode?: string;
    type?: string;
    subtype?: string;

    quantity?: number;
    unit?: string;
    estimatedUnitValue?: number;

    length?: number;
    width?: number;
    height?: number;
    diameter?: number;

    conditionScore?: number;
    age?: number;

    sourceProjectId?: string;

    location?: string;
    latitude?: number;
    longitude?: number;

    status?: string;
    verification?: string;
}

export interface MaterialDetails extends Material {
    images: MaterialImage[];
}

export interface MaterialImage {
    id: string;
    imageUrl: string;
    imageType: string | null;
    aiMetadata: unknown;
    createdAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function getMaterials(): Promise<Material[]> {
    const response = await api.get<ApiResponse<Material[]>>(
        "/materials",
    );

    return response.data.data;
}

export async function getMaterialById(
    materialId: string,
): Promise<MaterialDetails> {
    const response = await api.get<ApiResponse<MaterialDetails>>(
        `/materials/${materialId}`,
    );

    return response.data.data;
}

export async function createMaterial(
    input: CreateMaterialInput,
): Promise<Material> {
    const response = await api.post<ApiResponse<Material>>(
        "/materials",
        input,
    );

    return response.data.data;
}

export async function updateMaterial(
    materialId: string,
    input: UpdateMaterialInput,
): Promise<Material> {
    const response = await api.put<ApiResponse<Material>>(
        `/materials/${materialId}`,
        input,
    );

    return response.data.data;
}

export async function deleteMaterial(
    materialId: string,
): Promise<void> {
    await api.delete(`/materials/${materialId}`);
}
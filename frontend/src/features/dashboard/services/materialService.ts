import { api } from "../../../services/api";

export interface RecentMaterial {
    id: string;
    materialCode: string;
    type: string;
    subtype: string | null;
    quantity: string | number;
    unit: string;
    conditionScore: number | null;
    location: string | null;
    status: string;
    verification: string;
    createdAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function getRecentMaterials(): Promise<RecentMaterial[]> {
    const response = await api.get<ApiResponse<RecentMaterial[]>>(
        "/materials/recent",
    );

    return response.data.data;
}
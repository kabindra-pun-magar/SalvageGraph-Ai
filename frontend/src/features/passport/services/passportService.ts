import { api } from "../../../services/api";

export interface PassportDimensions {
    length: number | null;
    width: number | null;
    height: number | null;
    diameter: number | null;
}

export interface MaterialPassport {
    id: string;
    materialId: string;
    passportCode: string;
    qrCode: string | null;

    materialType: string;
    subtype: string | null;

    dimensions: PassportDimensions | null;

    quantity: string | number;
    unit: string;

    conditionScore: number | null;

    source: string | null;
    location: string | null;

    registeredDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdatePassportInput {
    subtype?: string;

    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
        diameter?: number;
    };

    quantity?: number;
    unit?: string;
    conditionScore?: number;
    source?: string;
    location?: string;
}

export interface MaterialHistory {
    id: string;
    materialId: string;
    action: string;
    description: string | null;
    projectId: string | null;
    metadata: unknown;
    createdAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function createPassport(
    materialId: string
): Promise<MaterialPassport> {
    const response = await api.post<
        ApiResponse<MaterialPassport>
    >(`/materials/${materialId}/passport`);

    return response.data.data;
}

export async function getPassport(
    materialId: string
): Promise<MaterialPassport> {
    const response = await api.get<
        ApiResponse<MaterialPassport>
    >(`/materials/${materialId}/passport`);

    return response.data.data;
}

export async function updatePassport(
    passportId: string,
    input: UpdatePassportInput
): Promise<MaterialPassport> {
    const response = await api.put<
        ApiResponse<MaterialPassport>
    >(`/passports/${passportId}`, input);

    return response.data.data;
}

export async function getMaterialHistory(
    materialId: string
): Promise<MaterialHistory[]> {
    const response = await api.get<
        ApiResponse<MaterialHistory[]>
    >(`/materials/${materialId}/history`);

    return response.data.data;
}

export async function generatePassportQRCode(
    passportId: string
): Promise<MaterialPassport> {
    const response = await api.post<
        ApiResponse<MaterialPassport>
    >(`/passports/${passportId}/qr`);

    return response.data.data;
}
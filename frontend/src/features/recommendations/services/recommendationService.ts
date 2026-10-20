import { api } from "../../../services/api";

export type RecommendationStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

export interface RecommendationEnvironmentalBenefit {
    distanceKm?: number;
    methodology?: string;
    materialType?: string;
    reusedQuantity?: number;
    transportImpact?: number;
    environmentalScore?: number;
    environmentalFactor?: number;
    estimatedAvoidedMaterialImpact?: number;
}

export interface Recommendation {
    id: string;
    matchId: string;
    score: number;
    explanation: string;
    estimatedSaving: number | string | null;
    environmentalBenefit:
        | RecommendationEnvironmentalBenefit
        | null;
    status: RecommendationStatus | string;
    verifiedBy: string | null;
    verificationNote: string | null;
    createdAt: string;
    updatedAt: string;

    match: {
        id: string;
        materialId: string;
        requirementId: string;
        compatibilityScore: number | null;
        conditionScore: number | null;
        quantityScore: number | null;
        dimensionScore: number | null;
        distanceKm: number | null;
        transportCost: number | string | null;
        economicBenefit: number | string | null;
        suitabilityScore: number | null;
        status: string;
        material: {
            id: string;
            materialCode: string;
            type: string;
            subtype: string | null;
            quantity: number | string;
            unit: string;
            conditionScore: number | null;
            location: string | null;
        };
        requirement: {
            id: string;
            materialType: string;
            subtype: string | null;
            quantity: number | string;
            unit: string;
            requiredCondition: number | null;
            intendedApplication: string | null;
            project: {
                id: string;
                name: string;
                location: string | null;
                ownerId: string;
            };
        };
    };
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function getRecommendations(): Promise<
    Recommendation[]
> {
    const response = await api.get<
        ApiResponse<Recommendation[]>
    >("/recommendations");

    return response.data.data;
}
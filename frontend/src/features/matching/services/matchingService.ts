import { api } from "../../../services/api";


export interface Match {

    id: string;

    materialId: string;

    requirementId: string;


    compatibilityScore: number | null;

    conditionScore: number | null;

    quantityScore: number | null;

    dimensionScore: number | null;



    distanceKm: number | null;

    transportCost: number | null;

    economicBenefit: number | null;



    suitabilityScore: number | null;


    status: string;



    material: {

        id: string;

        materialCode: string;

        type: string;

        subtype: string | null;

        quantity: number;

        unit: string;

        conditionScore: number | null;

        location: string | null;

    };



    requirement: {

        id: string;

        materialType: string;

        subtype: string | null;

        quantity: number;

        unit: string;

        requiredCondition: number | null;

        length: number | null;

        width: number | null;

        height: number | null;

        diameter: number | null;

        intendedApplication: string | null;

    };



    recommendation?: {

        id: string;

        score: number;

        explanation: string;

        status: string;

        environmentalBenefit: unknown;

    };

}





interface ApiResponse<T> {

    success: boolean;

    message: string;

    data: T;

}





export async function runMatching(
    requirementId: string
): Promise<Match[]> {


    const response =
        await api.post<ApiResponse<Match[]>>(
            `/requirements/${requirementId}/match`
        );


    return response.data.data;

}







export async function getRequirementMatches(
    requirementId: string
): Promise<Match[]> {


    const response =
        await api.get<ApiResponse<Match[]>>(
            `/requirements/${requirementId}/matches`
        );


    return response.data.data;

}







export async function verifyMatch(

    matchId: string,

    decision:
        | "ACCEPTED"
        | "REJECTED"
        | "NEEDS_INSPECTION",

    note?: string

) {


    const response =
        await api.patch(
            `/matches/${matchId}/verify`,
            {
                decision,
                note,
            }
        );


    return response.data.data;

}
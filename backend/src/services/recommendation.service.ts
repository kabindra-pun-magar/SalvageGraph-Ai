import { prisma } from "../config/database";
import { ApiError } from "../utils/api-error";

const calculateRecommendationScore = (
    suitabilityScore: number,
    distanceKm: number | null,
    economicBenefit: number | null
): number => {
    let score = suitabilityScore;

    // Distance factor
    if (distanceKm !== null) {
        if (distanceKm <= 10) {
            score += 5;
        } else if (distanceKm <= 50) {
            score += 3;
        } else if (distanceKm <= 100) {
            score += 1;
        } else {
            score -= 5;
        }
    }

    // Economic factor
    if (economicBenefit !== null) {
        if (economicBenefit > 0) {
            score += 5;
        } else if (economicBenefit < 0) {
            score -= 5;
        }
    }

    return Math.max(
        0,
        Math.min(100, Number(score.toFixed(2)))
    );
};

const generateExplanation = (
    compatibilityScore: number | null,
    conditionScore: number | null,
    quantityScore: number | null,
    dimensionScore: number | null,
    distanceKm: number | null,
    transportCost: number | null,
    economicBenefit: number | null
): string => {
    const reasons: string[] = [];

    if (
        compatibilityScore !== null &&
        compatibilityScore >= 80
    ) {
        reasons.push("Material compatible");
    }

    if (
        conditionScore !== null &&
        conditionScore >= 80
    ) {
        reasons.push("Condition acceptable");
    }

    if (
        quantityScore !== null &&
        quantityScore >= 80
    ) {
        reasons.push("Quantity sufficient");
    }

    if (
        dimensionScore !== null &&
        dimensionScore >= 80
    ) {
        reasons.push("Dimensions compatible");
    }

    if (distanceKm !== null) {
        if (distanceKm <= 50) {
            reasons.push("Transport distance feasible");
        } else {
            reasons.push(
                `Transport distance: ${distanceKm} km`
            );
        }
    }

    if (transportCost !== null) {
        reasons.push(
            `Estimated transport cost: ${transportCost.toFixed(2)}`
        );
    }

    if (economicBenefit !== null) {
        if (economicBenefit > 0) {
            reasons.push(
                `Positive economic benefit: ${economicBenefit.toFixed(2)}`
            );
        } else {
            reasons.push(
                `Negative economic benefit: ${economicBenefit.toFixed(2)}`
            );
        }
    }

    if (reasons.length === 0) {
        return "Insufficient information for a detailed recommendation explanation";
    }

    return reasons.map((reason) => `✓ ${reason}`).join("\n");
};

export const generateRecommendation = async (
    matchId: string,
    userId: string
) => {
    const match = await prisma.match.findUnique({
        where: {
            id: matchId,
        },
        include: {
            material: true,
            requirement: {
                include: {
                    project: true,
                },
            },
            recommendation: true,
        },
    });

    if (!match) {
        throw new ApiError(
            404,
            "Match not found"
        );
    }

    if (match.requirement.project.ownerId !== userId) {
        throw new ApiError(
            403,
            "You do not have permission to generate a recommendation for this match"
        );
    }

    if (match.suitabilityScore === null) {
        throw new ApiError(
            400,
            "Match suitability score is not available"
        );
    }

    const score = calculateRecommendationScore(
        match.suitabilityScore,
        match.distanceKm,
        match.economicBenefit !== null
            ? Number(match.economicBenefit)
            : null
    );

    const explanation = generateExplanation(
        match.compatibilityScore,
        match.conditionScore,
        match.quantityScore,
        match.dimensionScore,
        match.distanceKm,
        match.transportCost !== null
            ? Number(match.transportCost)
            : null,
        match.economicBenefit !== null
            ? Number(match.economicBenefit)
            : null
    );

    const recommendation =
        await prisma.recommendation.upsert({
            where: {
                matchId: match.id,
            },
            update: {
                score,
                explanation,
                estimatedSaving:
                    match.economicBenefit,
                status: "PENDING",
            },
            create: {
                matchId: match.id,
                score,
                explanation,
                estimatedSaving:
                    match.economicBenefit,
                status: "PENDING",
            },
        });

    return recommendation;
};

export const getRecommendationForMatch = async (
    matchId: string,
    userId: string
) => {
    const match = await prisma.match.findUnique({
        where: {
            id: matchId,
        },
        include: {
            requirement: {
                include: {
                    project: true,
                },
            },
            recommendation: true,
        },
    });

    if (!match) {
        throw new ApiError(
            404,
            "Match not found"
        );
    }

    if (match.requirement.project.ownerId !== userId) {
        throw new ApiError(
            403,
            "You do not have permission to access this recommendation"
        );
    }

    if (!match.recommendation) {
        throw new ApiError(
            404,
            "Recommendation not found for this match"
        );
    }

    return match.recommendation;
};

export const getRecommendations = async (
    userId: string
) => {
    const recommendations =
        await prisma.recommendation.findMany({
            where: {
                match: {
                    requirement: {
                        project: {
                            ownerId: userId,
                        },
                    },
                },
            },
            include: {
                match: {
                    include: {
                        material: true,
                        requirement: {
                            include: {
                                project: true,
                            },
                        },
                    },
                },
            },
            orderBy: [
                {
                    score: "desc",
                },
                {
                    createdAt: "desc",
                },
            ],
        });

    return recommendations;
};
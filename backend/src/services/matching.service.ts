import { calculateDistanceKm } from "./gis.service";
import {
    calculateTransportCost,
    calculateEconomicBenefit,
} from "./cost.service";
import { prisma } from "../config/database";
import { ApiError } from "../utils/api-error";

const calculateDimensionScore = (
    materialValue: number | null,
    requiredValue: number | null
): number => {
    if (
        requiredValue === null ||
        requiredValue === undefined
    ) {
        return 100;
    }

    if (
        materialValue === null ||
        materialValue === undefined
    ) {
        return 0;
    }

    if (materialValue === requiredValue) {
        return 100;
    }

    const difference =
        Math.abs(materialValue - requiredValue) /
        requiredValue;

    return Math.max(0, 100 - difference * 100);
};

const calculateQuantityScore = (
    materialQuantity: number,
    requiredQuantity: number
): number => {
    if (materialQuantity >= requiredQuantity) {
        return 100;
    }

    return Math.max(
        0,
        (materialQuantity / requiredQuantity) * 100
    );
};

const calculateConditionScore = (
    materialCondition: number | null,
    requiredCondition: number | null
): number => {
    if (
        requiredCondition === null ||
        requiredCondition === undefined
    ) {
        return materialCondition ?? 0;
    }

    if (
        materialCondition === null ||
        materialCondition === undefined
    ) {
        return 0;
    }

    if (materialCondition >= requiredCondition) {
        return 100;
    }

    return Math.max(
        0,
        (materialCondition / requiredCondition) * 100
    );
};

const calculateSuitabilityScore = (
    compatibilityScore: number,
    conditionScore: number,
    quantityScore: number,
    dimensionScore: number
): number => {
    return (
        compatibilityScore * 0.3 +
        conditionScore * 0.25 +
        quantityScore * 0.25 +
        dimensionScore * 0.2
    );
};

const filterMatchingCandidates = (
    materials: Awaited<ReturnType<typeof prisma.material.findMany>>,
    requirement: {
        materialType: string;
        quantity: unknown;
        requiredCondition: number | null;
    }
) => {
    const requiredQuantity = Number(requirement.quantity);

    return materials.filter((material) => {
        // Hard filter 1: material must be available
        if (material.status !== "AVAILABLE") {
            return false;
        }

        // Hard filter 2: material type must match
        if (material.type !== requirement.materialType) {
            return false;
        }

        // Hard filter 3: quantity must be sufficient
        const materialQuantity = Number(material.quantity);

        if (materialQuantity < requiredQuantity) {
            return false;
        }

        // Hard filter 4: condition must satisfy minimum requirement
        if (
            requirement.requiredCondition !== null &&
            requirement.requiredCondition !== undefined
        ) {
            if (
                material.conditionScore === null ||
                material.conditionScore === undefined
            ) {
                return false;
            }

            if (
                material.conditionScore <
                requirement.requiredCondition
            ) {
                return false;
            }
        }

        return true;
    });
};

export const runMatching = async (
    requirementId: string,
    userId: string
) => {
    const requirement =
        await prisma.materialRequirement.findUnique({
            where: {
                id: requirementId,
            },
            include: {
                project: true,
            },
        });

    if (!requirement) {
        throw new ApiError(
            404,
            "Material requirement not found"
        );
    }

    if (requirement.project.ownerId !== userId) {
        throw new ApiError(
            403,
            "You do not have permission to run matching for this requirement"
        );
    }

    const materials = await prisma.material.findMany({
        where: {
            registeredById: userId,
            status: "AVAILABLE",
        },
    });

    const candidates = materials.filter((material) => {
        // Hard filter 1: material type
        if (material.type !== requirement.materialType) {
            return false;
        }

        // Hard filter 2: quantity
        const materialQuantity = Number(
            material.quantity
        );

        const requiredQuantity = Number(
            requirement.quantity
        );

        if (materialQuantity < requiredQuantity) {
            return false;
        }

        // Hard filter 3: condition
        if (
            requirement.requiredCondition !== null &&
            requirement.requiredCondition !== undefined &&
            material.conditionScore !== null &&
            material.conditionScore !== undefined &&
            material.conditionScore <
            requirement.requiredCondition
        ) {
            return false;
        }

        return true;
    });

    const matches = candidates.map((material) => {
        const compatibilityScore =
            material.type === requirement.materialType
                ? 100
                : 0;

        const quantityScore = calculateQuantityScore(
            Number(material.quantity),
            Number(requirement.quantity)
        );

        const conditionScore =
            calculateConditionScore(
                material.conditionScore,
                requirement.requiredCondition
            );

        const lengthScore = calculateDimensionScore(
            material.length,
            requirement.length
        );

        const widthScore = calculateDimensionScore(
            material.width,
            requirement.width
        );

        const heightScore = calculateDimensionScore(
            material.height,
            requirement.height
        );

        const diameterScore = calculateDimensionScore(
            material.diameter,
            requirement.diameter
        );

        const dimensionScores: number[] = [];

        if (
            requirement.length !== null &&
            requirement.length !== undefined
        ) {
            dimensionScores.push(lengthScore);
        }

        if (
            requirement.width !== null &&
            requirement.width !== undefined
        ) {
            dimensionScores.push(widthScore);
        }

        if (
            requirement.height !== null &&
            requirement.height !== undefined
        ) {
            dimensionScores.push(heightScore);
        }

        if (
            requirement.diameter !== null &&
            requirement.diameter !== undefined
        ) {
            dimensionScores.push(diameterScore);
        }

        const dimensionScore =
            dimensionScores.length > 0
                ? dimensionScores.reduce(
                    (sum, score) => sum + score,
                    0
                ) / dimensionScores.length
                : 100;

        /*
         * GIS calculation
         */
        let distanceKm: number | null = null;
        let transportCost: number | null = null;

        if (
            material.latitude !== null &&
            material.latitude !== undefined &&
            material.longitude !== null &&
            material.longitude !== undefined &&
            requirement.project.latitude !== null &&
            requirement.project.latitude !== undefined &&
            requirement.project.longitude !== null &&
            requirement.project.longitude !== undefined
        ) {
            distanceKm = calculateDistanceKm(
                material.latitude,
                material.longitude,
                requirement.project.latitude,
                requirement.project.longitude
            );

            transportCost =
                calculateTransportCost(distanceKm);
        }

        /*
         * Economic feasibility calculation
         */
        const economicBenefit =
            calculateEconomicBenefit(
                Number(material.quantity),
                material.estimatedUnitValue !== null
                    ? Number(material.estimatedUnitValue)
                    : null,
                transportCost ?? 0
            );

        const suitabilityScore =
            calculateSuitabilityScore(
                compatibilityScore,
                conditionScore,
                quantityScore,
                dimensionScore
            );

        return {
            materialId: material.id,
            requirementId: requirement.id,
            compatibilityScore,
            conditionScore,
            quantityScore,
            dimensionScore,
            distanceKm,
            transportCost,
            economicBenefit,
            suitabilityScore,
        };
    });

    matches.sort(
        (a, b) =>
            b.suitabilityScore -
            a.suitabilityScore
    );

    const createdMatches = await prisma.$transaction(
        async (tx) => {
            const results = [];

            for (const match of matches) {
                const existingMatch =
                    await tx.match.findFirst({
                        where: {
                            materialId: match.materialId,
                            requirementId:
                                match.requirementId,
                        },
                    });

                if (existingMatch) {
                    const updatedMatch =
                        await tx.match.update({
                            where: {
                                id: existingMatch.id,
                            },
                            data: {
                                compatibilityScore:
                                    match.compatibilityScore,
                                conditionScore:
                                    match.conditionScore,
                                quantityScore:
                                    match.quantityScore,
                                dimensionScore:
                                    match.dimensionScore,

                                distanceKm:
                                    match.distanceKm,
                                transportCost:
                                    match.transportCost,
                                economicBenefit:
                                    match.economicBenefit,

                                suitabilityScore:
                                    match.suitabilityScore,
                                status: "CANDIDATE",
                            },
                        });

                    results.push(updatedMatch);
                } else {
                    const createdMatch =
                        await tx.match.create({
                            data: {
                                materialId:
                                    match.materialId,
                                requirementId:
                                    match.requirementId,

                                compatibilityScore:
                                    match.compatibilityScore,
                                conditionScore:
                                    match.conditionScore,
                                quantityScore:
                                    match.quantityScore,
                                dimensionScore:
                                    match.dimensionScore,

                                distanceKm:
                                    match.distanceKm,
                                transportCost:
                                    match.transportCost,
                                economicBenefit:
                                    match.economicBenefit,

                                suitabilityScore:
                                    match.suitabilityScore,
                                status: "CANDIDATE",
                            },
                        });

                    results.push(createdMatch);
                }
            }

            return results;
        }
    );

    return createdMatches;
};

export const getMatchesForRequirement = async (
    requirementId: string,
    userId: string
) => {
    const requirement =
        await prisma.materialRequirement.findUnique({
            where: {
                id: requirementId,
            },
            include: {
                project: true,
            },
        });

    if (!requirement) {
        throw new ApiError(
            404,
            "Material requirement not found"
        );
    }

    if (requirement.project.ownerId !== userId) {
        throw new ApiError(
            403,
            "You do not have permission to access these matches"
        );
    }

    return prisma.match.findMany({
        where: {
            requirementId,
        },
        include: {
            material: true,
        },
        orderBy: {
            suitabilityScore: "desc",
        },
    });
};
import { calculateDistanceKm } from "./gis.service";
import {
    calculateTransportCost,
    calculateEconomicBenefit,
} from "./cost.service";
import { prisma } from "../config/database";
import { ApiError } from "../utils/api-error";

/*
 * ============================================================
 * STEP 1: DIMENSION SCORE
 * ============================================================
 */

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

    if (requiredValue === 0) {
        return 0;
    }

    const difference =
        Math.abs(materialValue - requiredValue) /
        requiredValue;

    return Math.max(
        0,
        100 - difference * 100
    );
};

/*
 * ============================================================
 * STEP 1: QUANTITY SCORE
 * ============================================================
 */

const calculateQuantityScore = (
    materialQuantity: number,
    requiredQuantity: number
): number => {
    if (requiredQuantity <= 0) {
        return 100;
    }

    if (materialQuantity >= requiredQuantity) {
        return 100;
    }

    return Math.max(
        0,
        (materialQuantity / requiredQuantity) * 100
    );
};

/*
 * ============================================================
 * STEP 1: CONDITION SCORE
 * ============================================================
 */

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

    if (requiredCondition <= 0) {
        return 100;
    }

    if (materialCondition >= requiredCondition) {
        return 100;
    }

    return Math.max(
        0,
        (materialCondition / requiredCondition) * 100
    );
};

/*
 * ============================================================
 * STEP 2: COMPATIBILITY
 * ============================================================
 *
 * Type       = 50%
 * Dimensions = 50%
 */

const calculateCompatibilityScore = (
    material: {
        type: string;
        length: number | null;
        width: number | null;
        height: number | null;
        diameter: number | null;
    },
    requirement: {
        materialType: string;
        length: number | null;
        width: number | null;
        height: number | null;
        diameter: number | null;
    }
): number => {
    const typeScore =
        material.type === requirement.materialType
            ? 100
            : 0;

    const dimensionScores: number[] = [];

    if (
        requirement.length !== null &&
        requirement.length !== undefined
    ) {
        dimensionScores.push(
            calculateDimensionScore(
                material.length,
                requirement.length
            )
        );
    }

    if (
        requirement.width !== null &&
        requirement.width !== undefined
    ) {
        dimensionScores.push(
            calculateDimensionScore(
                material.width,
                requirement.width
            )
        );
    }

    if (
        requirement.height !== null &&
        requirement.height !== undefined
    ) {
        dimensionScores.push(
            calculateDimensionScore(
                material.height,
                requirement.height
            )
        );
    }

    if (
        requirement.diameter !== null &&
        requirement.diameter !== undefined
    ) {
        dimensionScores.push(
            calculateDimensionScore(
                material.diameter,
                requirement.diameter
            )
        );
    }

    const dimensionScore =
        dimensionScores.length > 0
            ? dimensionScores.reduce(
                  (sum, score) => sum + score,
                  0
              ) / dimensionScores.length
            : 100;

    return (
        typeScore * 0.5 +
        dimensionScore * 0.5
    );
};

/*
 * ============================================================
 * STEP 3: SUITABILITY
 * ============================================================
 *
 * Compatibility = 40%
 * Condition     = 30%
 * Quantity      = 30%
 */

const calculateSuitabilityScore = (
    compatibilityScore: number,
    conditionScore: number,
    quantityScore: number
): number => {
    return (
        compatibilityScore * 0.4 +
        conditionScore * 0.3 +
        quantityScore * 0.3
    );
};

/*
 * ============================================================
 * STEP 4: LOGISTICS
 * ============================================================
 */

const calculateLogistics = (
    materialLatitude: number | null,
    materialLongitude: number | null,
    projectLatitude: number | null,
    projectLongitude: number | null
): {
    distanceKm: number | null;
    transportCost: number | null;
} => {
    if (
        materialLatitude === null ||
        materialLatitude === undefined ||
        materialLongitude === null ||
        materialLongitude === undefined ||
        projectLatitude === null ||
        projectLatitude === undefined ||
        projectLongitude === null ||
        projectLongitude === undefined
    ) {
        return {
            distanceKm: null,
            transportCost: null,
        };
    }

    const distanceKm = calculateDistanceKm(
        materialLatitude,
        materialLongitude,
        projectLatitude,
        projectLongitude
    );

    const transportCost =
        calculateTransportCost(distanceKm);

    return {
        distanceKm,
        transportCost,
    };
};

/*
 * ============================================================
 * STEP 5: ECONOMIC ANALYSIS
 * ============================================================
 */

const calculateEconomicScore = (
    economicBenefit: number | null
): number => {
    if (
        economicBenefit === null ||
        economicBenefit <= 0
    ) {
        return 0;
    }

    /*
     * Economic benefit is converted to a
     * normalized 0-100 score.
     *
     * This cap is an MVP normalization mechanism,
     * not a research-validated economic threshold.
     */
    return Math.min(
        100,
        economicBenefit / 100
    );
};

/*
 * ============================================================
 * STEP 6: ENVIRONMENTAL ANALYSIS
 * ============================================================
 *
 * Environmental benefit is represented as a
 * transparent structured object.
 *
 * Exact material-specific emission factors should
 * later come from validated datasets/research.
 */

const ENVIRONMENTAL_FACTORS: Record<
    string,
    number
> = {
    TILE: 1.0,
    BRICK: 1.0,
    PIPE: 1.0,
    REBAR: 1.0,
    TIMBER: 1.0,
    CONCRETE: 1.0,
    SAND: 1.0,
    WOOD: 1.0,
    GLASS: 1.0,
    OTHER: 1.0,
};

const calculateEnvironmentalBenefit = (
    materialType: string,
    quantity: number,
    distanceKm: number | null
) => {
    const environmentalFactor =
        ENVIRONMENTAL_FACTORS[
            materialType
        ] ?? 1;

    const estimatedAvoidedMaterialImpact =
        quantity * environmentalFactor;

    const transportImpact =
        distanceKm !== null
            ? distanceKm * quantity
            : null;

    /*
     * The current score is intentionally
     * transparent and provisional.
     */
    const environmentalScore =
        distanceKm === null
            ? 50
            : Math.max(
                  0,
                  Math.min(
                      100,
                      100 -
                          distanceKm * 2
                  )
              );

    return {
        reusedQuantity: quantity,
        materialType,
        environmentalFactor,
        estimatedAvoidedMaterialImpact,
        distanceKm,
        transportImpact,
        environmentalScore: Number(
            environmentalScore.toFixed(2)
        ),
        methodology:
            "Provisional MVP environmental model. Material-specific lifecycle emission factors should be calibrated using validated research data.",
    };
};

/*
 * ============================================================
 * STEP 7: FINAL RANKING
 * ============================================================
 *
 * Current MVP:
 *
 * Suitability       = 50%
 * Economic benefit  = 30%
 * Environmental     = 20%
 *
 * These weights are configurable and should
 * eventually be experimentally optimized or
 * learned by the AI ranking model.
 */

const calculateFinalRankingScore = (
    suitabilityScore: number,
    economicScore: number,
    environmentalScore: number
): number => {
    return Number(
        (
            suitabilityScore * 0.5 +
            economicScore * 0.3 +
            environmentalScore * 0.2
        ).toFixed(2)
    );
};

/*
 * ============================================================
 * STEP 1: CANDIDATE FILTERING
 * ============================================================
 */

const filterMatchingCandidates = (
    materials: Awaited<
        ReturnType<typeof prisma.material.findMany>
    >,
    requirement: {
        materialType: string;
        quantity: unknown;
        requiredCondition: number | null;
    }
) => {
    const requiredQuantity = Number(
        requirement.quantity
    );

    return materials.filter((material) => {
        if (material.status !== "AVAILABLE") {
            return false;
        }

        if (
            material.type !==
            requirement.materialType
        ) {
            return false;
        }

        const materialQuantity = Number(
            material.quantity
        );

        if (
            materialQuantity <
            requiredQuantity
        ) {
            return false;
        }

        if (
            requirement.requiredCondition !==
                null &&
            requirement.requiredCondition !==
                undefined
        ) {
            if (
                material.conditionScore ===
                    null ||
                material.conditionScore ===
                    undefined
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

/*
 * ============================================================
 * RUN MATCHING
 * ============================================================
 */

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

    if (
        requirement.project.ownerId !==
        userId
    ) {
        throw new ApiError(
            403,
            "You do not have permission to run matching for this requirement"
        );
    }

    const materials =
        await prisma.material.findMany({
            where: {
                registeredById: userId,
                status: "AVAILABLE",
            },
        });

    /*
     * STEP 1
     */
    const candidates =
        filterMatchingCandidates(
            materials,
            requirement
        );

    const matches = candidates.map(
        (material) => {
            /*
             * STEP 2
             */
            const compatibilityScore =
                calculateCompatibilityScore(
                    material,
                    requirement
                );

            /*
             * STEP 3
             */
            const quantityScore =
                calculateQuantityScore(
                    Number(material.quantity),
                    Number(
                        requirement.quantity
                    )
                );

            const conditionScore =
                calculateConditionScore(
                    material.conditionScore,
                    requirement.requiredCondition
                );

            const lengthScore =
                calculateDimensionScore(
                    material.length,
                    requirement.length
                );

            const widthScore =
                calculateDimensionScore(
                    material.width,
                    requirement.width
                );

            const heightScore =
                calculateDimensionScore(
                    material.height,
                    requirement.height
                );

            const diameterScore =
                calculateDimensionScore(
                    material.diameter,
                    requirement.diameter
                );

            const dimensionScores: number[] =
                [];

            if (
                requirement.length !== null &&
                requirement.length !==
                    undefined
            ) {
                dimensionScores.push(
                    lengthScore
                );
            }

            if (
                requirement.width !== null &&
                requirement.width !==
                    undefined
            ) {
                dimensionScores.push(
                    widthScore
                );
            }

            if (
                requirement.height !== null &&
                requirement.height !==
                    undefined
            ) {
                dimensionScores.push(
                    heightScore
                );
            }

            if (
                requirement.diameter !==
                    null &&
                requirement.diameter !==
                    undefined
            ) {
                dimensionScores.push(
                    diameterScore
                );
            }

            const dimensionScore =
                dimensionScores.length > 0
                    ? dimensionScores.reduce(
                          (sum, score) =>
                              sum + score,
                          0
                      ) /
                      dimensionScores.length
                    : 100;

            const suitabilityScore =
                calculateSuitabilityScore(
                    compatibilityScore,
                    conditionScore,
                    quantityScore
                );

            /*
             * STEP 4
             */
            const {
                distanceKm,
                transportCost,
            } = calculateLogistics(
                material.latitude,
                material.longitude,
                requirement.project.latitude,
                requirement.project.longitude
            );

            /*
             * STEP 5
             */
            const economicBenefit =
                calculateEconomicBenefit(
                    Number(
                        material.quantity
                    ),
                    material.estimatedUnitValue !==
                        null
                        ? Number(
                              material.estimatedUnitValue
                          )
                        : null,
                    transportCost ?? 0
                );

            const economicScore =
                calculateEconomicScore(
                    economicBenefit
                );

            /*
             * STEP 6
             */
            const environmentalBenefit =
                calculateEnvironmentalBenefit(
                    material.type,
                    Number(material.quantity),
                    distanceKm
                );

            /*
             * STEP 7
             */
            const finalRankingScore =
                calculateFinalRankingScore(
                    suitabilityScore,
                    economicScore,
                    environmentalBenefit.environmentalScore
                );

            return {
                materialId:
                    material.id,

                requirementId:
                    requirement.id,

                compatibilityScore,

                conditionScore,

                quantityScore,

                dimensionScore,

                distanceKm,

                transportCost,

                economicBenefit,

                suitabilityScore,

                economicScore,

                environmentalBenefit,

                finalRankingScore,
            };
        }
    );

    /*
     * STEP 7:
     * Final ranking
     */
    matches.sort(
        (a, b) =>
            b.finalRankingScore -
            a.finalRankingScore
    );

    /*
     * STEP 8:
     * Save matches and create/update
     * recommendations for human verification.
     */
    const createdMatches =
        await prisma.$transaction(
            async (tx) => {
                const results = [];

                for (let index = 0; index < matches.length; index++) {
                    const match = matches[index];

                    const existingMatch =
                        await tx.match.findFirst({
                            where: {
                                materialId:
                                    match.materialId,

                                requirementId:
                                    match.requirementId,
                            },
                        });

                    let savedMatch;

                    if (existingMatch) {
                        savedMatch =
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

                                    status:
                                        "CANDIDATE",
                                },
                            });
                    } else {
                        savedMatch =
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

                                    status:
                                        "CANDIDATE",
                                },
                            });
                    }

                    /*
                     * Create or update recommendation.
                     */
                    const explanation =
                        [
                            `Compatibility: ${match.compatibilityScore.toFixed(2)}`,
                            `Condition: ${match.conditionScore.toFixed(2)}`,
                            `Quantity: ${match.quantityScore.toFixed(2)}`,
                            `Distance: ${
                                match.distanceKm !== null
                                    ? `${match.distanceKm.toFixed(2)} km`
                                    : "Unavailable"
                            }`,
                            `Economic benefit: ${
                                match.economicBenefit !== null
                                    ? match.economicBenefit.toFixed(2)
                                    : "Unavailable"
                            }`,
                            `Environmental score: ${match.environmentalBenefit.environmentalScore.toFixed(2)}`,
                            `Final ranking score: ${match.finalRankingScore.toFixed(2)}`,
                        ].join(" | ");

                    const existingRecommendation =
                        await tx.recommendation.findUnique(
                            {
                                where: {
                                    matchId:
                                        savedMatch.id,
                                },
                            }
                        );

                    let recommendation;

                    if (
                        existingRecommendation
                    ) {
                        recommendation =
                            await tx.recommendation.update(
                                {
                                    where: {
                                        matchId:
                                            savedMatch.id,
                                    },

                                    data: {
                                        score:
                                            match.finalRankingScore,

                                        explanation,

                                        estimatedSaving:
                                            match.economicBenefit,

                                        environmentalBenefit:
                                            match.environmentalBenefit,

                                        /*
                                         * Re-running matching
                                         * returns the recommendation
                                         * to human review.
                                         */
                                        status:
                                            "PENDING",

                                        verifiedBy:
                                            null,

                                        verificationNote:
                                            null,
                                    },
                                }
                            );
                    } else {
                        recommendation =
                            await tx.recommendation.create(
                                {
                                    data: {
                                        matchId:
                                            savedMatch.id,

                                        score:
                                            match.finalRankingScore,

                                        explanation,

                                        estimatedSaving:
                                            match.economicBenefit,

                                        environmentalBenefit:
                                            match.environmentalBenefit,

                                        status:
                                            "PENDING",
                                    },
                                }
                            );
                    }

                    results.push({
                        rank: index + 1,
                        ...savedMatch,
                        recommendation,
                        environmentalBenefit:
                            match.environmentalBenefit,
                        economicScore:
                            match.economicScore,
                        finalRankingScore:
                            match.finalRankingScore,
                    });
                }

                return results;
            }
        );

    return createdMatches;
};

/*
 * ============================================================
 * GET MATCHES
 * ============================================================
 */

export const getMatchesForRequirement =
    async (
        requirementId: string,
        userId: string
    ) => {
        const requirement =
            await prisma.materialRequirement.findUnique(
                {
                    where: {
                        id: requirementId,
                    },

                    include: {
                        project: true,
                    },
                }
            );

        if (!requirement) {
            throw new ApiError(
                404,
                "Material requirement not found"
            );
        }

        if (
            requirement.project.ownerId !==
            userId
        ) {
            throw new ApiError(
                403,
                "You do not have permission to access these matches"
            );
        }

        const matches =
            await prisma.match.findMany({
                where: {
                    requirementId,
                },

                include: {
                    material: true,
                    recommendation: true,
                },
            });

        return matches.sort(
            (a, b) =>
                (b.recommendation?.score ?? 0) -
                (a.recommendation?.score ?? 0)
        );
    };

/*
 * ============================================================
 * STEP 8: HUMAN VERIFICATION
 * ============================================================
 */

export const verifyMatch =
    async (
        matchId: string,
        userId: string,
        decision:
            | "ACCEPTED"
            | "REJECTED"
            | "NEEDS_INSPECTION",
        note?: string
    ) => {
        const match =
            await prisma.match.findUnique({
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

        if (
            match.requirement.project.ownerId !==
            userId
        ) {
            throw new ApiError(
                403,
                "You do not have permission to verify this match"
            );
        }

        const matchStatus =
            decision === "ACCEPTED"
                ? "ACCEPTED"
                : decision === "REJECTED"
                  ? "REJECTED"
                  : "EVALUATED";

        const recommendationStatus =
            decision === "ACCEPTED"
                ? "APPROVED"
                : decision === "REJECTED"
                  ? "REJECTED"
                  : "NEEDS_INSPECTION";

        return prisma.$transaction(
            async (tx) => {
                const updatedMatch =
                    await tx.match.update({
                        where: {
                            id: matchId,
                        },

                        data: {
                            status:
                                matchStatus,
                        },

                        include: {
                            material: true,
                            recommendation:
                                true,
                        },
                    });

                if (
                    match.recommendation
                ) {
                    await tx.recommendation.update(
                        {
                            where: {
                                matchId,
                            },

                            data: {
                                status:
                                    recommendationStatus,

                                verifiedBy:
                                    userId,

                                verificationNote:
                                    note ??
                                    null,
                            },
                        }
                    );
                }

                return updatedMatch;
            }
        );
    };
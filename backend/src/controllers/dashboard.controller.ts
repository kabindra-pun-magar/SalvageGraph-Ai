import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";
import { successResponse } from "../utils/api-response";

export async function getDashboardSummary(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const [
            availableMaterials,
            activeProjects,
            pendingRecommendations,
        ] = await Promise.all([
            prisma.material.count({
                where: {
                    status: "AVAILABLE",
                },
            }),

            prisma.project.count(),

            prisma.recommendation.count({
                where: {
                    status: "PENDING",
                },
            }),
        ]);

        res.status(200).json(
            successResponse("Dashboard summary retrieved successfully", {
                availableMaterials,
                activeProjects,
                pendingRecommendations,
            }),
        );
    } catch (error) {
        next(error);
    }
}
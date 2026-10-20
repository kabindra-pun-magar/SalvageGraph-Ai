import {
    Request,
    Response,
    NextFunction,
} from "express";
import { generateRecommendation } from "../services/recommendation.service";
import { successResponse } from "../utils/api-response";
import { getRecommendationForMatch } from "../services/recommendation.service";
import {
    getRecommendations,
} from "../services/recommendation.service";

export const generateRecommendationController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.userId;
        const matchId = req.params.matchId;

        if (
            typeof matchId !== "string" ||
            matchId.length === 0
        ) {
            res.status(400).json({
                success: false,
                message: "Match ID is required",
            });
            return;
        }

        const recommendation =
            await generateRecommendation(
                matchId,
                userId
            );

        res.status(200).json(
            successResponse(
                "Recommendation generated successfully",
                recommendation
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getRecommendationController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.userId;
        const matchId = req.params.matchId;

        if (
            typeof matchId !== "string" ||
            matchId.length === 0
        ) {
            res.status(400).json({
                success: false,
                message: "Match ID is required",
            });
            return;
        }

        const recommendation =
            await getRecommendationForMatch(
                matchId,
                userId
            );

        res.status(200).json(
            successResponse(
                "Recommendation retrieved successfully",
                recommendation
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getRecommendationsController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = res.locals.user.userId;

        const recommendations =
            await getRecommendations(userId);

        res.status(200).json(
            successResponse(
                "Recommendations retrieved successfully",
                recommendations
            )
        );
    } catch (error) {
        next(error);
    }
};
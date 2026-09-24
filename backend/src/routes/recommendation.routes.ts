import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { generateRecommendationSchema } from "../validators/recommendation.validator";
import {
    generateRecommendationController,
    getRecommendationController,
} from "../controllers/recommendation.controller";

const router = Router();

router.use(authenticate);

router.post(
    "/matches/:matchId/recommendation",
    validate(generateRecommendationSchema),
    generateRecommendationController
);

router.get(
    "/matches/:matchId/recommendation",
    validate(generateRecommendationSchema),
    getRecommendationController
);

export default router;
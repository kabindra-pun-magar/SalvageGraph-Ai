import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
    runMatchingController,
    getMatchesController,
    verifyMatchController,
} from "../controllers/matching.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/requirements/:requirementId/match",
  runMatchingController
);

router.get(
  "/requirements/:requirementId/matches",
  getMatchesController
);

router.patch(
    "/matches/:matchId/verify",
    verifyMatchController
);

export default router;
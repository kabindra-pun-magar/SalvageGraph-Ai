import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
  runMatchingController,
  getMatchesController,
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

export default router;
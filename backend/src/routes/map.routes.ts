import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
  getMapProjectsController,
  getMapMaterialsController,
  getMapOverviewController,
} from "../controllers/map.controller";

const router = Router();

// All map endpoints require authentication.
router.use(authenticate);

router.get("/overview", getMapOverviewController);

router.get("/projects", getMapProjectsController);

router.get("/materials", getMapMaterialsController);

export default router;
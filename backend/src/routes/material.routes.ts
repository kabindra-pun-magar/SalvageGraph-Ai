import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

import {
  createMaterialController,
  getMaterialsController,
  getMaterialController,
  updateMaterialController,
  deleteMaterialController,
} from "../controllers/material.controller";

import {
  createMaterialSchema,
  updateMaterialSchema,
} from "../validators/material.validator";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate(createMaterialSchema),
  createMaterialController
);

router.get(
  "/",
  getMaterialsController
);

router.get(
  "/:id",
  getMaterialController
);

router.put(
  "/:id",
  validate(updateMaterialSchema),
  updateMaterialController
);

router.delete(
  "/:id",
  deleteMaterialController
);

export default router;
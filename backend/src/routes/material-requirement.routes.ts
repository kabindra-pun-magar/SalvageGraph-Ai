import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

import {
  createMaterialRequirementController,
  getProjectRequirementsController,
  getMaterialRequirementController,
  updateMaterialRequirementController,
  deleteMaterialRequirementController,
} from "../controllers/material-requirement.controller";

import {
  createMaterialRequirementSchema,
  updateMaterialRequirementSchema,
} from "../validators/material-requirement.validator";

const router = Router();

router.use(authenticate);

// Create requirement for a project
router.post(
  "/projects/:projectId/requirements",
  validate(createMaterialRequirementSchema),
  createMaterialRequirementController
);

// Get all requirements for a project
router.get(
  "/projects/:projectId/requirements",
  getProjectRequirementsController
);

// Get a single requirement
router.get(
  "/requirements/:id",
  getMaterialRequirementController
);

// Update a requirement
router.put(
  "/requirements/:id",
  validate(updateMaterialRequirementSchema),
  updateMaterialRequirementController
);

// Delete a requirement
router.delete(
  "/requirements/:id",
  deleteMaterialRequirementController
);

export default router;
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project.controller";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator";

const router = Router();

// All project routes require authentication
router.use(authenticate);

// Create a project
router.post(
  "/",
  validate(createProjectSchema),
  createProjectController
);

// Get all projects belonging to the authenticated user
router.get(
  "/",
  getProjectsController
);

// Get a specific project
router.get(
  "/:id",
  getProjectController
);

// Update a specific project
router.put(
  "/:id",
  validate(updateProjectSchema),
  updateProjectController
);

// Delete a specific project
router.delete(
  "/:id",
  deleteProjectController
);

export default router;
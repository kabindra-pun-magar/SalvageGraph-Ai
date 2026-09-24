import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

import {
  createPassportController,
} from "../controllers/passport.controller";

import {
  createPassportSchema,
} from "../validators/passport.validator";

const router = Router();

router.use(authenticate);

router.post(
  "/materials/:id/passport",
  validate(createPassportSchema),
  createPassportController
);

export default router;
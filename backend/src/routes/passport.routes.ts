import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";

import {
  createPassportController,
  getPassportController,
  updatePassportController,
  getMaterialHistoryController,
  generatePassportQRCodeController,
} from "../controllers/passport.controller";

import {
  createPassportSchema,
  updatePassportSchema,
} from "../validators/passport.validator";

const router = Router();

router.use(authenticate);

router.post(
  "/materials/:id/passport",
  validate(createPassportSchema),
  createPassportController
);

router.get(
  "/materials/:id/passport",
  getPassportController
);

router.put(
  "/passports/:passportId",
  validate(updatePassportSchema),
  updatePassportController
);

router.get(
  "/materials/:id/history",
  getMaterialHistoryController
);

router.post(
  "/passports/:passportId/qr",
  generatePassportQRCodeController
);

export default router;
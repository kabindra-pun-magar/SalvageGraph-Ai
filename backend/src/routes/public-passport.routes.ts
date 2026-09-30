import { Router } from "express";

import {
  getPublicPassportController,
} from "../controllers/passport.controller";

const router = Router();

router.get(
  "/passports/:passportCode",
  getPublicPassportController
);

export default router;
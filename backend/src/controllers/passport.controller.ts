import { Request, Response, NextFunction } from "express";

import { createPassport } from "../services/passport.service";
import { ApiError } from "../utils/api-error";
import { successResponse } from "../utils/api-response";

export const createPassportController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const materialId = req.params.id;

    if (
      typeof materialId !== "string" ||
      materialId.length === 0
    ) {
      throw new ApiError(
        400,
        "Material ID is required"
      );
    }

    const passport = await createPassport({
      materialId,
      userId,
    });

    res.status(201).json(
      successResponse(
        "Material passport created successfully",
        passport
      )
    );
  } catch (error) {
    next(error);
  }
};
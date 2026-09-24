import { Request, Response, NextFunction } from "express";

import {
  runMatching,
  getMatchesForRequirement,
} from "../services/matching.service";

import { ApiError } from "../utils/api-error";
import { successResponse } from "../utils/api-response";

export const runMatchingController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const requirementId = req.params.requirementId;

    if (
      typeof requirementId !== "string" ||
      requirementId.length === 0
    ) {
      throw new ApiError(
        400,
        "Requirement ID is required"
      );
    }

    const matches = await runMatching(
      requirementId,
      userId
    );

    res.status(200).json(
      successResponse(
        "Material matching completed successfully",
        matches
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getMatchesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const requirementId = req.params.requirementId;

    if (
      typeof requirementId !== "string" ||
      requirementId.length === 0
    ) {
      throw new ApiError(
        400,
        "Requirement ID is required"
      );
    }

    const matches =
      await getMatchesForRequirement(
        requirementId,
        userId
      );

    res.status(200).json(
      successResponse(
        "Material matches retrieved successfully",
        matches
      )
    );
  } catch (error) {
    next(error);
  }
};
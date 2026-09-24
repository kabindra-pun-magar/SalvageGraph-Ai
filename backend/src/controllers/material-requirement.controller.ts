import { Request, Response, NextFunction } from "express";

import {
  createMaterialRequirement,
  getProjectRequirements,
  getMaterialRequirementById,
  updateMaterialRequirement,
  deleteMaterialRequirement,
} from "../services/material-requirement.service";

import { ApiError } from "../utils/api-error";
import { successResponse } from "../utils/api-response";

export const createMaterialRequirementController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const projectId = req.params.projectId;

    if (
      typeof projectId !== "string" ||
      projectId.length === 0
    ) {
      throw new ApiError(
        400,
        "Project ID is required"
      );
    }

    const requirement =
      await createMaterialRequirement({
        projectId,
        userId,
        ...req.body,
      });

    res.status(201).json(
      successResponse(
        "Material requirement created successfully",
        requirement
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getProjectRequirementsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const projectId = req.params.projectId;

    if (
      typeof projectId !== "string" ||
      projectId.length === 0
    ) {
      throw new ApiError(
        400,
        "Project ID is required"
      );
    }

    const requirements =
      await getProjectRequirements(
        projectId,
        userId
      );

    res.status(200).json(
      successResponse(
        "Project material requirements retrieved successfully",
        requirements
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getMaterialRequirementController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const requirementId = req.params.id;

    if (
      typeof requirementId !== "string" ||
      requirementId.length === 0
    ) {
      throw new ApiError(
        400,
        "Requirement ID is required"
      );
    }

    const requirement =
      await getMaterialRequirementById(
        requirementId,
        userId
      );

    res.status(200).json(
      successResponse(
        "Material requirement retrieved successfully",
        requirement
      )
    );
  } catch (error) {
    next(error);
  }
};

export const updateMaterialRequirementController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const requirementId = req.params.id;

    if (
      typeof requirementId !== "string" ||
      requirementId.length === 0
    ) {
      throw new ApiError(
        400,
        "Requirement ID is required"
      );
    }

    const requirement =
      await updateMaterialRequirement(
        requirementId,
        userId,
        req.body
      );

    res.status(200).json(
      successResponse(
        "Material requirement updated successfully",
        requirement
      )
    );
  } catch (error) {
    next(error);
  }
};

export const deleteMaterialRequirementController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const requirementId = req.params.id;

    if (
      typeof requirementId !== "string" ||
      requirementId.length === 0
    ) {
      throw new ApiError(
        400,
        "Requirement ID is required"
      );
    }

    await deleteMaterialRequirement(
      requirementId,
      userId
    );

    res.status(200).json(
      successResponse(
        "Material requirement deleted successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
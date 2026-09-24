import { Request, Response, NextFunction } from "express";

import {
  createMaterial,
  getUserMaterials,
  getRecentUserMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from "../services/material.service";

import { ApiError } from "../utils/api-error";
import { successResponse } from "../utils/api-response";

export const createMaterialController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;

    const material = await createMaterial(
      userId,
      req.body
    );

    res.status(201).json(
      successResponse(
        "Material created successfully",
        material
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getMaterialsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;

    const materials = await getUserMaterials(userId);

    res.status(200).json(
      successResponse(
        "Materials retrieved successfully",
        materials
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getRecentMaterialsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;

    const materials = await getRecentUserMaterials(userId);

    res.status(200).json(
      successResponse(
        "Recent materials retrieved successfully",
        materials
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getMaterialController = async (
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

    const material = await getMaterialById(
      materialId,
      userId
    );

    res.status(200).json(
      successResponse(
        "Material retrieved successfully",
        material
      )
    );
  } catch (error) {
    next(error);
  }
};

export const updateMaterialController = async (
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

    const material = await updateMaterial(
      materialId,
      userId,
      req.body
    );

    res.status(200).json(
      successResponse(
        "Material updated successfully",
        material
      )
    );
  } catch (error) {
    next(error);
  }
};

export const deleteMaterialController = async (
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

    await deleteMaterial(
      materialId,
      userId
    );

    res.status(200).json(
      successResponse(
        "Material deleted successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
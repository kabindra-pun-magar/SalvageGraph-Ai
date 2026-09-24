import { Request, Response, NextFunction } from "express";

import {
  createPassport,
  getPassportByMaterialId,
  updatePassport,
  getMaterialHistory,
  generatePassportQRCode,
} from "../services/passport.service";

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

export const getPassportController = async (
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

    const passport = await getPassportByMaterialId(
      materialId,
      userId
    );

    res.status(200).json(
      successResponse(
        "Material passport retrieved successfully",
        passport
      )
    );
  } catch (error) {
    next(error);
  }
};

export const updatePassportController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const passportId = req.params.passportId;

    if (
      typeof passportId !== "string" ||
      passportId.length === 0
    ) {
      throw new ApiError(
        400,
        "Passport ID is required"
      );
    }

    const passport = await updatePassport({
      passportId,
      userId,
      ...req.body,
    });

    res.status(200).json(
      successResponse(
        "Material passport updated successfully",
        passport
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getMaterialHistoryController = async (
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

    const history = await getMaterialHistory(
      materialId,
      userId
    );

    res.status(200).json(
      successResponse(
        "Material history retrieved successfully",
        history
      )
    );
  } catch (error) {
    next(error);
  }
};

export const generatePassportQRCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;
    const passportId = req.params.passportId;

    if (
      typeof passportId !== "string" ||
      passportId.length === 0
    ) {
      throw new ApiError(
        400,
        "Passport ID is required"
      );
    }

    const passport = await generatePassportQRCode(
      passportId,
      userId
    );

    res.status(200).json(
      successResponse(
        "Passport QR code generated successfully",
        passport
      )
    );
  } catch (error) {
    next(error);
  }
};
import { Request, Response, NextFunction } from "express";

import {
  getMapProjects,
  getMapMaterials,
  getMapOverview,
} from "../services/map.service";

import { successResponse } from "../utils/api-response";

export const getMapProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;

    const projects = await getMapProjects(userId);

    res.status(200).json(
      successResponse(
        "Map projects retrieved successfully",
        projects
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getMapMaterialsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;

    const materials = await getMapMaterials(userId);

    res.status(200).json(
      successResponse(
        "Map materials retrieved successfully",
        materials
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getMapOverviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.userId;

    const overview = await getMapOverview(userId);

    res.status(200).json(
      successResponse(
        "Map overview retrieved successfully",
        overview
      )
    );
  } catch (error) {
    next(error);
  }
};
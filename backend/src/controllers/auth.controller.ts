import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
} from "../services/auth.service";
import { successResponse } from "../utils/api-response";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json(
      successResponse(
        "User registered successfully",
        result
      )
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json(
      successResponse(
        "Login successful",
        result
      )
    );
  } catch (error) {
    next(error);
  }
};
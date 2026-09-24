import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Authentication required");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(
        401,
        "Invalid authorization header"
      );
    }

    const payload = verifyAccessToken(token);

    res.locals.user = payload;

    next();
  } catch (error) {
    next(error);
  }
};
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";

export const authorizeRoles = (
  ...allowedRoles: string[]
) => {
  return (
    _req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const user = res.locals.user;

    if (!user) {
      next(
        new ApiError(
          401,
          "Authentication required"
        )
      );
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      next(
        new ApiError(
          403,
          "You do not have permission to perform this action"
        )
      );
      return;
    }

    next();
  };
};
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {

    console.log("🔥🔥🔥 VALIDATION MIDDLEWARE IS RUNNING 🔥🔥🔥");
    console.log("METHOD:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("BODY:", JSON.stringify(req.body, null, 2));

    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      console.log("❌❌❌ ZOD VALIDATION FAILED ❌❌❌");
      console.log(
        JSON.stringify(result.error.issues, null, 2)
      );

      next(result.error);
      return;
    }

    console.log("✅✅✅ ZOD VALIDATION PASSED ✅✅✅");

    const validatedData = result.data as {
      body: unknown;
      params: unknown;
      query: unknown;
    };

    req.body = validatedData.body;

    next();
  };
};
import { z } from "zod";

export const createPassportSchema = z.object({
  body: z.object({}).optional(),
});
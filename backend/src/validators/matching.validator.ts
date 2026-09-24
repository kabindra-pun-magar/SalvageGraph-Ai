import { z } from "zod";

export const runMatchingSchema = z.object({
  params: z.object({
    requirementId: z.string().uuid(
      "Invalid requirement ID"
    ),
  }),
});
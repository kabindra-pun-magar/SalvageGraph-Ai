import { z } from "zod";

export const createPassportSchema = z.object({
  body: z.object({}).optional(),
});

export const updatePassportSchema = z.object({
  body: z.object({
    subtype: z.string().max(100).optional(),

    dimensions: z
      .object({
        length: z.number().positive().optional(),
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
        diameter: z.number().positive().optional(),
      })
      .optional(),

    quantity: z
      .number()
      .positive("Quantity must be greater than 0")
      .optional(),

    unit: z.string().min(1).max(50).optional(),

    conditionScore: z
      .number()
      .min(0)
      .max(100)
      .optional(),

    source: z.string().max(255).optional(),

    location: z.string().max(255).optional(),
  }),
});
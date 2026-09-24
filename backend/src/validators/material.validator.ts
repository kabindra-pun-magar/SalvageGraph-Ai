import { z } from "zod";

export const createMaterialSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),

    type: z.enum([
      "BRICK",
      "TILE",
      "PIPE",
      "STEEL",
      "TIMBER",
      "OTHER",
    ]),

    description: z.string().max(1000).optional(),

    quantity: z.number().positive("Quantity must be greater than 0"),

    unit: z.string().min(1).max(50),

    condition: z
      .string()
      .min(2)
      .max(100)
      .optional(),

    length: z.number().positive().optional(),

    width: z.number().positive().optional(),

    height: z.number().positive().optional(),

    location: z.string().min(2).max(255),

    latitude: z.number().min(-90).max(90).optional(),

    longitude: z.number().min(-180).max(180).optional(),

    sourceProjectId: z.string().uuid().optional(),
  }),
});

export const updateMaterialSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150).optional(),

    type: z
      .enum([
        "BRICK",
        "TILE",
        "PIPE",
        "STEEL",
        "TIMBER",
        "OTHER",
      ])
      .optional(),

    description: z.string().max(1000).optional(),

    quantity: z.number().positive().optional(),

    unit: z.string().min(1).max(50).optional(),

    condition: z.string().min(2).max(100).optional(),

    length: z.number().positive().optional(),

    width: z.number().positive().optional(),

    height: z.number().positive().optional(),

    location: z.string().min(2).max(255).optional(),

    latitude: z.number().min(-90).max(90).optional(),

    longitude: z.number().min(-180).max(180).optional(),
  }),
});
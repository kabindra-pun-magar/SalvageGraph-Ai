import { z } from "zod";

const materialTypeSchema = z.enum([
  "BRICK",
  "TILE",
  "PIPE",
  "STEEL",
  "TIMBER",
  "OTHER",
]);

export const createMaterialSchema = z.object({
  body: z.object({
    materialCode: z.string().min(2).max(100),

    type: materialTypeSchema,

    subtype: z.string().max(100).optional(),

    quantity: z.number().positive(
      "Quantity must be greater than 0"
    ),

    unit: z.string().min(1).max(50),

    length: z.number().positive().optional(),

    width: z.number().positive().optional(),

    height: z.number().positive().optional(),

    diameter: z.number().positive().optional(),

    conditionScore: z.number().min(0).max(100).optional(),

    age: z.number().int().nonnegative().optional(),

    sourceProjectId: z.string().uuid().optional(),

    location: z.string().min(2).max(255).optional(),

    latitude: z.number().min(-90).max(90).optional(),

    longitude: z.number().min(-180).max(180).optional(),
  }),
});

export const updateMaterialSchema = z.object({
  body: z.object({
    materialCode: z.string().min(2).max(100).optional(),

    type: materialTypeSchema.optional(),

    subtype: z.string().max(100).optional(),

    quantity: z.number().positive().optional(),

    unit: z.string().min(1).max(50).optional(),

    length: z.number().positive().optional(),

    width: z.number().positive().optional(),

    height: z.number().positive().optional(),

    diameter: z.number().positive().optional(),

    conditionScore: z.number().min(0).max(100).optional(),

    age: z.number().int().nonnegative().optional(),

    location: z.string().min(2).max(255).optional(),

    latitude: z.number().min(-90).max(90).optional(),

    longitude: z.number().min(-180).max(180).optional(),
  }),
});
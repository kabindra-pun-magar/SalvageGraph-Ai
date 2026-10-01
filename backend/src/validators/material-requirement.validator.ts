import { z } from "zod";

const materialTypeSchema = z.enum([
  "TILE",
  "BRICK",
  "PIPE",
  "REBAR",
  "TIMBER",
  "CONCRETE",
  "SAND",
  "WOOD",
  "GLASS",
  "OTHER",
]);

export const createMaterialRequirementSchema = z.object({
  body: z.object({
    materialType: materialTypeSchema,

    subtype: z
      .string()
      .max(100)
      .optional(),

    quantity: z
      .number()
      .positive("Quantity must be greater than 0"),

    unit: z
      .string()
      .min(1)
      .max(50),

    requiredCondition: z
      .number()
      .min(0)
      .max(100)
      .optional(),

    length: z
      .number()
      .positive()
      .optional(),

    width: z
      .number()
      .positive()
      .optional(),

    height: z
      .number()
      .positive()
      .optional(),

    diameter: z
      .number()
      .positive()
      .optional(),

    intendedApplication: z
      .string()
      .max(255)
      .optional(),
  }),
});

export const updateMaterialRequirementSchema = z.object({
  body: z.object({
    materialType: materialTypeSchema.optional(),

    subtype: z
      .string()
      .max(100)
      .optional(),

    quantity: z
      .number()
      .positive("Quantity must be greater than 0")
      .optional(),

    unit: z
      .string()
      .min(1)
      .max(50)
      .optional(),

    requiredCondition: z
      .number()
      .min(0)
      .max(100)
      .optional(),

    length: z
      .number()
      .positive()
      .optional(),

    width: z
      .number()
      .positive()
      .optional(),

    height: z
      .number()
      .positive()
      .optional(),

    diameter: z
      .number()
      .positive()
      .optional(),

    intendedApplication: z
      .string()
      .max(255)
      .optional(),
  }),
});
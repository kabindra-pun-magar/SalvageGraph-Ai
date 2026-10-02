import { z } from "zod";

const materialTypeEnum = z.enum([
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

const optionalNumber = z
  .number()
  .finite()
  .optional();

const optionalUuid = z.preprocess(
  (value) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (
      typeof value === "string" &&
      value.trim() === ""
    ) {
      return undefined;
    }

    return value;
  },
  z.string().uuid().optional()
);

export const createMaterialSchema = z.object({
  body: z.object({
    materialCode: z
      .string()
      .min(1, "Material code is required"),

    type: materialTypeEnum,

    subtype: z
      .string()
      .optional(),

    quantity: z
      .number()
      .positive("Quantity must be greater than 0"),

    unit: z
      .string()
      .min(1, "Unit is required"),

    length: optionalNumber,

    width: optionalNumber,

    height: optionalNumber,

    diameter: optionalNumber,

    conditionScore: z
      .number()
      .min(0)
      .max(100)
      .optional(),

    age: z
      .number()
      .min(0)
      .optional(),

    sourceProjectId: optionalUuid,

    location: z
      .string()
      .optional(),

    latitude: z
      .number()
      .min(-90)
      .max(90)
      .optional(),

    longitude: z
      .number()
      .min(-180)
      .max(180)
      .optional(),
  }),
});

export const updateMaterialSchema = z.object({
  body: z.object({
    materialCode: z
      .string()
      .min(1)
      .optional(),

    type: materialTypeEnum.optional(),

    subtype: z
      .string()
      .optional(),

    quantity: z
      .number()
      .positive()
      .optional(),

    unit: z
      .string()
      .min(1)
      .optional(),

    length: optionalNumber,

    width: optionalNumber,

    height: optionalNumber,

    diameter: optionalNumber,

    conditionScore: z
      .number()
      .min(0)
      .max(100)
      .optional(),

    age: z
      .number()
      .min(0)
      .optional(),

    sourceProjectId: optionalUuid,

    location: z
      .string()
      .optional(),

    latitude: z
      .number()
      .min(-90)
      .max(90)
      .optional(),

    longitude: z
      .number()
      .min(-180)
      .max(180)
      .optional(),

    status: z
      .string()
      .optional(),

    verification: z
      .string()
      .optional(),
  }),
});
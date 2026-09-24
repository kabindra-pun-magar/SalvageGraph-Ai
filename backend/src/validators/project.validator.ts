import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Project name must be at least 2 characters")
      .max(150, "Project name must not exceed 150 characters"),

    description: z
      .string()
      .max(1000, "Description must not exceed 1000 characters")
      .optional(),

    location: z
      .string()
      .min(2, "Location is required")
      .max(255, "Location must not exceed 255 characters"),

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

    budget: z
      .number()
      .positive("Budget must be greater than 0")
      .optional(),

    deadline: z
      .string()
      .datetime()
      .optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2)
      .max(150)
      .optional(),

    description: z
      .string()
      .max(1000)
      .optional(),

    location: z
      .string()
      .min(2)
      .max(255)
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

    budget: z
      .number()
      .positive()
      .optional(),

    deadline: z
      .string()
      .datetime()
      .optional(),
  }),
});
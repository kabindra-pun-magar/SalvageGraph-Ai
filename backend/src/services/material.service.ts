import { prisma } from "../config/database";
import { ApiError } from "../utils/api-error";

interface CreateMaterialInput {
  materialCode: string;

  type:
    | "BRICK"
    | "TILE"
    | "PIPE"
    | "STEEL"
    | "TIMBER"
    | "OTHER";

  subtype?: string;

  quantity: number;
  unit: string;

  length?: number;
  width?: number;
  height?: number;
  diameter?: number;

  conditionScore?: number;
  age?: number;

  sourceProjectId?: string;

  location?: string;
  latitude?: number;
  longitude?: number;
}

interface UpdateMaterialInput {
  materialCode?: string;

  type?:
    | "BRICK"
    | "TILE"
    | "PIPE"
    | "STEEL"
    | "TIMBER"
    | "OTHER";

  subtype?: string;

  quantity?: number;
  unit?: string;

  length?: number;
  width?: number;
  height?: number;
  diameter?: number;

  conditionScore?: number;
  age?: number;

  location?: string;
  latitude?: number;
  longitude?: number;
}

export const createMaterial = async (
  userId: string,
  input: CreateMaterialInput
) => {
  const existingMaterial = await prisma.material.findUnique({
    where: {
      materialCode: input.materialCode,
    },
  });

  if (existingMaterial) {
    throw new ApiError(
      409,
      "Material code already exists"
    );
  }

  if (input.sourceProjectId) {
    const project = await prisma.project.findUnique({
      where: {
        id: input.sourceProjectId,
      },
    });

    if (!project) {
      throw new ApiError(
        404,
        "Source project not found"
      );
    }

    if (project.ownerId !== userId) {
      throw new ApiError(
        403,
        "You do not have permission to use this project"
      );
    }
  }

  return prisma.material.create({
    data: {
      materialCode: input.materialCode,
      type: input.type,
      subtype: input.subtype,

      quantity: input.quantity,
      unit: input.unit,

      length: input.length,
      width: input.width,
      height: input.height,
      diameter: input.diameter,

      conditionScore: input.conditionScore,
      age: input.age,

      sourceProjectId: input.sourceProjectId,

      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,

      registeredById: userId,
    },
  });
};

export const getUserMaterials = async (
  userId: string
) => {
  return prisma.material.findMany({
    where: {
      registeredById: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getRecentUserMaterials = async (
  userId: string
) => {
  return prisma.material.findMany({
    where: {
      registeredById: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    select: {
      id: true,
      materialCode: true,
      type: true,
      subtype: true,
      quantity: true,
      unit: true,
      conditionScore: true,
      location: true,
      status: true,
      verification: true,
      createdAt: true,
    },
  });
};

export const getMaterialById = async (
  materialId: string,
  userId: string
) => {
  const material = await prisma.material.findUnique({
    where: {
      id: materialId,
    },
  });

  if (!material) {
    throw new ApiError(
      404,
      "Material not found"
    );
  }

  if (material.registeredById !== userId) {
    throw new ApiError(
      403,
      "You do not have permission to access this material"
    );
  }

  return material;
};

export const updateMaterial = async (
  materialId: string,
  userId: string,
  input: UpdateMaterialInput
) => {
  const material = await getMaterialById(
    materialId,
    userId
  );

  if (
    input.materialCode &&
    input.materialCode !== material.materialCode
  ) {
    const existingMaterial =
      await prisma.material.findUnique({
        where: {
          materialCode: input.materialCode,
        },
      });

    if (existingMaterial) {
      throw new ApiError(
        409,
        "Material code already exists"
      );
    }
  }

  return prisma.material.update({
    where: {
      id: material.id,
    },

    data: {
      materialCode: input.materialCode,
      type: input.type,
      subtype: input.subtype,

      quantity: input.quantity,
      unit: input.unit,

      length: input.length,
      width: input.width,
      height: input.height,
      diameter: input.diameter,

      conditionScore: input.conditionScore,
      age: input.age,

      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
    },
  });
};

export const deleteMaterial = async (
  materialId: string,
  userId: string
) => {
  const material = await getMaterialById(
    materialId,
    userId
  );

  await prisma.material.delete({
    where: {
      id: material.id,
    },
  });
};
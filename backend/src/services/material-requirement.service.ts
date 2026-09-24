import { prisma } from "../config/database";
import { ApiError } from "../utils/api-error";

interface CreateMaterialRequirementInput {
  projectId: string;
  userId: string;

  materialType:
    | "BRICK"
    | "TILE"
    | "PIPE"
    | "STEEL"
    | "TIMBER"
    | "OTHER";

  subtype?: string;
  quantity: number;
  unit: string;
  requiredCondition?: number;

  length?: number;
  width?: number;
  height?: number;
  diameter?: number;

  intendedApplication?: string;
}

interface UpdateMaterialRequirementInput {
  materialType?:
    | "BRICK"
    | "TILE"
    | "PIPE"
    | "STEEL"
    | "TIMBER"
    | "OTHER";

  subtype?: string;
  quantity?: number;
  unit?: string;
  requiredCondition?: number;

  length?: number;
  width?: number;
  height?: number;
  diameter?: number;

  intendedApplication?: string;
}

export const createMaterialRequirement = async (
  input: CreateMaterialRequirementInput
) => {
  const {
    projectId,
    userId,
    materialType,
    subtype,
    quantity,
    unit,
    requiredCondition,
    length,
    width,
    height,
    diameter,
    intendedApplication,
  } = input;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.ownerId !== userId) {
    throw new ApiError(
      403,
      "You do not have permission to add requirements to this project"
    );
  }

  return prisma.materialRequirement.create({
    data: {
      projectId,
      materialType,
      subtype,
      quantity,
      unit,
      requiredCondition,
      length,
      width,
      height,
      diameter,
      intendedApplication,
    },
  });
};

export const getProjectRequirements = async (
  projectId: string,
  userId: string
) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.ownerId !== userId) {
    throw new ApiError(
      403,
      "You do not have permission to access this project"
    );
  }

  return prisma.materialRequirement.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMaterialRequirementById = async (
  requirementId: string,
  userId: string
) => {
  const requirement =
    await prisma.materialRequirement.findUnique({
      where: {
        id: requirementId,
      },
      include: {
        project: true,
      },
    });

  if (!requirement) {
    throw new ApiError(
      404,
      "Material requirement not found"
    );
  }

  if (requirement.project.ownerId !== userId) {
    throw new ApiError(
      403,
      "You do not have permission to access this requirement"
    );
  }

  return requirement;
};

export const updateMaterialRequirement = async (
  requirementId: string,
  userId: string,
  input: UpdateMaterialRequirementInput
) => {
  const requirement =
    await getMaterialRequirementById(
      requirementId,
      userId
    );

  return prisma.materialRequirement.update({
    where: {
      id: requirement.id,
    },
    data: input,
  });
};

export const deleteMaterialRequirement = async (
  requirementId: string,
  userId: string
) => {
  const requirement =
    await getMaterialRequirementById(
      requirementId,
      userId
    );

  await prisma.materialRequirement.delete({
    where: {
      id: requirement.id,
    },
  });
};
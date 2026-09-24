import { prisma } from "../config/database";
import { ApiError } from "../utils/api-error";

interface CreateProjectInput {
  name: string;
  description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  budget?: number;
  deadline?: string;
}

interface UpdateProjectInput {
  name?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  budget?: number;
  deadline?: string;
}

export const createProject = async (
  userId: string,
  input: CreateProjectInput
) => {
  const project = await prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
      budget: input.budget,
      deadline: input.deadline
        ? new Date(input.deadline)
        : undefined,
      ownerId: userId,
    },
  });

  return project;
};

export const getUserProjects = async (
  userId: string
) => {
  return prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getRecentUserProjects = async (
  userId: string
) => {
  return prisma.project.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    select: {
      id: true,
      name: true,
      location: true,
      deadline: true,
      createdAt: true,
    },
  });
};

export const getProjectById = async (
  projectId: string,
  userId: string
) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new ApiError(
      404,
      "Project not found"
    );
  }

  if (project.ownerId !== userId) {
    throw new ApiError(
      403,
      "You do not have permission to access this project"
    );
  }

  return project;
};

export const updateProject = async (
  projectId: string,
  userId: string,
  input: UpdateProjectInput
) => {
  const project = await getProjectById(
    projectId,
    userId
  );

  const updatedProject = await prisma.project.update({
    where: {
      id: project.id,
    },
    data: {
      name: input.name,
      description: input.description,
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
      budget: input.budget,
      deadline: input.deadline
        ? new Date(input.deadline)
        : undefined,
    },
  });

  return updatedProject;
};

export const deleteProject = async (
  projectId: string,
  userId: string
) => {
  const project = await getProjectById(
    projectId,
    userId
  );

  await prisma.project.delete({
    where: {
      id: project.id,
    },
  });
};
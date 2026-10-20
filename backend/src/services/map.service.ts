import { prisma } from "../config/database";

export const getMapProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: {
      ownerId: userId,
      latitude: {
        not: null,
      },
      longitude: {
        not: null,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      latitude: true,
      longitude: true,
      deadline: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMapMaterials = async (userId: string) => {
  return prisma.material.findMany({
    where: {
      status: "AVAILABLE",
      latitude: {
        not: null,
      },
      longitude: {
        not: null,
      },
      OR: [
        {
          registeredById: userId,
        },
        {
          sourceProject: {
            is: {
              ownerId: userId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      materialCode: true,
      type: true,
      subtype: true,
      quantity: true,
      unit: true,
      status: true,
      verification: true,
      conditionScore: true,
      location: true,
      latitude: true,
      longitude: true,
      sourceProject: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMapOverview = async (userId: string) => {
  const [projects, materials] = await Promise.all([
    getMapProjects(userId),
    getMapMaterials(userId),
  ]);

  return {
    projects,
    materials,
    summary: {
      totalProjects: projects.length,
      totalMaterials: materials.length,
    },
  };
};
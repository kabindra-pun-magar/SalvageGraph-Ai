import { prisma } from "../config/database";
import { ApiError } from "../utils/api-error";

interface CreatePassportInput {
  materialId: string;
  userId: string;
}

const generatePassportCode = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase();

  return `PASS-${timestamp}-${random}`;
};

export const createPassport = async (
  input: CreatePassportInput
) => {
  const { materialId, userId } = input;

  // 1. Find material
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

  // 2. Verify ownership
  if (material.registeredById !== userId) {
    throw new ApiError(
      403,
      "You do not have permission to create a passport for this material"
    );
  }

  // 3. Check whether passport already exists
  const existingPassport =
    await prisma.materialPassport.findUnique({
      where: {
        materialId,
      },
    });

  if (existingPassport) {
    throw new ApiError(
      409,
      "Material passport already exists"
    );
  }

  // 4. Generate unique passport code
  let passportCode = generatePassportCode();

  let codeExists =
    await prisma.materialPassport.findUnique({
      where: {
        passportCode,
      },
    });

  while (codeExists) {
    passportCode = generatePassportCode();

    codeExists =
      await prisma.materialPassport.findUnique({
        where: {
          passportCode,
        },
      });
  }

  // 5. Build dimensions snapshot
  const dimensions = {
    length: material.length,
    width: material.width,
    height: material.height,
    diameter: material.diameter,
  };

  // 6. Create passport + history atomically
  const result = await prisma.$transaction(
    async (tx) => {
      const passport =
        await tx.materialPassport.create({
          data: {
            materialId: material.id,
            passportCode,
            materialType: material.type,
            subtype: material.subtype,
            dimensions,
            quantity: material.quantity,
            unit: material.unit,
            conditionScore: material.conditionScore,
            source: material.sourceProjectId
              ? material.sourceProjectId
              : null,
            location: material.location,
            registeredDate: material.createdAt,
          },
        });

      await tx.materialHistory.create({
        data: {
          materialId: material.id,
          action: "PASSPORT_CREATED",
          description:
            "Material passport created",
          metadata: {
            passportCode,
          },
        },
      });

      return passport;
    }
  );

  return result;
};
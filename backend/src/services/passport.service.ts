import QRCode from "qrcode";
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

export const getPassportByMaterialId = async (
  materialId: string,
  userId: string
) => {
  const material = await prisma.material.findUnique({
    where: { id: materialId },
  });

  if (!material) {
    throw new ApiError(404, "Material not found");
  }

  if (material.registeredById !== userId) {
    throw new ApiError(
      403,
      "You do not have permission to access this material passport"
    );
  }

  const passport = await prisma.materialPassport.findUnique({
    where: { materialId },
  });

  if (!passport) {
    throw new ApiError(
      404,
      "Material passport not found"
    );
  }

  return passport;
};

interface UpdatePassportInput {
  passportId: string;
  userId: string;
  subtype?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    diameter?: number;
  };
  quantity?: number;
  unit?: string;
  conditionScore?: number;
  source?: string;
  location?: string;
}

export const updatePassport = async (
  input: UpdatePassportInput
) => {
  const {
    passportId,
    userId,
    subtype,
    dimensions,
    quantity,
    unit,
    conditionScore,
    source,
    location,
  } = input;

  const passport = await prisma.materialPassport.findUnique({
    where: { id: passportId },
    include: {
      material: true,
    },
  });

  if (!passport) {
    throw new ApiError(404, "Material passport not found");
  }

  if (passport.material.registeredById !== userId) {
    throw new ApiError(
      403,
      "You do not have permission to update this material passport"
    );
  }

  const updatedPassport = await prisma.$transaction(
    async (tx) => {
      const updated = await tx.materialPassport.update({
        where: { id: passportId },
        data: {
          subtype,
          dimensions,
          quantity,
          unit,
          conditionScore,
          source,
          location,
        },
      });

      await tx.materialHistory.create({
        data: {
          materialId: passport.materialId,
          action: "PASSPORT_UPDATED",
          description: "Material passport updated",
          metadata: {
            passportCode: passport.passportCode,
          },
        },
      });

      return updated;
    }
  );

  return updatedPassport;
};

export const getMaterialHistory = async (
  materialId: string,
  userId: string
) => {
  const material = await prisma.material.findUnique({
    where: { id: materialId },
  });

  if (!material) {
    throw new ApiError(404, "Material not found");
  }

  if (material.registeredById !== userId) {
    throw new ApiError(
      403,
      "You do not have permission to access this material history"
    );
  }

  const history = await prisma.materialHistory.findMany({
    where: {
      materialId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return history;
};

export const generatePassportQRCode = async (
  passportId: string,
  userId: string
) => {
  const passport = await prisma.materialPassport.findUnique({
    where: { id: passportId },
    include: {
      material: true,
    },
  });

  if (!passport) {
    throw new ApiError(404, "Material passport not found");
  }

  if (passport.material.registeredById !== userId) {
    throw new ApiError(
      403,
      "You do not have permission to generate this passport QR code"
    );
  }

  const passportUrl =
    `http://localhost:5000/api/passports/${passport.passportCode}`;

  const qrCode = await QRCode.toDataURL(passportUrl);

  const updatedPassport = await prisma.$transaction(
    async (tx) => {
      const updated = await tx.materialPassport.update({
        where: { id: passportId },
        data: {
          qrCode,
        },
      });

      await tx.materialHistory.create({
        data: {
          materialId: passport.materialId,
          action: "QR_CODE_GENERATED",
          description: "Passport QR code generated",
          metadata: {
            passportCode: passport.passportCode,
          },
        },
      });

      return updated;
    }
  );

  return updatedPassport;
};
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PROJECT_MANAGER', 'MATERIAL_MANAGER', 'INSPECTOR', 'USER');

-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('TILE', 'BRICK', 'PIPE', 'STEEL', 'TIMBER', 'OTHER');

-- CreateEnum
CREATE TYPE "MaterialStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'ALLOCATED', 'USED', 'DISPOSED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'NEEDS_INSPECTION');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('CANDIDATE', 'EVALUATED', 'RECOMMENDED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_INSPECTION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "budget" DECIMAL(14,2),
    "deadline" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "materialCode" TEXT NOT NULL,
    "type" "MaterialType" NOT NULL,
    "subtype" TEXT,
    "quantity" DECIMAL(14,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "diameter" DOUBLE PRECISION,
    "conditionScore" DOUBLE PRECISION,
    "age" INTEGER,
    "sourceProjectId" TEXT,
    "location" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "MaterialStatus" NOT NULL DEFAULT 'AVAILABLE',
    "verification" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "registeredById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialImage" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageType" TEXT,
    "aiMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialPassport" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "passportCode" TEXT NOT NULL,
    "qrCode" TEXT,
    "materialType" "MaterialType" NOT NULL,
    "subtype" TEXT,
    "dimensions" JSONB,
    "quantity" DECIMAL(14,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "conditionScore" DOUBLE PRECISION,
    "source" TEXT,
    "location" TEXT,
    "registeredDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialPassport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialHistory" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "projectId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialRequirement" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "materialType" "MaterialType" NOT NULL,
    "subtype" TEXT,
    "quantity" DECIMAL(14,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "requiredCondition" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "diameter" DOUBLE PRECISION,
    "intendedApplication" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,
    "compatibilityScore" DOUBLE PRECISION,
    "conditionScore" DOUBLE PRECISION,
    "quantityScore" DOUBLE PRECISION,
    "dimensionScore" DOUBLE PRECISION,
    "distanceKm" DOUBLE PRECISION,
    "transportCost" DECIMAL(14,2),
    "economicBenefit" DECIMAL(14,2),
    "suitabilityScore" DOUBLE PRECISION,
    "status" "MatchStatus" NOT NULL DEFAULT 'CANDIDATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "explanation" TEXT NOT NULL,
    "estimatedSaving" DECIMAL(14,2),
    "environmentalBenefit" JSONB,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedBy" TEXT,
    "verificationNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");

-- CreateIndex
CREATE INDEX "Project_deadline_idx" ON "Project"("deadline");

-- CreateIndex
CREATE UNIQUE INDEX "Material_materialCode_key" ON "Material"("materialCode");

-- CreateIndex
CREATE INDEX "Material_type_idx" ON "Material"("type");

-- CreateIndex
CREATE INDEX "Material_status_idx" ON "Material"("status");

-- CreateIndex
CREATE INDEX "Material_verification_idx" ON "Material"("verification");

-- CreateIndex
CREATE INDEX "Material_sourceProjectId_idx" ON "Material"("sourceProjectId");

-- CreateIndex
CREATE INDEX "MaterialImage_materialId_idx" ON "MaterialImage"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialPassport_materialId_key" ON "MaterialPassport"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "MaterialPassport_passportCode_key" ON "MaterialPassport"("passportCode");

-- CreateIndex
CREATE INDEX "MaterialHistory_materialId_idx" ON "MaterialHistory"("materialId");

-- CreateIndex
CREATE INDEX "MaterialHistory_createdAt_idx" ON "MaterialHistory"("createdAt");

-- CreateIndex
CREATE INDEX "MaterialRequirement_projectId_idx" ON "MaterialRequirement"("projectId");

-- CreateIndex
CREATE INDEX "MaterialRequirement_materialType_idx" ON "MaterialRequirement"("materialType");

-- CreateIndex
CREATE INDEX "Match_materialId_idx" ON "Match"("materialId");

-- CreateIndex
CREATE INDEX "Match_requirementId_idx" ON "Match"("requirementId");

-- CreateIndex
CREATE INDEX "Match_suitabilityScore_idx" ON "Match"("suitabilityScore");

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Recommendation_matchId_key" ON "Recommendation"("matchId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_sourceProjectId_fkey" FOREIGN KEY ("sourceProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialImage" ADD CONSTRAINT "MaterialImage_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialPassport" ADD CONSTRAINT "MaterialPassport_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialHistory" ADD CONSTRAINT "MaterialHistory_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialRequirement" ADD CONSTRAINT "MaterialRequirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "MaterialRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

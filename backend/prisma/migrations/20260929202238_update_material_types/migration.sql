/*
  Warnings:

  - The values [STEEL,OTHER] on the enum `MaterialType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MaterialType_new" AS ENUM ('TILE', 'BRICK', 'PIPE', 'REBAR', 'TIMBER', 'CONCRETE', 'SAND', 'WOOD', 'GLASS');
ALTER TABLE "Material" ALTER COLUMN "type" TYPE "MaterialType_new" USING ("type"::text::"MaterialType_new");
ALTER TABLE "MaterialPassport" ALTER COLUMN "materialType" TYPE "MaterialType_new" USING ("materialType"::text::"MaterialType_new");
ALTER TABLE "MaterialRequirement" ALTER COLUMN "materialType" TYPE "MaterialType_new" USING ("materialType"::text::"MaterialType_new");
ALTER TYPE "MaterialType" RENAME TO "MaterialType_old";
ALTER TYPE "MaterialType_new" RENAME TO "MaterialType";
DROP TYPE "public"."MaterialType_old";
COMMIT;

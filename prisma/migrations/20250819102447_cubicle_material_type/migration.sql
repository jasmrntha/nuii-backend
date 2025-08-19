/*
  Warnings:

  - Added the required column `cubicle_type` to the `CubicleSurvey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_cubicle_material` to the `CubicleSurvey` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CubicleType" AS ENUM ('Incoming', 'Outgoing', 'Metering');

-- AlterTable
ALTER TABLE "CubicleSurvey" ADD COLUMN     "cubicle_type" "CubicleType" NOT NULL,
ADD COLUMN     "id_cubicle_material" INTEGER NOT NULL;

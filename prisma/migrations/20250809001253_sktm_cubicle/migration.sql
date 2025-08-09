/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `ExcelArchive` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `ExcelArchive` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `GroundingTermination` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `GroundingTermination` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `GroundingTermination` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `KonstruksiMaterial` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `KonstruksiMaterial` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `KonstruksiMaterial` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Logging` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Logging` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `PoleMaterial` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `PoleMaterial` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `PoleMaterial` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `PoleSupporter` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `PoleSupporter` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `PoleSupporter` table. All the data in the column will be lost.
  - You are about to drop the column `id_material_konduktor` on the `SurveyHeader` table. All the data in the column will be lost.
  - You are about to drop the `SurveyDetail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tipe_survey` to the `GroundingMaterial` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SurveyType" AS ENUM ('SUTM', 'SKTM', 'CUBICLE', 'APP_TM');

-- CreateEnum
CREATE TYPE "SktmMatType" AS ENUM ('CABLE', 'TERMINATION', 'JOINTING', 'ARRESTER', 'GROUNDING');

-- DropForeignKey
ALTER TABLE "SurveyDetail" DROP CONSTRAINT "SurveyDetail_id_grounding_termination_fkey";

-- DropForeignKey
ALTER TABLE "SurveyDetail" DROP CONSTRAINT "SurveyDetail_id_header_fkey";

-- DropForeignKey
ALTER TABLE "SurveyDetail" DROP CONSTRAINT "SurveyDetail_id_konstruksi_fkey";

-- DropForeignKey
ALTER TABLE "SurveyDetail" DROP CONSTRAINT "SurveyDetail_id_material_tiang_fkey";

-- DropForeignKey
ALTER TABLE "SurveyDetail" DROP CONSTRAINT "SurveyDetail_id_pole_supporter_fkey";

-- DropForeignKey
ALTER TABLE "SurveyHeader" DROP CONSTRAINT "SurveyHeader_id_material_konduktor_fkey";

-- AlterTable
ALTER TABLE "ExcelArchive" DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "GroundingMaterial" ADD COLUMN     "tipe_survey" "SurveyType" NOT NULL;

-- AlterTable
ALTER TABLE "GroundingTermination" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Konstruksi" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "KonstruksiMaterial" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Logging" DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Material" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PoleMaterial" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "PoleSupporter" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "SurveyHeader" DROP COLUMN "id_material_konduktor",
ALTER COLUMN "updated_at" DROP DEFAULT;

-- DropTable
DROP TABLE "SurveyDetail";

-- CreateTable
CREATE TABLE "SurveySequance" (
    "id" SERIAL NOT NULL,
    "survey_header_id" INTEGER NOT NULL,
    "tipe" "SurveyType" NOT NULL,
    "urutan" INTEGER NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveySequance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SutmSurvey" (
    "id" SERIAL NOT NULL,
    "id_survey_header" INTEGER NOT NULL,
    "id_material_konduktor" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "SutmSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SutmDetail" (
    "id" SERIAL NOT NULL,
    "id_sutm_survey" INTEGER NOT NULL,
    "id_material_tiang" INTEGER NOT NULL,
    "id_konstruksi" INTEGER NOT NULL,
    "id_pole_supporter" INTEGER,
    "id_grounding_termination" INTEGER,
    "penyulang" TEXT NOT NULL,
    "panjang_jaringan" INTEGER NOT NULL,
    "long" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "petugas_survey" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "SutmDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SktmSurvey" (
    "id" SERIAL NOT NULL,
    "id_survey_header" INTEGER NOT NULL,
    "penyulang" TEXT NOT NULL,
    "panjang_jaringan" INTEGER NOT NULL,
    "diameter_kabel" DECIMAL(65,30) NOT NULL,
    "long" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "petugas_survey" TEXT NOT NULL,
    "has_arrester" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "SktmSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SktmComponent" (
    "id" SERIAL NOT NULL,
    "id_sktm_survey" INTEGER NOT NULL,
    "id_material" INTEGER NOT NULL,
    "tipe_material" "SktmMatType" NOT NULL,
    "kuantitas" DECIMAL(65,30) NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "SktmComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SktmJoint" (
    "id" SERIAL NOT NULL,
    "id_sktm_survey" INTEGER NOT NULL,
    "id_material_kabel" INTEGER NOT NULL,
    "id_material_joint" INTEGER NOT NULL,
    "lat" TEXT NOT NULL,
    "long" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "SktmJoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CubicleSurvey" (
    "id" SERIAL NOT NULL,
    "id_survey_header" INTEGER NOT NULL,
    "has_grounding" BOOLEAN,
    "penyulang" TEXT NOT NULL,
    "long" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "petugas_survey" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CubicleSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CubicleComponent" (
    "id" SERIAL NOT NULL,
    "id_cubicle_survey" INTEGER NOT NULL,
    "id_material" INTEGER NOT NULL,
    "kuantitas" DECIMAL(65,30) NOT NULL,
    "tipe_cubicle" TEXT NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CubicleComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppTmSurvey" (
    "id" SERIAL NOT NULL,
    "id_survey_header" INTEGER NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "AppTmSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessoryMaterial" (
    "id" SERIAL NOT NULL,
    "id_material" INTEGER NOT NULL,
    "nama_material" TEXT NOT NULL,
    "kuantitas" DECIMAL(65,30),
    "tipe_survey" "SurveyType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "AccessoryMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KabelMaterial" (
    "id" SERIAL NOT NULL,
    "id_material" INTEGER NOT NULL,
    "nama_material" TEXT NOT NULL,
    "kuantitas" DECIMAL(65,30),
    "tipe_survey" "SurveyType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "KabelMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TerminasiMaterial" (
    "id" SERIAL NOT NULL,
    "id_material" INTEGER NOT NULL,
    "nama_material" TEXT NOT NULL,
    "kuantitas" DECIMAL(65,30),
    "tipe_survey" "SurveyType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "TerminasiMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JointingMaterial" (
    "id" SERIAL NOT NULL,
    "id_material" INTEGER NOT NULL,
    "nama_material" TEXT NOT NULL,
    "kuantitas" DECIMAL(65,30),
    "tipe_survey" "SurveyType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "JointingMaterial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SurveySequance" ADD CONSTRAINT "SurveySequance_survey_header_id_fkey" FOREIGN KEY ("survey_header_id") REFERENCES "SurveyHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SutmSurvey" ADD CONSTRAINT "SutmSurvey_id_survey_header_fkey" FOREIGN KEY ("id_survey_header") REFERENCES "SurveyHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SutmSurvey" ADD CONSTRAINT "SutmSurvey_id_material_konduktor_fkey" FOREIGN KEY ("id_material_konduktor") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SutmDetail" ADD CONSTRAINT "SutmDetail_id_sutm_survey_fkey" FOREIGN KEY ("id_sutm_survey") REFERENCES "SutmSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SutmDetail" ADD CONSTRAINT "SutmDetail_id_material_tiang_fkey" FOREIGN KEY ("id_material_tiang") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SutmDetail" ADD CONSTRAINT "SutmDetail_id_konstruksi_fkey" FOREIGN KEY ("id_konstruksi") REFERENCES "Konstruksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SutmDetail" ADD CONSTRAINT "SutmDetail_id_pole_supporter_fkey" FOREIGN KEY ("id_pole_supporter") REFERENCES "PoleSupporter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SutmDetail" ADD CONSTRAINT "SutmDetail_id_grounding_termination_fkey" FOREIGN KEY ("id_grounding_termination") REFERENCES "GroundingTermination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SktmSurvey" ADD CONSTRAINT "SktmSurvey_id_survey_header_fkey" FOREIGN KEY ("id_survey_header") REFERENCES "SurveyHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SktmComponent" ADD CONSTRAINT "SktmComponent_id_sktm_survey_fkey" FOREIGN KEY ("id_sktm_survey") REFERENCES "SktmSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SktmComponent" ADD CONSTRAINT "SktmComponent_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SktmJoint" ADD CONSTRAINT "SktmJoint_id_sktm_survey_fkey" FOREIGN KEY ("id_sktm_survey") REFERENCES "SktmSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SktmJoint" ADD CONSTRAINT "SktmJoint_id_material_joint_fkey" FOREIGN KEY ("id_material_joint") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SktmJoint" ADD CONSTRAINT "SktmJoint_id_material_kabel_fkey" FOREIGN KEY ("id_material_kabel") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CubicleSurvey" ADD CONSTRAINT "CubicleSurvey_id_survey_header_fkey" FOREIGN KEY ("id_survey_header") REFERENCES "SurveyHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CubicleComponent" ADD CONSTRAINT "CubicleComponent_id_cubicle_survey_fkey" FOREIGN KEY ("id_cubicle_survey") REFERENCES "CubicleSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CubicleComponent" ADD CONSTRAINT "CubicleComponent_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppTmSurvey" ADD CONSTRAINT "AppTmSurvey_id_survey_header_fkey" FOREIGN KEY ("id_survey_header") REFERENCES "SurveyHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessoryMaterial" ADD CONSTRAINT "AccessoryMaterial_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KabelMaterial" ADD CONSTRAINT "KabelMaterial_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TerminasiMaterial" ADD CONSTRAINT "TerminasiMaterial_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JointingMaterial" ADD CONSTRAINT "JointingMaterial_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `CubicleComponent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CubicleComponent" DROP CONSTRAINT "CubicleComponent_id_cubicle_survey_fkey";

-- DropForeignKey
ALTER TABLE "CubicleComponent" DROP CONSTRAINT "CubicleComponent_id_material_fkey";

-- DropForeignKey
ALTER TABLE "SktmComponent" DROP CONSTRAINT "SktmComponent_id_sktm_survey_fkey";

-- AlterTable
ALTER TABLE "SktmComponent" ADD COLUMN     "id_sktm_detail" INTEGER,
ALTER COLUMN "id_sktm_survey" DROP NOT NULL;

-- DropTable
DROP TABLE "CubicleComponent";

-- AddForeignKey
ALTER TABLE "SktmComponent" ADD CONSTRAINT "SktmComponent_id_sktm_survey_fkey" FOREIGN KEY ("id_sktm_survey") REFERENCES "SktmSurvey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SktmComponent" ADD CONSTRAINT "SktmComponent_id_sktm_detail_fkey" FOREIGN KEY ("id_sktm_detail") REFERENCES "SktmDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

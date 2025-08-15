/*
  Warnings:

  - You are about to drop the column `id_sktm_detail` on the `SktmComponent` table. All the data in the column will be lost.
  - Made the column `id_sktm_survey` on table `SktmComponent` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SktmComponent" DROP CONSTRAINT "SktmComponent_id_sktm_detail_fkey";

-- DropForeignKey
ALTER TABLE "SktmComponent" DROP CONSTRAINT "SktmComponent_id_sktm_survey_fkey";

-- AlterTable
ALTER TABLE "SktmComponent" DROP COLUMN "id_sktm_detail",
ALTER COLUMN "id_sktm_survey" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SktmComponent" ADD CONSTRAINT "SktmComponent_id_sktm_survey_fkey" FOREIGN KEY ("id_sktm_survey") REFERENCES "SktmSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

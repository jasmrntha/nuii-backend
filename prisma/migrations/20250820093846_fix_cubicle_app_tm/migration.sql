/*
  Warnings:

  - Added the required column `foto` to the `AppTmSurvey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `AppTmSurvey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `long` to the `AppTmSurvey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `penyulang` to the `AppTmSurvey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppTmComponent" DROP CONSTRAINT "AppTmComponent_id_apptm_survey_fkey";

-- AlterTable
ALTER TABLE "AppTmSurvey" ADD COLUMN     "foto" TEXT NOT NULL,
ADD COLUMN     "lat" TEXT NOT NULL,
ADD COLUMN     "long" TEXT NOT NULL,
ADD COLUMN     "penyulang" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AppTmComponent" ADD CONSTRAINT "AppTmComponent_id_apptm_survey_fkey" FOREIGN KEY ("id_apptm_survey") REFERENCES "AppTmSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

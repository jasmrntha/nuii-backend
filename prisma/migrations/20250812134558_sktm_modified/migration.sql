/*
  Warnings:

  - You are about to drop the column `diameter_kabel` on the `SktmSurvey` table. All the data in the column will be lost.
  - You are about to drop the column `foto` on the `SktmSurvey` table. All the data in the column will be lost.
  - You are about to drop the column `has_arrester` on the `SktmSurvey` table. All the data in the column will be lost.
  - You are about to drop the column `keterangan` on the `SktmSurvey` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `SktmSurvey` table. All the data in the column will be lost.
  - You are about to drop the column `long` on the `SktmSurvey` table. All the data in the column will be lost.
  - You are about to drop the column `panjang_jaringan` on the `SktmSurvey` table. All the data in the column will be lost.
  - You are about to drop the column `penyulang` on the `SktmSurvey` table. All the data in the column will be lost.
  - You are about to drop the column `petugas_survey` on the `SktmSurvey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SktmSurvey" DROP COLUMN "diameter_kabel",
DROP COLUMN "foto",
DROP COLUMN "has_arrester",
DROP COLUMN "keterangan",
DROP COLUMN "lat",
DROP COLUMN "long",
DROP COLUMN "panjang_jaringan",
DROP COLUMN "penyulang",
DROP COLUMN "petugas_survey";

-- AlterTable
ALTER TABLE "SurveySequance" ADD COLUMN     "survey_detail_id" INTEGER;

-- CreateTable
CREATE TABLE "SktmDetail" (
    "id" SERIAL NOT NULL,
    "id_sktm_survey" INTEGER NOT NULL,
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

    CONSTRAINT "SktmDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SktmDetail" ADD CONSTRAINT "SktmDetail_id_sktm_survey_fkey" FOREIGN KEY ("id_sktm_survey") REFERENCES "SktmSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

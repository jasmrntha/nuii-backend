/*
  Warnings:

  - You are about to drop the `Accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('Disetujui', 'Belum_Disetujui');

-- CreateEnum
CREATE TYPE "KategoriMaterial" AS ENUM ('Umum', 'Pekerjaan_Utama', 'Accesories');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('Create', 'Update', 'Delete');

-- DropTable
DROP TABLE "Accounts";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "TipeMaterial" (
    "id" SERIAL NOT NULL,
    "tipe_material" TEXT NOT NULL,

    CONSTRAINT "TipeMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "id_tipe_material" INTEGER NOT NULL,
    "nomor_material" INTEGER NOT NULL,
    "nama_material" TEXT NOT NULL,
    "satuan_material" TEXT NOT NULL,
    "berat_material" DECIMAL(65,30) NOT NULL,
    "harga_material" INTEGER NOT NULL,
    "pasang_rab" INTEGER NOT NULL,
    "bongkar" INTEGER NOT NULL,
    "jenis_material" TEXT NOT NULL,
    "kategori_material" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyHeader" (
    "id" SERIAL NOT NULL,
    "nama_survey" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "status_survey" "SurveyStatus" NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyDetail" (
    "id" SERIAL NOT NULL,
    "id_material_tiang" INTEGER NOT NULL,
    "id_material_konduktor" INTEGER NOT NULL,
    "id_konstruksi" INTEGER NOT NULL,
    "id_header" INTEGER NOT NULL,
    "nama_pekerjaan" TEXT NOT NULL,
    "penyulang" TEXT NOT NULL,
    "panjang_jaringan" INTEGER NOT NULL,
    "long" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "petugas_survey" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "SurveyDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Konstruksi" (
    "id" SERIAL NOT NULL,
    "nama_konstruksi" TEXT NOT NULL,
    "nomor_konstruksi" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Konstruksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KonstruksiMaterial" (
    "id" SERIAL NOT NULL,
    "id_material" INTEGER NOT NULL,
    "id_konstruksi" INTEGER NOT NULL,
    "kategori_material" "KategoriMaterial" NOT NULL,
    "kuantitas" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "KonstruksiMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logging" (
    "id" SERIAL NOT NULL,
    "tipe_log" "LogType" NOT NULL,
    "id_material" INTEGER NOT NULL,
    "id_tipe_material" INTEGER NOT NULL,
    "nama_material" TEXT NOT NULL,
    "satuan_material" TEXT NOT NULL,
    "berat_material" DECIMAL(65,30) NOT NULL,
    "harga_material" INTEGER NOT NULL,
    "pasang_rab" INTEGER NOT NULL,
    "bongkar" INTEGER NOT NULL,
    "jenis_material" TEXT NOT NULL,
    "kategori_material" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Logging_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_id_tipe_material_fkey" FOREIGN KEY ("id_tipe_material") REFERENCES "TipeMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetail" ADD CONSTRAINT "SurveyDetail_id_material_tiang_fkey" FOREIGN KEY ("id_material_tiang") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetail" ADD CONSTRAINT "SurveyDetail_id_material_konduktor_fkey" FOREIGN KEY ("id_material_konduktor") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetail" ADD CONSTRAINT "SurveyDetail_id_konstruksi_fkey" FOREIGN KEY ("id_konstruksi") REFERENCES "Konstruksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetail" ADD CONSTRAINT "SurveyDetail_id_header_fkey" FOREIGN KEY ("id_header") REFERENCES "SurveyHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KonstruksiMaterial" ADD CONSTRAINT "KonstruksiMaterial_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KonstruksiMaterial" ADD CONSTRAINT "KonstruksiMaterial_id_konstruksi_fkey" FOREIGN KEY ("id_konstruksi") REFERENCES "Konstruksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logging" ADD CONSTRAINT "Logging_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logging" ADD CONSTRAINT "Logging_id_tipe_material_fkey" FOREIGN KEY ("id_tipe_material") REFERENCES "TipeMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

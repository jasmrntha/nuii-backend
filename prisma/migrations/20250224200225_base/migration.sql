-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('Disetujui', 'Belum_Disetujui');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('Create', 'Update', 'Delete');

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
    "satuan_material" TEXT,
    "berat_material" DECIMAL(65,30),
    "harga_material" INTEGER,
    "pasang_rab" INTEGER,
    "bongkar" INTEGER,
    "jenis_material" TEXT,
    "kategori_material" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyHeader" (
    "id" SERIAL NOT NULL,
    "nama_survey" TEXT NOT NULL,
    "nama_pekerjaan" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "status_survey" "SurveyStatus" NOT NULL,
    "id_material_konduktor" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyDetail" (
    "id" SERIAL NOT NULL,
    "id_material_tiang" INTEGER NOT NULL,
    "id_konstruksi" INTEGER NOT NULL,
    "id_header" INTEGER NOT NULL,
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
    "id_tipe_pekerjaan" INTEGER,
    "kuantitas" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "KonstruksiMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipePekerjaan" (
    "id" SERIAL NOT NULL,
    "tipe_pekerjaan" TEXT NOT NULL,

    CONSTRAINT "TipePekerjaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logging" (
    "id" SERIAL NOT NULL,
    "tipe_log" "LogType" NOT NULL,
    "id_material" INTEGER NOT NULL,
    "id_tipe_material" INTEGER NOT NULL,
    "nama_material" TEXT NOT NULL,
    "satuan_material" TEXT,
    "berat_material" DECIMAL(65,30),
    "harga_material" INTEGER,
    "pasang_rab" INTEGER,
    "bongkar" INTEGER,
    "jenis_material" TEXT,
    "kategori_material" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Logging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoleSupporter" (
    "id" SERIAL NOT NULL,
    "nama_pole" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PoleSupporter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoleMaterial" (
    "id" SERIAL NOT NULL,
    "id_material" INTEGER NOT NULL,
    "id_pole_supporter" INTEGER NOT NULL,
    "kuantitas" DECIMAL(65,30),
    "id_tipe_pekerjaan" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PoleMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroundingTermination" (
    "id" SERIAL NOT NULL,
    "nama_grounding" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "GroundingTermination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroundingMaterial" (
    "id" SERIAL NOT NULL,
    "id_material" INTEGER NOT NULL,
    "id_grounding_termination" INTEGER NOT NULL,
    "kuantitas" DECIMAL(65,30),
    "id_tipe_pekerjaan" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "GroundingMaterial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_id_tipe_material_fkey" FOREIGN KEY ("id_tipe_material") REFERENCES "TipeMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyHeader" ADD CONSTRAINT "SurveyHeader_id_material_konduktor_fkey" FOREIGN KEY ("id_material_konduktor") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetail" ADD CONSTRAINT "SurveyDetail_id_material_tiang_fkey" FOREIGN KEY ("id_material_tiang") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetail" ADD CONSTRAINT "SurveyDetail_id_konstruksi_fkey" FOREIGN KEY ("id_konstruksi") REFERENCES "Konstruksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetail" ADD CONSTRAINT "SurveyDetail_id_header_fkey" FOREIGN KEY ("id_header") REFERENCES "SurveyHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KonstruksiMaterial" ADD CONSTRAINT "KonstruksiMaterial_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KonstruksiMaterial" ADD CONSTRAINT "KonstruksiMaterial_id_konstruksi_fkey" FOREIGN KEY ("id_konstruksi") REFERENCES "Konstruksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KonstruksiMaterial" ADD CONSTRAINT "KonstruksiMaterial_id_tipe_pekerjaan_fkey" FOREIGN KEY ("id_tipe_pekerjaan") REFERENCES "TipePekerjaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logging" ADD CONSTRAINT "Logging_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logging" ADD CONSTRAINT "Logging_id_tipe_material_fkey" FOREIGN KEY ("id_tipe_material") REFERENCES "TipeMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoleMaterial" ADD CONSTRAINT "PoleMaterial_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoleMaterial" ADD CONSTRAINT "PoleMaterial_id_pole_supporter_fkey" FOREIGN KEY ("id_pole_supporter") REFERENCES "PoleSupporter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoleMaterial" ADD CONSTRAINT "PoleMaterial_id_tipe_pekerjaan_fkey" FOREIGN KEY ("id_tipe_pekerjaan") REFERENCES "TipePekerjaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroundingMaterial" ADD CONSTRAINT "GroundingMaterial_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroundingMaterial" ADD CONSTRAINT "GroundingMaterial_id_grounding_termination_fkey" FOREIGN KEY ("id_grounding_termination") REFERENCES "GroundingTermination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroundingMaterial" ADD CONSTRAINT "GroundingMaterial_id_tipe_pekerjaan_fkey" FOREIGN KEY ("id_tipe_pekerjaan") REFERENCES "TipePekerjaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

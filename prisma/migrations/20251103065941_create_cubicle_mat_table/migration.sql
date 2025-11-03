-- CreateTable
CREATE TABLE "CubicleMaterial" (
    "id" SERIAL NOT NULL,
    "id_material" INTEGER NOT NULL,
    "nama_material" TEXT NOT NULL,
    "kuantitas" DECIMAL(65,30),
    "tipe_survey" "SurveyType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CubicleMaterial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CubicleMaterial" ADD CONSTRAINT "CubicleMaterial_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "AppTmComponent" (
    "id" SERIAL NOT NULL,
    "id_apptm_survey" INTEGER NOT NULL,
    "id_material" INTEGER NOT NULL,
    "kuantitas" DECIMAL(65,30) NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "AppTmComponent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppTmComponent" ADD CONSTRAINT "AppTmComponent_id_apptm_survey_fkey" FOREIGN KEY ("id_apptm_survey") REFERENCES "CubicleSurvey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppTmComponent" ADD CONSTRAINT "AppTmComponent_id_material_fkey" FOREIGN KEY ("id_material") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

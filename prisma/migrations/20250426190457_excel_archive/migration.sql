-- CreateTable
CREATE TABLE "ExcelArchive" (
    "archive_id" SERIAL NOT NULL,
    "file_name" TEXT,
    "file_path" TEXT,
    "survey_header_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ExcelArchive_pkey" PRIMARY KEY ("archive_id")
);

-- AddForeignKey
ALTER TABLE "ExcelArchive" ADD CONSTRAINT "ExcelArchive_survey_header_id_fkey" FOREIGN KEY ("survey_header_id") REFERENCES "SurveyHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "SurveyDetail" ADD COLUMN     "id_grounding_termination" INTEGER,
ADD COLUMN     "id_pole_supporter" INTEGER;

-- AddForeignKey
ALTER TABLE "SurveyDetail" ADD CONSTRAINT "SurveyDetail_id_pole_supporter_fkey" FOREIGN KEY ("id_pole_supporter") REFERENCES "PoleSupporter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyDetail" ADD CONSTRAINT "SurveyDetail_id_grounding_termination_fkey" FOREIGN KEY ("id_grounding_termination") REFERENCES "GroundingTermination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

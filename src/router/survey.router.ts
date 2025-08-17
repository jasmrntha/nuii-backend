/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { SurveyController } from '../controllers';
import { validate } from '../middleware';
import {
  CreateSurveyHeaderSchema,
  // CreateSurveySchema,
  // CreateNewSurveySchema,
  // UpdateSurveyHeaderSchema,
  // UpdateSurveyDetailSchema,
  // CreateBatchSurveySchema,
} from '../validators';

const router = express.Router();

router.post(
  '/',
  validate(CreateSurveyHeaderSchema),
  SurveyController.createSurveyHeader,
);
router.get('/', SurveyController.getAllSurveys);
router.get('/:id', SurveyController.getSurveyDetails);
router.get('/reports', SurveyController.getAllReports);
// router.post(
//   '/create',
//   validate(CreateSurveySchema),
//   SurveyController.createSurvey,
// );
// router.post(
//   '/create-new',
//   validate(CreateNewSurveySchema),
//   SurveyController.createNewSurvey,
// );
// router.put(
//   '/update-header',
//   validate(UpdateSurveyHeaderSchema),
//   SurveyController.updateSurveyHeader,
// );
// router.put(
//   '/update-detail',
//   validate(UpdateSurveyDetailSchema),
//   SurveyController.updateSurveyDetail,
// );
// router.get('/export/:id', SurveyController.exportSurvey);
// router.delete('/detail/delete/:id', SurveyController.deleteSurveyDetail);
// router.delete('/delete/:id', SurveyController.deleteSurvey);
// router.get('/name-list', SurveyController.getSurveyNameList);
// router.get('/report/detail/:id', SurveyController.getReportDetail);
// router.get('/export/excel/:id', SurveyController.exportSurveyToExcel);
// router.post(
//   '/create-batch',
//   validate(CreateBatchSurveySchema),
//   SurveyController.createNewSurveyBatch,
// );

export default router;

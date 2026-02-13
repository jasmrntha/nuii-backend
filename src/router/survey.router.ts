/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { ExcelController, SurveyController } from '../controllers';
import { validate } from '../middleware';
import {
  CreateSurveyHeaderSchema,
  // CreateSurveySchema,
  // CreateNewSurveySchema,
  UpdateSurveyHeaderSchema,
  // UpdateSurveyDetailSchema,
  CreateBatchSurveySchema,
} from '../validators';

const router = express.Router();

router.post(
  '/',
  validate(CreateSurveyHeaderSchema),
  SurveyController.createSurveyHeader,
);
router.get('/', SurveyController.getAllSurveys);
router.get('/reports', SurveyController.getAllReports);
// Route for Excel Export
router.get('/export/excel/:id', ExcelController.exportSurveyToExcel);

// Placeholder for JSON Export (Detail View) - preventing fallthrough to /:id
router.get('/export/:id', (req, res) => {
  res.status(501).json({
    message: 'JSON Report Detail view not implemented for new schema',
  });
});

router.get('/:id', SurveyController.getSurveyDetails);
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
router.put(
  '/update-header',
  validate(UpdateSurveyHeaderSchema),
  SurveyController.updateSurveyHeader,
);
// router.put(
//   '/update-detail',
//   validate(UpdateSurveyDetailSchema),
//   SurveyController.updateSurveyDetail,
// );
// router.get('/export/:id', SurveyController.exportSurvey);
// router.delete('/detail/delete/:id', SurveyController.deleteSurveyDetail);
router.delete('/:id', SurveyController.deleteSurvey);
// router.get('/name-list', SurveyController.getSurveyNameList);
// router.get('/report/detail/:id', SurveyController.getReportDetail);
// router.get('/export/excel/:id', SurveyController.exportSurveyToExcel);
router.post(
  '/create-batch',
  validate(CreateBatchSurveySchema),
  SurveyController.createNewSurveyBatch,
);

export default router;

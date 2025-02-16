/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { SurveyController } from '../controllers';

const router = express.Router();

router.post('/create', SurveyController.createSurvey);
router.post('/create-new', SurveyController.createNewSurvey);
router.put('/update-header', SurveyController.updateSurveyHeader);
router.put('/update-detail', SurveyController.updateSurveyDetail);
router.get('/export/:id', SurveyController.exportSurvey);
router.delete('/detail/delete/:id', SurveyController.deleteSurveyDetail);
router.delete('/delete/:id', SurveyController.deleteSurvey);
router.get('/name-list', SurveyController.getSurveyNameList);
router.get('/', SurveyController.getHeaderOnly);
router.get('/detail/:id', SurveyController.getSurveyDetail);

export default router;

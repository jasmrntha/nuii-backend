/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { SurveyController } from '../controllers';

const router = express.Router();

router.post('/create', SurveyController.createSurvey);
router.post('/create-new', SurveyController.createNewSurvey);

export default router;

/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { CubicleController } from '../controllers';

const router = express.Router();

router.get('/detail/:id', CubicleController.getAppTmById);
router.get('/:id', CubicleController.getApptmbySurvey);
export default router;

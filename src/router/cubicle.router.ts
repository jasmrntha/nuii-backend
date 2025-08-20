/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { CubicleController } from '../controllers';
import { validate } from '../middleware';
import { CreateCubicleSchema, UpdateCubicleSchema } from '../validators';

const router = express.Router();

router.post(
  '/create',
  validate(CreateCubicleSchema),
  CubicleController.createCubicle,
);
router.put(
  '/update/:id',
  validate(UpdateCubicleSchema),
  CubicleController.updateCubicle,
);
router.get('/detail/:id', CubicleController.getCubicleById);
router.get('/:id', CubicleController.getCubicleBySurveyId);
router.delete('/delete/:id', CubicleController.deleteCubicle);
export default router;

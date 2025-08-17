/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { SKTMController } from '../controllers';
import { validate } from '../middleware';
import { UpdateSKTMDetailSchema, CreateSKTMDetailSchema } from '../validators';

const router = express.Router();

router.post(
  '/details',
  validate(CreateSKTMDetailSchema),
  SKTMController.createDetail,
);
router.patch(
  '/',
  validate(UpdateSKTMDetailSchema),
  SKTMController.updateSurvey,
);
router.get('/', SKTMController.getAll);
router.get('/:id', SKTMController.getById);

export default router;

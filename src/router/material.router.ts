/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { MaterialController } from '../controllers';
import { validate } from '../middleware';
import { CreateMaterialSchema, UpdateMaterialSchema } from '../validators';

const router = express.Router();

router.post(
  '/create',
  validate(CreateMaterialSchema),
  MaterialController.createMaterial,
);
router.put(
  '/update/:id',
  validate(UpdateMaterialSchema),
  MaterialController.updateMaterial,
);
router.delete('/delete/:id', MaterialController.deleteMaterial);
router.get('/list/tiang', MaterialController.getTiang);
router.get('/list/konduktor', MaterialController.getKonduktor);
router.get('/list', MaterialController.getAllMaterial);
router.get('/survey', MaterialController.getSurveyMaterial);

export default router;

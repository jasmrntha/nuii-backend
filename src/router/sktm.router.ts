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

// --- Delete routes ---
// Delete whole survey
router.delete('/:id', SKTMController.deleteSurvey);

// Delete specific detail
router.delete('/:id/details/:detailId', SKTMController.deleteDetail);

// Delete specific component
router.delete('/:id/components/:componentId', SKTMController.deleteComponent);

// Delete specific joint
router.delete('/:id/joints/:jointId', SKTMController.deleteJoint);

export default router;

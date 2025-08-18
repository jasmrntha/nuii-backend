/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { SUTMController } from '../controllers';
import { validate } from '../middleware';
import { CreateSutmSchema } from '../validators';

const router = express.Router();

router.post('/create', validate(CreateSutmSchema), SUTMController.createSutm);
router.put('/header/update/:id', SUTMController.updateSutmHeader);
router.put('/detail/update/:id', SUTMController.updateSutmDetail);
router.delete('/detail/delete/:id', SUTMController.deleteSutmDetail);
router.delete('/header/delete/:id', SUTMController.deleteSutmHeader);
router.get('/detail/:id', SUTMController.getSutmById);
router.get('/header/:id', SUTMController.getSutmByHeader);
router.get('/', SUTMController.getAllSutm);

export default router;

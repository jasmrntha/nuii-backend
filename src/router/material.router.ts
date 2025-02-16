/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { MaterialController } from '../controllers';

const router = express.Router();

router.post('/create', MaterialController.createMaterial);
router.put('/update/:id', MaterialController.updateMaterial);
router.delete('/delete/:id', MaterialController.deleteMaterial);
router.get('/list/tiang', MaterialController.getTiang);
router.get('/list/konduktor', MaterialController.getKonduktor);

export default router;

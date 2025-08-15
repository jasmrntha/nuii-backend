/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { SKTMController } from '../controllers';

const router = express.Router();

router.post('/details', SKTMController.createDetail);
router.get('/', SKTMController.getAll);
router.get('/:id', SKTMController.getById);

export default router;

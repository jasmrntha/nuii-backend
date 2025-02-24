/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { PoleController } from '../controllers';

const router = express.Router();

router.get('/list', PoleController.getPole);

export default router;

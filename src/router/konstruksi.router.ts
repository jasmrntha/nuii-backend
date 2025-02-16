/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { KonstruksiController } from '../controllers';

const router = express.Router();

router.get('/list', KonstruksiController.getAllKonstruksi);

export default router;

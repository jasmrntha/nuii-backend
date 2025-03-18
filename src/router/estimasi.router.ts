/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { EstimasiController } from '../controllers';

const router = express.Router();

router.get('/get', EstimasiController.getEstimasi);

export default router;

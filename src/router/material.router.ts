/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { MaterialController } from '../controllers';

const router = express.Router();

router.get('/post', MaterialController.postMaterial);

export default router;

/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { StorageController } from '../controllers';

const router = express.Router();

router.get('/storage/file/:file_name', StorageController.getFile);

export default router;

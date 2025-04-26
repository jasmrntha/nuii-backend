/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { StorageController } from '../controllers';

const router = express.Router();

router.get('/file/:file_name', StorageController.getFile);
router.get('/image/:file_name', StorageController.getImage);
router.get('/excel/:file_name', StorageController.getExcel);

export default router;

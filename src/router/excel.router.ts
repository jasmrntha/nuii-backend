/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable import/no-default-export */
import express from 'express';

import { ExcelController } from '../controllers';
import { validate } from '../middleware';
import { UploadExcelSchema } from '../validators';

const router = express.Router();

router.post('/', validate(UploadExcelSchema), ExcelController.uploadExcel);

export default router;

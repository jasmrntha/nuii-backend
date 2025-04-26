import express from 'express';

import {
  UploadExcelFileController,
  UploadFileController,
} from '../controllers/upload-file.controller';
import {
  uploadExcelMiddleware,
  uploadFileMiddleware,
} from '../middleware/upload-file.middleware';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('', uploadFileMiddleware.single('file'), UploadFileController);
router.post(
  '/excel',
  uploadExcelMiddleware.single('file'),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  UploadExcelFileController,
);

// eslint-disable-next-line import/no-default-export
export default router;

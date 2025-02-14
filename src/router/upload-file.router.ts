import express from 'express';

import { UploadFileController } from '../controllers/upload-file.controller';
import { uploadFileMiddleware } from '../middleware/upload-file.middleware';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('', uploadFileMiddleware.single('file'), UploadFileController);

// eslint-disable-next-line import/no-default-export
export default router;

import express from 'express';

import { UploadImageController } from '../controllers/upload-image.controller';
import { uploadImageMiddleware } from '../middleware/upload-image.middleware';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('', uploadImageMiddleware.single('file'), UploadImageController);

// eslint-disable-next-line import/no-default-export
export default router;

import { requireAuth } from '@clerk/express';
import express from 'express';
const router = express.Router();

import SendFileRoutes from './send-file.router';
import SendImageRoutes from './send-image.router';
import UploadFileRoutes from './upload-file.router';
import UploadImageRoutes from './upload-image.router';

router.use(requireAuth({ authorizedParties: ['http://localhost:4000'] }));

router.use('/upload-file', UploadFileRoutes);
router.use('/upload-image', UploadImageRoutes);
router.use('/image', SendImageRoutes);
router.use('/file', SendFileRoutes);

router.get('/protected-health', (request, response) => {
  response.status(200).send('Server is up and running');
});

router.use('/upload-file', UploadFileRoutes);
router.use('/upload-image', UploadImageRoutes);

// eslint-disable-next-line import/no-default-export
export default router;

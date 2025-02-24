import { requireAuth } from '@clerk/express';
import express from 'express';
const router = express.Router();

import GroundingRoutes from './grounding.router';
import KonstruksiRoutes from './konstruksi.router';
import LogRoutes from './log.router';
import MaterialRoutes from './material.router';
import PoleRoutes from './pole.router';
import SendFileRoutes from './send-file.router';
import SendImageRoutes from './send-image.router';
import SurveyRoutes from './survey.router';
import UploadFileRoutes from './upload-file.router';
import UploadImageRoutes from './upload-image.router';

router.use(requireAuth());

router.use('/upload-file', UploadFileRoutes);
router.use('/upload-image', UploadImageRoutes);
router.use('/image', SendImageRoutes);
router.use('/file', SendFileRoutes);

router.use('/material', MaterialRoutes);
router.use('/survey', SurveyRoutes);
router.use('/konstruksi', KonstruksiRoutes);
router.use('/log', LogRoutes);
router.use('/pole', PoleRoutes);
router.use('/grounding', GroundingRoutes);

router.use('/upload-file', UploadFileRoutes);
router.use('/upload-image', UploadImageRoutes);

// eslint-disable-next-line import/no-default-export
export default router;

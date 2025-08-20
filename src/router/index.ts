import express from 'express';

const router = express.Router();

import { AuthMiddleware } from '../middleware';
import ApptmRoutes from './app-tm.router';
import CubicleRoutes from './cubicle.router';
import EstimasiRoutes from './estimasi.router';
import ExcelRoutes from './excel.router';
import GroundingRoutes from './grounding.router';
import KonstruksiRoutes from './konstruksi.router';
import LogRoutes from './log.router';
import MaterialRoutes from './material.router';
import PoleRoutes from './pole.router';
import SendStorageRoutes from './send-storage.router';
import SKTMRoutes from './sktm.router';
import SurveyRoutes from './survey.router';
import SUTMRoutes from './sutm.router';
import UploadFileRoutes from './upload-file.router';
import UploadImageRoutes from './upload-image.router';

router.use(AuthMiddleware);

router.use('/upload-file', UploadFileRoutes);
router.use('/upload-image', UploadImageRoutes);
router.use('/storage', SendStorageRoutes);

router.use('/material', MaterialRoutes);
router.use('/survey', SurveyRoutes);
router.use('/konstruksi', KonstruksiRoutes);
router.use('/log', LogRoutes);
router.use('/pole', PoleRoutes);
router.use('/grounding', GroundingRoutes);
router.use('/estimasi', EstimasiRoutes);
router.use('/excel-archive', ExcelRoutes);

router.use('/sktm', SKTMRoutes);
router.use('/sutm', SUTMRoutes);
router.use('/cubicle', CubicleRoutes);
router.use('/app-tm', ApptmRoutes);

router.use('/upload-file', UploadFileRoutes);
router.use('/upload-image', UploadImageRoutes);

// eslint-disable-next-line import/no-default-export
export default router;

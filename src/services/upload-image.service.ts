/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { type Request, type Response } from 'express';

import { filePath } from '../middleware/upload-image.middleware';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UploadImageService = async (
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  try {
    const file = request.file;

    const result = filePath(file);

    return result;
  } catch (error) {
    throw error;
  }
};

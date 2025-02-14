import path from 'node:path';

import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'storage/file/',
  filename: (request, file, callback) => {
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const uniq = Date.now();
    callback(null, `${uniq}${extension}`);
  },
});

export const uploadImageMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const filePath = (file: Express.Multer.File) => {
  const path = file.path;

  return {
    path_file: path,
  };
};

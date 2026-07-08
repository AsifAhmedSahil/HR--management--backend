import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { UploadConfig } from '../config';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UploadConfig.uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  if (UploadConfig.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
  }
};

export class UploadMiddleware {
  public static single(fieldName: string): multer.Multer {
    return multer({
      storage,
      fileFilter,
      limits: { fileSize: UploadConfig.maxFileSize },
    }).single(fieldName);
  }
}

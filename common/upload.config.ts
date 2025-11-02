// src/common/upload.ts
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, renameSync, unlinkSync } from 'fs';
import type { Express } from 'express';
import { BadRequestException, Catch, ExceptionFilter, ArgumentsHost, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';

// ===== Config =====
export const IMAGE_MAX_BYTES = +(process.env.UPLOAD_IMAGE_MAX_BYTES ?? 10 * 1024 * 1024); // 10MB
export const IMAGE_MIN_WIDTH = +(process.env.UPLOAD_IMAGE_MIN_W ?? 400);
export const IMAGE_MIN_HEIGHT = +(process.env.UPLOAD_IMAGE_MIN_H ?? 400);
export const UPLOADS_ROOT_ABS = join(process.cwd(), 'uploads');
export const IMAGES_DIR_ABS = join(UPLOADS_ROOT_ABS, 'images');
export const IMAGES_SERVE_ROOT = '/uploads/images';

// ===== FS helpers =====
function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}
function randomName(original: string) {
  const base = original.replace(/\.[^/.]+$/, '');
  const extension = extname(original);
  const rand = Array(16)
    .fill(null)
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
  return `${base}-${rand}${extension}`;
}
export function toWebPathImages(filename: string) {
  return `${IMAGES_SERVE_ROOT}/${filename}`;
}
export function toAbsPathImages(filename: string) {
  return join(IMAGES_DIR_ABS, filename);
}

// ===== Multer options (images) =====
export const imageUploadOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      ensureDir(IMAGES_DIR_ABS);
      cb(null, IMAGES_DIR_ABS);
    },
    filename: (_req, file, cb) => cb(null, randomName(file.originalname)),
  }),
  fileFilter: (_req: any, file: Express.Multer.File, cb: (err: any, ok?: boolean) => void) => {
    if (/^image\/(jpeg|png|jpg|gif|webp|svg\+xml)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error('Unsupported image type. Allowed: jpeg, jpg, png, gif, webp, svg+xml'));
  },
  limits: { fileSize: IMAGE_MAX_BYTES },
};

// ===== Optional: per-route validator (size + mime) =====
export function imageOptionalPipe(maxBytes = IMAGE_MAX_BYTES) {
  return new ParseFilePipe({
    validators: [new MaxFileSizeValidator({ maxSize: maxBytes, message: `File too large. Max ${(maxBytes / (1024 * 1024)).toFixed(0)}MB.` }), new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp|gif|jpg|svg\+xml)$/ })],
    fileIsRequired: false,
  });
}

// ===== Friendly Multer errors (English) =====
@Catch((err: any) => !!err?.code && String(err.code).startsWith('LIMIT'))
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    let message = exception.message || 'Upload error.';
    if (exception.code === 'LIMIT_FILE_SIZE') {
      message = `File too large. Max ${(IMAGE_MAX_BYTES / (1024 * 1024)).toFixed(0)}MB.`;
    } else if (exception.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field.';
    }

    res.status(400).json({ statusCode: 400, error: 'Bad Request', message });
  }
}

// ===== Optional: quality/optimization with Sharp (English) =====
// npm i sharp
export async function validateAndOptimizeImageIfPossible(absPath: string) {
  let sharp: typeof import('sharp') | undefined;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    return; // Sharp not installed — skip
  }

  try {
    const img = sharp(absPath);
    const meta = await img.metadata();

    if (!meta.width || !meta.height || meta.width < IMAGE_MIN_WIDTH || meta.height < IMAGE_MIN_HEIGHT) {
      try {
        unlinkSync(absPath);
      } catch {}
      throw new BadRequestException(`Image too small. Minimum ${IMAGE_MIN_WIDTH}x${IMAGE_MIN_HEIGHT}px.`);
    }

    // Optimize large images
    const optimized = absPath.replace(extname(absPath), '.webp');
    await img
      .rotate()
      .resize({ width: Math.min(meta.width, 1600), withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(optimized);

    renameSync(optimized, absPath);
  } catch (e) {
    if (e instanceof BadRequestException) throw e;
    try {
      unlinkSync(absPath);
    } catch {}
    throw new BadRequestException('Could not process the image. Please upload a valid image file.');
  }
}

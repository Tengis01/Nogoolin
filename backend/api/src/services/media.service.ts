import { randomUUID } from 'node:crypto';
import type { ProductImage } from '@nogoolin/validation-schemas';
import type {
  AuditLogRepository,
  FileStorage,
  ProductImageRepository,
  ProductRepository,
} from '../repositories/types.js';
import { badRequest, notFound } from '../lib/errors.js';

const BUCKET = 'product-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (FR-MEDIA-002)
const ALLOWED = new Map<string, string>([
  // extension → required MIME type (both checked server-side, NFR-SEC-011)
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
  ['png', 'image/png'],
  ['webp', 'image/webp'],
]);

export interface UploadFile {
  filename: string;
  mimetype: string;
  data: Buffer;
  /** set by the multipart parser when the 5MB stream limit truncated the file */
  truncated: boolean;
  altText: string | null;
}

export interface UploadResult {
  data: ProductImage[];
  rejected: Array<{ filename: string; reason: string }>;
}

function validateFile(file: UploadFile): string | null {
  const ext = file.filename.split('.').pop()?.toLowerCase() ?? '';
  const requiredMime = ALLOWED.get(ext);
  if (!requiredMime) return 'File type not allowed (jpg, jpeg, png, webp only)';
  if (file.mimetype !== requiredMime) {
    return `MIME type ${file.mimetype} does not match extension .${ext}`;
  }
  if (file.truncated || file.data.byteLength > MAX_FILE_SIZE) {
    return 'File exceeds 5MB limit';
  }
  if (file.data.byteLength === 0) return 'File is empty';
  return null;
}

/** unique, sanitized storage path (FR-MEDIA-009) */
function storagePath(productId: string, filename: string): string {
  const ext = filename.split('.').pop()!.toLowerCase();
  return `products/${productId}/${randomUUID()}.${ext}`;
}

/** derive the storage object path back from a stored public URL */
function pathFromUrl(imageUrl: string): string {
  const marker = `/object/public/${BUCKET}/`;
  const idx = imageUrl.indexOf(marker);
  return idx >= 0 ? imageUrl.slice(idx + marker.length) : imageUrl;
}

export function createMediaService(
  products: ProductRepository,
  images: ProductImageRepository,
  storage: FileStorage,
  auditLogs: AuditLogRepository,
) {
  return {
    // UC-ADM-005: invalid files rejected individually, valid files proceed;
    // 400 only when EVERY file is invalid; storage failure → 502 (already-
    // uploaded files keep their records — none is created for a failed file)
    async uploadImages(
      productId: string,
      files: UploadFile[],
      adminId: string,
    ): Promise<UploadResult> {
      const product = await products.findById(productId);
      if (!product) throw notFound('Product not found', 'PRODUCT_NOT_FOUND');
      if (files.length === 0) throw badRequest('No files provided', 'NO_FILES');

      const rejected: UploadResult['rejected'] = [];
      const valid: UploadFile[] = [];
      for (const file of files) {
        const reason = validateFile(file);
        if (reason) rejected.push({ filename: file.filename, reason });
        else valid.push(file);
      }
      if (valid.length === 0) {
        throw badRequest('All files failed validation', 'ALL_FILES_INVALID');
      }

      let sortOrder = await images.nextSortOrder(productId);
      const created: ProductImage[] = [];
      for (const file of valid) {
        const publicUrl = await storage.uploadPublic(
          BUCKET,
          storagePath(productId, file.filename),
          file.data,
          file.mimetype,
        ); // throws 502 ApiError on upstream failure
        const record = await images.insert({
          product_id: productId,
          image_url: publicUrl,
          alt_text: file.altText ?? file.filename, // NFR-SEO-009 default
          sort_order: sortOrder++,
        });
        created.push(record);
      }

      await auditLogs.log({
        admin_id: adminId,
        action: 'PRODUCT_IMAGES_UPLOAD',
        entity_type: 'product',
        entity_id: productId,
        metadata: { uploaded: created.length, rejected: rejected.length },
      });
      return { data: created, rejected };
    },

    // FR-MEDIA-005 — reorder / alt text
    async updateImage(
      productId: string,
      imageId: string,
      patch: { sort_order?: number; alt_text?: string },
      adminId: string,
    ): Promise<ProductImage> {
      const existing = await images.findById(productId, imageId);
      if (!existing) throw notFound('Image not found', 'IMAGE_NOT_FOUND');
      const updated = await images.update(imageId, patch);
      await auditLogs.log({
        admin_id: adminId,
        action: 'PRODUCT_IMAGE_UPDATE',
        entity_type: 'product_image',
        entity_id: imageId,
        metadata: { fields: Object.keys(patch) },
      });
      return updated;
    },

    // FR-MEDIA-006 — storage object first, then the DB record
    async deleteImage(productId: string, imageId: string, adminId: string): Promise<void> {
      const existing = await images.findById(productId, imageId);
      if (!existing) throw notFound('Image not found', 'IMAGE_NOT_FOUND');
      await storage.remove(BUCKET, pathFromUrl(existing.image_url));
      await images.delete(imageId);
      await auditLogs.log({
        admin_id: adminId,
        action: 'PRODUCT_IMAGE_DELETE',
        entity_type: 'product_image',
        entity_id: imageId,
        metadata: { product_id: productId },
      });
    },
  };
}

export type MediaService = ReturnType<typeof createMediaService>;

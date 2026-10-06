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

/** Multipart parser-аас service-д дамжуулах нэг зураг.
 * @example
 * ```ts
 * const file: UploadFile = {
 *   filename: "dari-ekh.webp",
 *   mimetype: "image/webp",
 *   data: imageBytes,
 *   truncated: false,
 *   altText: "Ногоон Дарь эх"
 * };
 * ```
 */
export interface UploadFile {
  /** Өргөтгөлтэй эх файлын нэр. */
  filename: string;
  /** Multipart parser-ийн MIME type. */
  mimetype: string;
  /** Файлын bytes; хоосон биш, ≤5 MiB. */
  data: Buffer;
  /** set by the multipart parser when the 5MB stream limit truncated the file */
  truncated: boolean;
  /** Зургийн тайлбар; null үед filename ашиглана. */
  altText: string | null;
}

/** Амжилттай хадгалсан зураг болон reject болсон файлууд.
 * @example
 * ```ts
 * const result: UploadResult = {
 *   data: [
 *   ],
 *   rejected: [
 *     {
 *       filename: "dari-ekh.txt",
 *       reason: "File type not allowed (jpg, jpeg, png, webp only)"
 *     }
 *   ]
 * };
 * ```
 */
export interface UploadResult {
  /** Хадгалсан зургийн metadata. */
  data: ProductImage[];
  /** Хадгалагдаагүй файлын нэр ба шалтгаан. */
  rejected: Array<{ filename: string; reason: string }>;
}

// @internal — зөвхөн энэ модулийн хэрэгжилт; caller шууд дуудахгүй.
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
// @internal — зөвхөн энэ модулийн хэрэгжилт; caller шууд дуудахгүй.
function storagePath(productId: string, filename: string): string {
  const ext = filename.split('.').pop()!.toLowerCase();
  return `products/${productId}/${randomUUID()}.${ext}`;
}

/** derive the storage object path back from a stored public URL */
// @internal — зөвхөн энэ модулийн хэрэгжилт; caller шууд дуудахгүй.
function pathFromUrl(imageUrl: string): string {
  const marker = `/object/public/${BUCKET}/`;
  const idx = imageUrl.indexOf(marker);
  return idx >= 0 ? imageUrl.slice(idx + marker.length) : imageUrl;
}

/**
 * Бүтээгдэхүүний зураг удирдах service үүсгэнэ.
 *
 * @param products - Бүтээгдэхүүний repository.
 * @param images - Зургийн metadata repository.
 * @param storage - Файл хадгалах port.
 * @param auditLogs - Admin үйлдлийн бүртгэл.
 * @returns uploadImages, updateImage, deleteImage method бүхий service.
 * @throws Factory өөрөө алдаа шидэхгүй.
 * @example
 * ```ts
 * const service = createMediaService(
 *   productRepository,
 *   imageRepository,
 *   fileStorage,
 *   auditLogRepository
 * );
 * ```
 */
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
    /**
     * Зөв файлуудыг хадгалж, буруу файлуудын шалтгааныг тусад нь буцаана.
     *
     * @param productId - Зураг нэмэх бүтээгдэхүүний UUID.
     * @param files - UploadFile жагсаалт; jpg/jpeg/png/webp, MIME таарах, хоосон биш, ≤5 MiB.
     * @param adminId - Admin хэрэглэгчийн UUID.
     * @returns Үүсгэсэн ProductImage data ба rejected файлын жагсаалт.
     * @throws PRODUCT_NOT_FOUND (404), NO_FILES/ALL_FILES_INVALID (400); storage/repository/audit алдаа дамжина. Өмнөх upload-ууд rollback хийгдэхгүй.
     * @example
     * ```ts
     * const result = await service.uploadImages(
     *   productId,
     *   [
     *     {
     *       filename: "dari-ekh.webp",
     *       mimetype: "image/webp",
     *       data: imageBytes,
     *       truncated: false,
     *       altText: "Ногоон Дарь эх"
     *     }
     *   ],
     *   adminId
     * );
     * ```
     */
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
    /**
     * Тухайн бүтээгдэхүүний зургийн эрэмбэ эсвэл alt text-ийг засна.
     *
     * @param productId - Бүтээгдэхүүний UUID.
     * @param imageId - Зургийн UUID.
     * @param patch - sort_order эсвэл alt_text-ийн шалгасан өөрчлөлт.
     * @param adminId - Admin хэрэглэгчийн UUID.
     * @returns Зассан ProductImage.
     * @throws IMAGE_NOT_FOUND (404); repository/audit алдаа дамжина.
     * @example
     * ```ts
     * const image = await service.updateImage(
     *   productId,
     *   imageId,
     *   {
     *     alt_text: "Ногоон Дарь эх"
     *   },
     *   adminId
     * );
     * ```
     */
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
    /**
     * Storage объектыг эхэлж, дараа нь зургийн metadata-г устгана.
     *
     * @param productId - Бүтээгдэхүүний UUID.
     * @param imageId - Зургийн UUID.
     * @param adminId - Admin хэрэглэгчийн UUID.
     * @returns Promise<void>.
     * @throws IMAGE_NOT_FOUND (404); storage/repository/audit алдаа дамжина, бүх алхам атомик биш.
     * @example
     * ```ts
     * await service.deleteImage(productId, imageId, adminId);
     * ```
     */
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

/** MediaService нь createMediaService-ийн method-уудын inferred contract.
 * @example
 * ```ts
 * type Service = MediaService;
 * ```
 */
export type MediaService = ReturnType<typeof createMediaService>;

import type { FastifyInstance } from 'fastify';
import {
  productImagePatchSchema,
  type ProductImagePatch,
} from '@nogoolin/validation-schemas';
import type { MediaService, UploadFile } from '../../services/media.service.js';
import { validateBody } from '../../hooks/validate.js';
import { badRequest } from '../../lib/errors.js';

const STREAM_LIMIT = 5 * 1024 * 1024; // hard stream cap = spec max (FR-MEDIA-002)

// Admin media routes (06-api-spec /admin/products/{id}/images*) — parent
// scope enforces requireAuth + requireAdmin. Multipart fields: files[] +
// optional alt_texts[] (same order as files).
export function registerAdminMediaRoutes(
  fastify: FastifyInstance,
  service: MediaService,
): void {
  // POST /admin/products/{id}/images → 201 { data, rejected } | 400 | 404 | 502
  fastify.post<{ Params: { id: string } }>(
    '/products/:id/images',
    async (request, reply) => {
      if (!request.isMultipart()) {
        throw badRequest('multipart/form-data required', 'VALIDATION_ERROR');
      }

      const files: UploadFile[] = [];
      const altTexts: string[] = [];
      for await (const part of request.parts()) {
        if (part.type === 'file') {
          let data: Buffer;
          let truncated = false;
          try {
            data = await part.toBuffer();
            truncated = part.file.truncated;
          } catch {
            // stream exceeded the 5MB limit — record as an oversized file
            data = Buffer.alloc(0);
            truncated = true;
          }
          files.push({
            filename: part.filename ?? 'unnamed',
            mimetype: part.mimetype,
            data,
            truncated,
            altText: null,
          });
        } else if (part.fieldname === 'alt_texts') {
          altTexts.push(String(part.value));
        }
      }
      files.forEach((file, i) => {
        file.altText = altTexts[i] ?? null;
      });

      const result = await service.uploadImages(
        request.params.id,
        files,
        request.user!.id,
      );
      return reply.code(201).send(result);
    },
  );

  // PATCH /admin/products/{id}/images/{imageId} → 200 | 404
  fastify.patch<{
    Params: { id: string; imageId: string };
    Body: ProductImagePatch;
  }>(
    '/products/:id/images/:imageId',
    { preHandler: validateBody(productImagePatchSchema) },
    async (request) => {
      const image = await service.updateImage(
        request.params.id,
        request.params.imageId,
        request.body,
        request.user!.id,
      );
      return { data: image };
    },
  );

  // DELETE /admin/products/{id}/images/{imageId} → 204 | 404
  fastify.delete<{ Params: { id: string; imageId: string } }>(
    '/products/:id/images/:imageId',
    async (request, reply) => {
      await service.deleteImage(
        request.params.id,
        request.params.imageId,
        request.user!.id,
      );
      return reply.code(204).send();
    },
  );
}

export { STREAM_LIMIT };

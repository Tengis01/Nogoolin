import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZodSchema } from 'zod';

// Server-side Zod validation preHandler (NFR-SEC-003) — docs/phase-0/08 §4.4.
// This is the security boundary: it runs unconditionally, regardless of
// any client-side validation. Schemas come from @nogoolin/validation-schemas.
export const validateBody =
  (schema: ZodSchema) => async (request: FastifyRequest, reply: FastifyReply) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      await reply.code(400).send({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: result.error.flatten(),
      });
      return reply;
    }
    request.body = result.data; // parsed/typed data downstream
  };

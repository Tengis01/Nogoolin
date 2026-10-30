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

// Path-param validation (audit H1): a malformed :id must be a 400 here,
// not a Postgres 22P02 that the repository turns into a 500.
export const validateParams =
  (schema: ZodSchema) => async (request: FastifyRequest, reply: FastifyReply) => {
    const result = schema.safeParse(request.params);
    if (!result.success) {
      await reply.code(400).send({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: result.error.flatten(),
      });
      return reply;
    }
    request.params = result.data;
  };

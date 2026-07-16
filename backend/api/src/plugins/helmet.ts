import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';

// Secure headers (NFR-SEC-007) — config per docs/08 §4.1
export default fp(async (fastify) => {
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'https://*.supabase.co', 'data:'],
        connectSrc: ["'self'", 'https://*.supabase.co'],
        mediaSrc: ["'self'", 'https://*.supabase.co'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  });
});

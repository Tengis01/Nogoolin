import { loadEnv } from './config/env.js';
import { buildApp } from './app.js';

async function main(): Promise<void> {
  const env = loadEnv(); // fails fast on missing config (never prints values)
  const app = await buildApp(env);

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void main();

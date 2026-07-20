# apps/web/Dockerfile — LOCAL DEV ONLY.
# Production web deploys to Vercel (docs/09-deployment.md §6), not Docker —
# this file exists solely so `docker compose up` can run the web app
# alongside the API for local testing. Single stage, dev server only.
# Build context is the monorepo ROOT (pnpm workspace resolution):
#   docker build -f apps/web/Dockerfile .

FROM node:20-alpine AS dev

RUN npm install -g pnpm@9

WORKDIR /app

# Manifests first so the install layer caches across source edits
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* tsconfig.base.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/validation-schemas/package.json ./packages/validation-schemas/
COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile

COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

EXPOSE 3000

CMD ["pnpm", "--filter", "@nogoolin/web", "dev"]

FROM node:18-alpine AS base


FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune visualizer --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm install --frozen-lockfile

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm run build --filter=visualizer


FROM base AS runner
WORKDIR /app

RUN yarn global add pm2
RUN yarn global add serve


# Don't run production as root
RUN addgroup --system --gid 1001 visualizer
RUN adduser --system --uid 1001 visualizer
USER visualizer
COPY --from=installer /app .
EXPOSE 3000
CMD pm2-runtime start "serve dist -s -p 3000"


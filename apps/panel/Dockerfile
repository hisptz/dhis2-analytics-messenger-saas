FROM --platform=linux/amd64 node:18-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune panel --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
RUN node -p "console.log(process.env)"

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm install --frozen-lockfile


# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

ARG NEXT_PUBLIC_PARSE_BASE_URL
ARG NEXT_PUBLIC_PARSE_APP_ID
ARG NEXT_PUBLIC_CONTEXT_PATH
ARG NEXT_PUBLIC_MESSAGING_URL
ARG NEXT_PUBLIC_MESSAGING_MOUNT_PATH

RUN touch ./apps/panel/.env.local
RUN echo NEXT_PUBLIC_PARSE_BASE_URL=$NEXT_PUBLIC_PARSE_BASE_URL >> ./apps/panel/.env.local
RUN echo NEXT_PUBLIC_PARSE_APP_ID=$NEXT_PUBLIC_PARSE_APP_ID >> ./apps/panel/.env.local
RUN echo NEXT_PUBLIC_CONTEXT_PATH=$NEXT_PUBLIC_CONTEXT_PATH >> ./apps/panel/.env.local
RUN echo NEXT_PUBLIC_MESSAGING_URL=$NEXT_PUBLIC_MESSAGING_URL >> ./apps/panel/.env.local
RUN echo NEXT_PUBLIC_MESSAGING_MOUNT_PATH=$NEXT_PUBLIC_MESSAGING_MOUNT_PATH >> ./apps/panel/.env.local


RUN cat ./apps/panel/.env.local

RUN pnpm run build --filter=panel...

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production


# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/panel/next.config.js .
COPY --from=installer /app/apps/panel/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/panel/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/panel/.next/static ./apps/panel/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/panel/public ./apps/panel/public

CMD node apps/panel/server.js

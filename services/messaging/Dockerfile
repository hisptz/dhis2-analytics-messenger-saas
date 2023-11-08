FROM --platform=linux/amd64 node:18-alpine AS base


FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune messaging --docker

# Add lockfile and package.json's of isolated subworkspace
FROM --platform=linux/amd64 base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN corepack enable
RUN pnpm install --frozen-lockfile --config.platform=linux --config.architecture=x64 --unsafe-perm

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm run build --filter=messaging

FROM node:18 AS runner
WORKDIR /app
# get chrome
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*
# Don't run production as root
COPY --from=installer /app .



CMD ["node", "services/messaging/app/server.js"]

FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else npm ci; fi

COPY tsconfig.json ./
COPY core ./core

RUN npx tsc

FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile --prod; \
    else npm ci --omit=dev; fi

COPY --from=builder /app/dist ./dist
COPY config.json ./
COPY rules ./rules

ENV PORT=4783

EXPOSE 4783

CMD ["node", "dist/index.js"]

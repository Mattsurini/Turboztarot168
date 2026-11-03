# ---- deps ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# NEXT_PUBLIC_* must be present at build time (client bundle); .env* is dockerignored
ARG NEXT_PUBLIC_ADMIN_USERNAME
ARG NEXT_PUBLIC_LINE_OA_ID
ARG NEXT_PUBLIC_LINE_OA_URL
ENV NEXT_PUBLIC_ADMIN_USERNAME=$NEXT_PUBLIC_ADMIN_USERNAME \
    NEXT_PUBLIC_LINE_OA_ID=$NEXT_PUBLIC_LINE_OA_ID \
    NEXT_PUBLIC_LINE_OA_URL=$NEXT_PUBLIC_LINE_OA_URL
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]

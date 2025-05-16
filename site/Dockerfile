# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build ứng dụng Next.js (output sẽ nằm trong .next)
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine

WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/next.config.ts ./

# Biến môi trường cho production
ENV NODE_ENV=production

EXPOSE 3000

# Khởi chạy server Next.js
CMD ["npm", "run", "start"]

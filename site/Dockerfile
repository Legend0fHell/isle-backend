# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files rst for better caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
RUN npm cache clean --force

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Remove src folder copy (không cần thiết cho production)
# COPY --from=builder /app/src ./src  # REMOVE THIS LINE

# Copy config files if needed
COPY --from=builder /app/next.config.* ./

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
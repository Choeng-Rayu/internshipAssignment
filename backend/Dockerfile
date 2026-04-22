# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy Prisma schema for migrations
COPY prisma ./prisma

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/src/main.js"]
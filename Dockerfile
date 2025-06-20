# Dockerfile for NestJS + TypeORM + PostgreSQL + Redis
# Multi-stage build for smaller image size

# ---- BUILD STAGE ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# ---- PRODUCTION STAGE ----
FROM node:20-alpine

WORKDIR /app

# Copy only the built files and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Expose port (default NestJS port)
EXPOSE 3000

# Set environment variables (override in docker-compose or at runtime)
ENV NODE_ENV=production

# Start the app
CMD ["node", "dist/main"]

# Development Dockerfile for Self-Storage Aggregator Platform
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY src/backend/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY src/backend/ .

# Generate Prisma Client
RUN npx prisma generate

# Expose application port
EXPOSE 3000

# Start application in development mode
CMD ["npm", "run", "start:dev"]

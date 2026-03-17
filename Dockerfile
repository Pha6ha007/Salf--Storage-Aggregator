FROM node:20-alpine

# Cache bust to force fresh build
ARG CACHE_BUST=1

WORKDIR /app

# Copy package files
COPY src/backend/package*.json ./

# Copy prisma schema so postinstall `prisma generate` can find it
# package.json declares: "prisma": { "schema": "src/prisma/schema.prisma" }
COPY src/backend/src/prisma/schema.prisma ./src/prisma/schema.prisma

# Install dependencies (triggers prisma generate via postinstall)
RUN npm install --production=false

# Copy remaining application code
COPY src/backend/ .

# Build NestJS app
RUN npm run build

EXPOSE 3000

# Run migrations then start
CMD ["npm", "run", "deploy"]

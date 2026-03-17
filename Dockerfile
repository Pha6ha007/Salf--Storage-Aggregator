FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY src/backend/package*.json ./

# Copy prisma schema BEFORE npm install so postinstall prisma generate works
COPY src/backend/prisma ./prisma

# Install dependencies (triggers prisma generate via postinstall)
RUN npm install --production=false

# Copy remaining application code
COPY src/backend/ .

# Build NestJS app
RUN npm run build

# Expose application port
EXPOSE 3000

# Run migrations then start
CMD ["npm", "run", "deploy"]

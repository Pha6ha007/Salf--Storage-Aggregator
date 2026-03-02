# Docker Setup Guide

Complete Docker configuration for StorageCompare.ae platform.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available for Docker
- At least 10GB free disk space

## 🚀 Quick Start

### 1. Setup Environment Variables

```bash
# Copy the example env file
cp .env.docker .env

# Edit .env and set required variables
# At minimum, change:
# - POSTGRES_PASSWORD
# - JWT_SECRET
```

### 2. Build and Start All Services

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 3. Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Health Check**: http://localhost:3001/api/v1/health
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🏗️ Architecture

The Docker setup includes 4 services:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Frontend (Next.js)                            │
│  Port: 3000                                    │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP
                 │
┌────────────────▼────────────────────────────────┐
│                                                 │
│  Backend (NestJS)                              │
│  Port: 3001                                    │
│                                                 │
└─────┬──────────────────────────┬────────────────┘
      │                          │
      │                          │
      ▼                          ▼
┌─────────────┐          ┌──────────────┐
│             │          │              │
│  PostgreSQL │          │    Redis     │
│  Port: 5432 │          │  Port: 6379  │
│             │          │              │
└─────────────┘          └──────────────┘
```

## 🛠️ Common Commands

### Container Management

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Stop and remove volumes (CAUTION: deletes data)
docker-compose down -v

# Restart specific service
docker-compose restart backend

# View running containers
docker-compose ps

# View resource usage
docker stats
```

### Logs & Debugging

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Database Operations

```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U storage -d storagecompare

# Run Prisma migrations
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma Client
docker-compose exec backend npx prisma generate

# Reset database (CAUTION: deletes all data)
docker-compose exec backend npx prisma migrate reset

# Seed database with test data
docker-compose exec backend npm run seed
```

### Redis Operations

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# View Redis info
docker-compose exec redis redis-cli INFO

# Clear all Redis data
docker-compose exec redis redis-cli FLUSHALL
```

### Build & Update

```bash
# Rebuild containers after code changes
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild without cache
docker-compose build --no-cache

# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

## 🔧 Development Mode

For active development with hot-reload:

```bash
# Use docker-compose.dev.yml (if available)
docker-compose -f docker-compose.dev.yml up

# Or use volumes for live code sync
docker-compose up -d
docker-compose exec backend npm run start:dev
```

## 🐛 Troubleshooting

### Container won't start

```bash
# Check container logs
docker-compose logs backend

# Check container status
docker-compose ps

# Inspect container
docker inspect storagecompare-backend
```

### Port already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env file
FRONTEND_PORT=3001
```

### Database connection errors

```bash
# Check if postgres is healthy
docker-compose ps postgres

# Verify database exists
docker-compose exec postgres psql -U storage -l

# Check connection from backend
docker-compose exec backend node -e "require('./dist/main')"
```

### Out of disk space

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything (CAUTION)
docker system prune -a --volumes
```

### Reset everything

```bash
# Stop and remove all containers, volumes, networks
docker-compose down -v

# Remove all images
docker-compose rm -f

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

## 📦 Production Deployment

### 1. Update Environment Variables

```bash
# Generate secure secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For POSTGRES_PASSWORD

# Update .env with production values
NODE_ENV=production
POSTGRES_PASSWORD=<strong-password>
JWT_SECRET=<generated-secret>
```

### 2. Configure External Services

Add API keys for production services:
- Google Maps API
- AWS S3
- SendGrid
- Twilio
- Anthropic Claude

### 3. Deploy

```bash
# Build production images
docker-compose build

# Start in production mode
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Check health
curl http://localhost:3001/api/v1/health
```

### 4. Monitoring

```bash
# View container health
docker-compose ps

# Monitor logs
docker-compose logs -f --tail=100

# Check resource usage
docker stats
```

## 🔐 Security Notes

1. **Never commit `.env` file** with real credentials
2. Use **strong passwords** for production
3. Generate **unique JWT secrets**: `openssl rand -base64 32`
4. **Rotate secrets** regularly
5. Use **environment variables** for sensitive data
6. Enable **SSL/TLS** in production
7. Configure **firewall rules** to restrict access
8. Regular **security updates**: `docker-compose pull`

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🆘 Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Review this documentation
3. Check GitHub Issues
4. Contact development team

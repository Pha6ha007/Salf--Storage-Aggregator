# StorageCompare.ae - Self-Storage Aggregator Platform

> UAE's leading storage comparison and booking platform

[![Backend CI](https://github.com/Pha6ha007/Salf--Storage-Aggregator/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Pha6ha007/Salf--Storage-Aggregator/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/Pha6ha007/Salf--Storage-Aggregator/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Pha6ha007/Salf--Storage-Aggregator/actions/workflows/frontend-ci.yml)
[![Docker Build](https://github.com/Pha6ha007/Salf--Storage-Aggregator/actions/workflows/docker-build.yml/badge.svg)](https://github.com/Pha6ha007/Salf--Storage-Aggregator/actions/workflows/docker-build.yml)
[![Deploy Staging](https://github.com/Pha6ha007/Salf--Storage-Aggregator/actions/workflows/deploy-staging.yml/badge.svg)](https://github.com/Pha6ha007/Salf--Storage-Aggregator/actions/workflows/deploy-staging.yml)

## 📋 Overview

StorageCompare.ae is a comprehensive self-storage aggregator platform connecting users seeking storage solutions with warehouse operators across the UAE. Built with modern web technologies and AI-powered features.

## 🚀 Features

### For Users
- **Smart Search** - Find storage by location, size, and price
- **Interactive Map** - View warehouses on Google Maps
- **AI Box Finder** - Get size recommendations based on your items
- **Real-time Availability** - See current availability and pricing
- **Easy Booking** - Simple booking flow with instant confirmation
- **Reviews & Ratings** - Read verified customer reviews
- **WhatsApp Support** - AI-powered WhatsApp assistant
- **Live Web Chat** - Get help instantly with AI chat widget

### For Operators
- **Dashboard** - Manage warehouses and bookings
- **Inventory Management** - Track boxes and availability
- **CRM System** - Manage leads and contacts
- **Analytics** - View performance metrics
- **Automated Notifications** - Email, SMS, WhatsApp alerts
- **Media Management** - Upload and manage warehouse photos

### For Admins
- **Monitoring Dashboard** - System health and metrics
- **User Management** - Manage users and operators
- **Content Moderation** - Review and approve warehouses
- **Activity Logs** - Complete audit trail

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10
- **Runtime**: Node.js 20 LTS
- **Database**: PostgreSQL 15 + PostGIS + pgvector
- **Cache**: Redis 7
- **ORM**: Prisma 5
- **Auth**: Cookie-based JWT (httpOnly)
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3
- **State Management**: React Query + Zustand
- **Maps**: Google Maps API
- **UI Components**: Custom design system with glassmorphism

### AI & External Services
- **AI**: Anthropic Claude API
- **File Storage**: AWS S3 (me-south-1)
- **Email**: SendGrid
- **SMS/WhatsApp**: Twilio
- **Payments**: Paddle

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: AWS (Bahrain region)
- **CDN**: Cloudflare

## 📦 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone git@github.com:Pha6ha007/Salf--Storage-Aggregator.git
   cd Salf--Storage-Aggregator
   ```

2. **Setup Backend**
   ```bash
   cd src/backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   npm run start:dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api/v1
   - API Docs: http://localhost:3001/api/v1/docs

### Docker Development

1. **Copy environment file**
   ```bash
   cp .env.docker .env
   # Edit .env with your configuration
   ```

2. **Start all services**
   ```bash
   docker compose up -d
   ```

3. **Run migrations**
   ```bash
   docker compose exec backend npx prisma migrate deploy
   ```

4. **Seed database (optional)**
   ```bash
   docker compose exec backend npm run seed
   ```

See [DOCKER.md](DOCKER.md) for detailed Docker documentation.

## 📚 Documentation

- [Technical Architecture](docs/core/Technical_Architecture_Document_MVP_v1_CANONICAL.md)
- [Functional Specification](docs/core/Functional_Specification_MVP_v1_CORRECTED.md)
- [API Design Blueprint](docs/core/api_design_blueprint_mvp_v1_CANONICAL.md)
- [Database Specification](docs/core/full_database_specification_mvp_v1_CANONICAL.md)
- [Docker Setup Guide](DOCKER.md)
- [CI/CD Documentation](CI-CD.md)
- [Design System](DESIGN_SYSTEM.md)

## 🧪 Testing

### Backend Tests
```bash
cd src/backend
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test              # Unit tests
npm run test:watch        # Watch mode
```

## 🚢 Deployment

### Using Docker Compose (Recommended)

1. **Update environment variables** in `.env`
2. **Build images**: `docker compose build`
3. **Start services**: `docker compose up -d`
4. **Run migrations**: `docker compose exec backend npx prisma migrate deploy`
5. **Check health**: `curl http://localhost:3001/api/v1/health`

### Using GitHub Actions

The project includes automated CI/CD pipelines:

- **Backend CI**: Runs on push/PR to backend code
- **Frontend CI**: Runs on push/PR to frontend code
- **Docker Build**: Builds and publishes Docker images
- **Deploy Staging**: Auto-deploys to staging on `develop` branch
- **Deploy Production**: Manual deployment via workflow dispatch

See [CI-CD.md](CI-CD.md) for setup instructions.

## 🔐 Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/storagecompare
POSTGRES_PASSWORD=your-strong-password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-32-char-secret-min

# Google Maps
GOOGLE_MAPS_API_KEY=your-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key

# AWS S3
AWS_REGION=me-south-1
AWS_S3_BUCKET=your-bucket
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

See `.env.docker` for complete list of environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For issues or questions:
1. Check the [documentation](docs/)
2. Review [Docker setup guide](DOCKER.md)
3. Check [GitHub Issues](https://github.com/Pha6ha007/Salf--Storage-Aggregator/issues)
4. Contact the development team

## 📊 Project Status

**Current Phase**: MVP v1 - Production Ready

- ✅ Core Backend API
- ✅ Frontend UI (Desktop & Mobile)
- ✅ Authentication & Authorization
- ✅ Booking System
- ✅ CRM Module
- ✅ AI Box Finder
- ✅ WhatsApp AI Bot
- ✅ Web Chat Widget
- ✅ Event Bus & Activity Logging
- ✅ RAG Infrastructure (prepared)
- ✅ Docker Containerization
- ✅ CI/CD Pipeline

**Next Steps**: Testing Suite, Production Deployment, Monitoring

---

Made with ❤️ for the UAE storage industry

# Self-Storage Aggregator Platform - Backend API

Backend API for storagecompare.ae - UAE's premier self-storage aggregator platform.

## Tech Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS 10
- **Database**: PostgreSQL 15 + PostGIS + pgvector
- **ORM**: Prisma 5
- **Cache**: Redis 7
- **Auth**: Cookie-based JWT (httpOnly)

## Prerequisites

- Node.js 20 LTS or higher
- Docker & Docker Compose
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Infrastructure (PostgreSQL + Redis)

```bash
# From project root
cd ../..
docker-compose up -d postgres redis
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start Development Server

```bash
npm run start:dev
```

The API will be available at:
- **API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api/v1/docs

## Project Structure

```
src/
├── common/              # Shared utilities (guards, decorators, filters)
├── config/              # Configuration files
├── modules/             # Feature modules (auth, users, warehouses, etc.)
├── prisma/              # Prisma schema & migrations
└── shared/              # Shared services (Google Maps, S3, Redis)
```

## Available Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start server in debug mode
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Database Commands

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (DB GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Development Workflow

1. Read the canonical specs in `/docs/core/`
2. Follow the build order in `CLAUDE.md`
3. Create feature branches from `main`
4. Commit after each completed module
5. Test thoroughly before moving to next module

## MVP v1 Build Phases

- **Phase 1**: Foundation (NestJS + Prisma + Docker) ✅
- **Phase 2**: Core CRUD (Users, Warehouses, Boxes)
- **Phase 3**: Booking Flow
- **Phase 4**: CRM + AI
- **Phase 5**: Supporting Features
- **Phase 6**: Frontend

## Documentation

- **Functional Spec**: `/docs/core/Functional_Specification_MVP_v1_CORRECTED.md`
- **Architecture**: `/docs/core/Technical_Architecture_Document_MVP_v1_CANONICAL.md`
- **API Design**: `/docs/core/api_design_blueprint_mvp_v1_CANONICAL.md`
- **Database**: `/docs/core/full_database_specification_mvp_v1_CANONICAL.md`

## License

Proprietary - All rights reserved

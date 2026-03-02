# CI/CD Pipeline Documentation

Complete guide for setting up and using GitHub Actions CI/CD pipelines for StorageCompare.ae.

## 📋 Overview

The project includes 4 automated GitHub Actions workflows:

1. **Backend CI** - Tests and builds backend on push/PR
2. **Frontend CI** - Tests and builds frontend on push/PR
3. **Docker Build & Publish** - Builds and publishes Docker images
4. **Deploy Staging** - Deploys to staging/production environments

## 🔧 Prerequisites

- GitHub repository
- GitHub Actions enabled
- Docker Hub or GitHub Container Registry account
- Staging/Production servers with Docker installed
- SSH access to deployment servers

## 🚀 Setup Instructions

### 1. Enable GitHub Actions

GitHub Actions should be enabled by default. Verify at:
```
Settings → Actions → General → Actions permissions
```

### 2. Configure GitHub Secrets

Go to `Settings → Secrets and variables → Actions → New repository secret`

#### Required Secrets for All Workflows

```bash
# JWT Authentication
JWT_SECRET=your-32-character-minimum-secret-key

# Database
POSTGRES_DB=storagecompare
POSTGRES_USER=storage
POSTGRES_PASSWORD=strong-password-here

# API URLs (for frontend build)
NEXT_PUBLIC_API_URL=https://api.storagecompare.ae/api/v1
NEXT_PUBLIC_APP_URL=https://storagecompare.ae

# CORS
CORS_ORIGIN=https://storagecompare.ae
```

#### Required Secrets for External Services

```bash
# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# AWS S3
AWS_REGION=me-south-1
AWS_S3_BUCKET=storagecompare-media
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# SendGrid (Email)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM=noreply@storagecompare.ae

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+971xxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+971xxxxxxxxx

# Anthropic (AI)
ANTHROPIC_API_KEY=your-anthropic-api-key
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# Paddle (Payments)
PADDLE_API_KEY=your-paddle-api-key
PADDLE_WEBHOOK_SECRET=your-paddle-webhook-secret
PADDLE_ENVIRONMENT=production
PADDLE_SELLER_ID=your-seller-id
```

#### Required Secrets for Deployment

```bash
# SSH Access
SSH_PRIVATE_KEY=your-ssh-private-key

# Staging Environment
STAGING_HOST=staging.storagecompare.ae
STAGING_USER=deploy
STAGING_DEPLOY_PATH=/var/www/storagecompare-staging

# Production Environment
PRODUCTION_HOST=storagecompare.ae
PRODUCTION_USER=deploy
PRODUCTION_DEPLOY_PATH=/var/www/storagecompare-production
```

### 3. Generate SSH Keys for Deployment

```bash
# Generate new SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Copy public key to deployment servers
ssh-copy-id -i ~/.ssh/github_deploy.pub deploy@staging.storagecompare.ae
ssh-copy-id -i ~/.ssh/github_deploy.pub deploy@storagecompare.ae

# Add private key to GitHub Secrets
cat ~/.ssh/github_deploy
# Copy the entire output and add as SSH_PRIVATE_KEY secret
```

### 4. Prepare Deployment Servers

On each deployment server (staging and production):

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Create deployment directory
sudo mkdir -p /var/www/storagecompare-staging
sudo chown $USER:$USER /var/www/storagecompare-staging

# Install required packages
sudo apt update
sudo apt install -y git curl
```

## 📝 Workflow Details

### Backend CI Workflow

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Only when backend files change

**Jobs:**
1. **Lint and Build**
   - Installs dependencies
   - Generates Prisma Client
   - Runs ESLint
   - Checks TypeScript
   - Builds application
   - Uploads build artifacts

2. **Test**
   - Starts PostgreSQL + PostGIS + pgvector
   - Starts Redis
   - Runs database migrations
   - Runs unit tests
   - Runs E2E tests

3. **Security**
   - Runs npm audit
   - Checks for vulnerabilities

**Configuration:**
- Runs on Ubuntu latest
- Node.js 20.x
- PostgreSQL 15 with PostGIS
- Redis 7

### Frontend CI Workflow

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Only when frontend files change

**Jobs:**
1. **Lint and Build**
   - Installs dependencies
   - Runs ESLint
   - Checks TypeScript
   - Builds Next.js application
   - Uploads build artifacts

2. **Test**
   - Runs unit tests

3. **Security**
   - Runs npm audit
   - Checks for vulnerabilities

4. **Accessibility**
   - Starts Next.js server
   - Runs Lighthouse CI
   - Checks accessibility, performance, SEO

**Configuration:**
- Runs on Ubuntu latest
- Node.js 20.x

### Docker Build & Publish Workflow

**Triggers:**
- Push to `main` or `develop` branches
- Push of version tags (`v*`)
- Pull requests to `main`

**Jobs:**
1. **Build Backend Image**
   - Builds multi-platform Docker image (amd64, arm64)
   - Pushes to GitHub Container Registry
   - Tags: `latest`, `main`, `develop`, `v1.0.0`, `sha-abc123`

2. **Build Frontend Image**
   - Builds multi-platform Docker image (amd64, arm64)
   - Pushes to GitHub Container Registry
   - Tags: same as backend

3. **Test Docker Compose** (PR only)
   - Starts all services
   - Waits for health checks
   - Tests backend and frontend endpoints
   - Shows logs on failure

**Image Names:**
- Backend: `ghcr.io/OWNER/storagecompare-backend`
- Frontend: `ghcr.io/OWNER/storagecompare-frontend`

### Deploy Staging Workflow

**Triggers:**
- Push to `develop` branch (auto-deploy to staging)
- Manual workflow dispatch (can choose staging or production)

**Jobs:**
1. **Deploy**
   - Connects to server via SSH
   - Copies docker-compose.yml
   - Creates .env file with secrets
   - Pulls latest Docker images
   - Stops existing containers
   - Starts new containers
   - Runs database migrations
   - Checks deployment health
   - Cleans up old images

2. **Notify**
   - Sends deployment status notification

**Deployment Process:**
1. SSH to server
2. Pull latest images from registry
3. Stop old containers
4. Start new containers
5. Run migrations
6. Health check
7. Cleanup

## 🔄 CI/CD Flow

### Development Flow

```
1. Developer pushes to feature branch
   ↓
2. Create Pull Request to develop
   ↓
3. Backend CI runs (if backend changed)
   Frontend CI runs (if frontend changed)
   Docker Build runs (builds but doesn't push)
   ↓
4. Review and merge PR
   ↓
5. Merge to develop triggers:
   - Backend CI ✓
   - Frontend CI ✓
   - Docker Build & Publish ✓
   - Deploy to Staging ✓
   ↓
6. Staging deployed and ready for testing
```

### Production Release Flow

```
1. Merge develop → main
   ↓
2. Create version tag: git tag v1.0.0 && git push --tags
   ↓
3. Triggers:
   - Backend CI ✓
   - Frontend CI ✓
   - Docker Build & Publish (with version tag) ✓
   ↓
4. Manual: Go to Actions → Deploy Staging
   - Select "production" environment
   - Click "Run workflow"
   ↓
5. Production deployed
```

## 🎯 Best Practices

### Branch Strategy

```
main          Production-ready code
  ├─ develop  Integration branch
      ├─ feature/xyz
      ├─ bugfix/abc
      └─ hotfix/def
```

### Commit Messages

Follow conventional commits:
```bash
feat: Add WhatsApp AI bot
fix: Resolve booking confirmation bug
docs: Update CI/CD documentation
chore: Update dependencies
```

### Versioning

Use semantic versioning:
```bash
v1.0.0 - Major release
v1.1.0 - Minor release (new features)
v1.1.1 - Patch release (bug fixes)
```

Create tags:
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Environment Strategy

- **Development**: Local development with `npm run dev`
- **Staging**: Automated deploys from `develop` branch
- **Production**: Manual deploys from `main` branch with approval

## 🐛 Troubleshooting

### Workflow Fails with "Cannot find module"

**Solution**: Check that all dependencies are in `package.json` and `package-lock.json` is committed.

### Docker Build Fails with Permission Denied

**Solution**: Check file permissions in Dockerfile. Files should be owned by `nextjs:nodejs` or `nestjs:nodejs`.

### Deployment Fails with SSH Connection Error

**Solution**:
1. Verify SSH_PRIVATE_KEY secret is correct
2. Check that public key is in `~/.ssh/authorized_keys` on server
3. Verify STAGING_HOST/PRODUCTION_HOST is correct

### Database Migration Fails During Deployment

**Solution**:
1. Check DATABASE_URL is correct
2. Verify PostgreSQL is healthy
3. Check migration files are valid
4. Review logs: `docker compose logs backend`

### Health Check Fails After Deployment

**Solution**:
1. Check service logs: `docker compose logs`
2. Verify environment variables are set correctly
3. Check database connection
4. Verify Redis connection
5. Check if ports are available

### Docker Image Pull Fails

**Solution**:
1. Verify GITHUB_TOKEN has `read:packages` permission
2. Check image name is correct
3. Verify image was pushed successfully in Docker Build workflow

## 📊 Monitoring Workflows

### View Workflow Status

1. Go to `Actions` tab in GitHub
2. Select workflow from left sidebar
3. View run history and logs

### Status Badges

Add to README.md:
```markdown
[![Backend CI](https://github.com/OWNER/REPO/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/backend-ci.yml)
```

### Workflow Notifications

Configure in `Settings → Notifications → Actions`:
- Email on workflow failure
- GitHub notifications

## 🔒 Security Considerations

1. **Never commit secrets** to repository
2. **Rotate secrets regularly** (quarterly minimum)
3. **Use separate keys** for staging and production
4. **Limit SSH key access** to deployment user only
5. **Review workflow logs** for sensitive data before making public
6. **Use environment protection rules** for production
7. **Enable branch protection** on `main` branch
8. **Require reviews** before merging to production branches

## 📈 Performance Optimization

### Caching

Workflows use caching for:
- Node.js dependencies (`npm ci` with cache)
- Docker build layers (GitHub Actions cache)
- Build artifacts

### Parallel Jobs

Independent jobs run in parallel:
- Backend CI and Frontend CI run simultaneously
- Backend image and Frontend image build in parallel

### Build Time

Typical build times:
- Backend CI: ~5-8 minutes
- Frontend CI: ~4-6 minutes
- Docker Build: ~10-15 minutes (first build), ~3-5 minutes (cached)
- Deployment: ~3-5 minutes

## 🆘 Support

For CI/CD issues:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Check [GitHub Actions documentation](https://docs.github.com/en/actions)
4. Contact DevOps team

---

**Last Updated**: 2026-03-02
**Version**: 1.0.0

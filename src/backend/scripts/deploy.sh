#!/bin/bash
#===============================================
# Production Deployment Script for Railway
#===============================================
# This script runs migrations and starts the app
# Used by Railway during deployment
#===============================================

set -e # Exit on error

echo "🚀 Starting deployment..."

# Run database migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Check migration status
if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully"
else
  echo "❌ Migration failed"
  exit 1
fi

# Start the application
echo "🎯 Starting application..."
node dist/main.js

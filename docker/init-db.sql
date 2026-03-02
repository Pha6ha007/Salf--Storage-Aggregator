-- Initialize PostgreSQL with required extensions for StorageCompare.ae

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enable pgvector for RAG/embeddings (AI features)
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create a test user for development (optional)
-- Uncomment if needed for local development
-- CREATE USER storage_test WITH PASSWORD 'test_password';
-- GRANT ALL PRIVILEGES ON DATABASE storagecompare TO storage_test;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'StorageCompare Database initialized successfully!';
    RAISE NOTICE 'Extensions enabled: uuid-ossp, postgis, vector';
END $$;

-- Initialize required PostgreSQL extensions for Self-Storage Aggregator Platform
-- This script runs automatically when the PostgreSQL container is first created

-- UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PostGIS extension for geospatial data and queries
CREATE EXTENSION IF NOT EXISTS "postgis";

-- pgvector extension for RAG (Retrieval-Augmented Generation) embeddings
-- Used for AI-powered search and recommendations
CREATE EXTENSION IF NOT EXISTS "vector";

-- Verify extensions are installed
DO $$
BEGIN
    RAISE NOTICE 'Extensions installed successfully:';
    RAISE NOTICE '  - uuid-ossp: UUID generation';
    RAISE NOTICE '  - postgis: Geospatial data support';
    RAISE NOTICE '  - vector: Vector embeddings for AI/RAG';
END $$;

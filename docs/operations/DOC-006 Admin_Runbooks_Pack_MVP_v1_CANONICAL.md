# Admin Runbooks Pack (MVP v1)
## Self-Storage Aggregator Platform

**Document ID:** DOC-006  
**Version:** 2.0 (Canonical - Hardened)  
**Date:** December 17, 2025  
**Status:** Supporting / Reference  
**Maintained by:** Operations Team

---

## Document Role & Scope

### Purpose

This document provides **operational runbooks** for administering the Self-Storage Aggregator platform during MVP v1. It describes **HOW to perform common operational tasks**, not **WHAT the architecture is** or **WHY decisions were made**.

### What This Document IS

- ✅ **Supporting / Reference document** - Operational procedures for day-to-day administration
- ✅ **MVP v1 only** - Scoped to simple, early-stage operations
- ✅ **Manual-first operations** - Assumes manual intervention, not full automation
- ✅ **Small team operations** - Designed for 1-3 person ops team
- ✅ **Practical troubleshooting** - Real-world diagnostic and resolution steps

### What This Document IS NOT

- ❌ **NOT an architectural specification** - See Technical Architecture Document (DOC-002)
- ❌ **NOT a deployment strategy** - See Deployment Runbook (DOC-039)
- ❌ **NOT a monitoring specification** - See Monitoring & Observability Plan
- ❌ **NOT a logging specification** - See Logging Strategy (Canonical)
- ❌ **NOT production/enterprise-grade** - This is MVP with basic operations
- ❌ **NOT Kubernetes-dependent** - MVP uses docker-compose (Kubernetes optional, v2+)

### Scope Limitations

**MVP v1 Constraints:**
- **Single-region deployment** - No multi-region complexity
- **docker-compose runtime** - Kubernetes is v2+ (see Technical Architecture §10.7)
- **Manual operations** - Limited automation in MVP
- **Small scale** - < 5,000 MAU, < 50 RPS
- **Basic tooling** - Open-source observability stack

**What's NOT Covered:**
- Enterprise incident management (PagerDuty, OpsGenie, etc.)
- Advanced SRE practices (SLO engineering, error budgets, chaos engineering)
- Kubernetes-specific operations (deferred to v2+)
- Multi-region failover
- Advanced security operations (SOC, SIEM)

### Canonical Dependencies

This document **MUST** align with and **REFERENCE** (not duplicate):

**Primary References:**
- **DOC-002:** Technical Architecture Document (MVP v1 REVISED)
- **DOC-039:** Deployment & Rollback Runbook
- **DOC-XXX:** Monitoring & Observability Plan (Canonical)
- **DOC-XXX:** Logging Strategy (Canonical)
- **DOC-048:** Security & Compliance Plan

**Supporting References:**
- **DOC-052:** Infrastructure as Code Plan
- **DOC-031:** Configuration Management Strategy
- **DOC-XXX:** Error Handling & Fault Tolerance Specification

### Tool Considerations

**All tools mentioned in this document are EXAMPLES, not requirements:**

- Prometheus/Grafana → Example monitoring stack (could be alternatives)
- Loki → Example log aggregation (could be alternatives)
- Docker Compose → MVP deployment mechanism (per Technical Architecture)
- Kubernetes → **Optional post-MVP** (v2+), included only as comparison examples

The runbooks are designed to be **conceptually portable** - adapt commands to your actual tooling.

---

## Table of Contents

1. [Quick Start Guide](#1-quick-start-guide)
2. [General Operational Procedures](#2-general-operational-procedures)
3. [Backend API Operations](#3-backend-api-operations)
4. [Database Operations](#4-database-operations)
5. [Common Issues & Resolutions](#5-common-issues--resolutions)
6. [Health Checks & Diagnostics](#6-health-checks--diagnostics)
7. [Emergency Procedures](#7-emergency-procedures)
8. [Appendices](#appendices)

---

# 1. Quick Start Guide

## 1.1. For Whom This Guide Is Written

| Role | Usage | Access Level |
|------|-------|--------------|
| **Platform Administrator** | Primary user, daily operations | Full |
| **Backend Developer (on-call)** | Support during escalation | Execute + Read |
| **DevOps/Infrastructure** | Infrastructure issues | Full |

**Required Skills:**
- Linux command line (bash, docker, curl, psql)
- Basic SQL (SELECT, EXPLAIN, indexes)
- Docker & docker-compose
- JSON log reading
- HTTP/REST fundamentals

## 1.2. System Components (MVP v1)

Per **Technical Architecture Document (DOC-002 §1.2)**:

| Component | Technology | Priority |
|-----------|-----------|----------|
| **Backend API** | NestJS (Node 20 LTS) | P0 - Critical |
| **Database** | PostgreSQL 15 + PostGIS | P0 - Critical |
| **Cache** | Redis 7 | P1 - High |
| **Frontend** | Next.js 14 | P1 - High |
| **Automation** | n8n | P2 - Medium |

**Deployment Runtime:** Docker Compose (MVP) - See DOC-002 §9.3

## 1.3. Basic Operational Principles

### Golden Rule
> **"Don't improvise in production. Follow the runbook. If the runbook is incomplete, improve it after the incident."**

### Incident Classification (Quick Reference)

| Level | Name | Description | Response Time |
|-------|------|-------------|---------------|
| **P0** | Critical | System down / data loss risk | Immediate |
| **P1** | High | Major feature degraded | 15 minutes |
| **P2** | Medium | Minor feature impaired | 1 hour |
| **P3** | Low | Cosmetic / low-impact | 24 hours |

**Classification Matrix:**

| Criterion | P0 🔴 | P1 🟠 | P2 🟡 | P3 🟢 |
|-----------|-------|-------|-------|-------|
| **Users Affected** | >80% | 20-80% | 5-20% | <5% |
| **Functionality** | Core broken | Major degraded | Minor degraded | Cosmetic |
| **Revenue Impact** | Critical | High | Medium | Minimal |

### Escalation Policy

**Escalate immediately if:**
- P0 incident not resolved in 30 minutes
- P1 incident not resolved in 2 hours
- Code changes required
- Data loss risk exists
- Problem beyond your authority

---

# 2. General Operational Procedures

## 2.1. Daily Operations Checklist

### Morning Health Check (5 minutes)

```bash
# 1. Check all services are running
docker-compose ps

# Expected: All services "Up"
# If any service is not "Up", investigate immediately (P0)

# 2. Check API health
curl https://api.platform.com/health

# Expected: { "status": "ok" }
# If non-200 or error, investigate (P0)

# 3. Check database connectivity
docker-compose exec postgres psql -U admin -d platform_db -c "SELECT 1;"

# Expected: 1 row returned
# If connection refused, investigate (P0)

# 4. Check recent errors (last hour)
docker-compose logs --since 1h backend-api | grep '"level":"error"'

# Review any ERROR level logs
# Investigate if error rate is unusual
```

### Weekly Maintenance Tasks

```bash
# 1. Review disk usage
docker system df

# If > 80% used, clean up:
docker system prune -a --volumes

# 2. Database vacuum (off-peak hours)
docker-compose exec postgres psql -U admin -d platform_db -c "VACUUM ANALYZE;"

# 3. Check backup status
# Verify last backup timestamp
ls -lh /backups/postgres/ | tail -5

# 4. Review monitoring dashboards
# Open Grafana → Platform Overview dashboard
# Look for anomalies in metrics trends
```

## 2.2. Accessing Services

### Docker Compose Services

```bash
# View all services
docker-compose ps

# View logs for a service
docker-compose logs -f backend-api
docker-compose logs -f postgres
docker-compose logs -f redis

# Execute command in service
docker-compose exec backend-api sh
docker-compose exec postgres psql -U admin -d platform_db

# Restart a service
docker-compose restart backend-api
docker-compose restart postgres

# Stop/start all services
docker-compose stop
docker-compose start

# Restart all services (careful - causes downtime)
docker-compose down
docker-compose up -d
```

### Service URLs (Example - adjust to your environment)

```bash
# Frontend
https://platform.com

# API
https://api.platform.com

# Admin Dashboard
https://admin.platform.com

# Monitoring (if configured)
https://grafana.platform.com

# n8n Automation
http://localhost:5678
```

## 2.3. Log Access & Searching

Per **Logging Strategy (Canonical)** - logs are structured JSON.

### View Recent Logs

```bash
# Last 100 lines from backend API
docker-compose logs --tail 100 backend-api

# Follow logs in real-time
docker-compose logs -f backend-api

# Logs from specific time
docker-compose logs --since 2023-12-17T14:00:00 backend-api
docker-compose logs --since 1h backend-api
```

### Search Logs (jq for JSON parsing)

```bash
# Find all ERROR level logs
docker-compose logs backend-api | grep '"level":"error"' | jq '.'

# Find logs by trace_id
docker-compose logs backend-api | grep '"trace_id":"abc-123"' | jq '.'

# Count errors by message
docker-compose logs backend-api | \
  grep '"level":"error"' | \
  jq -r '.message' | \
  sort | uniq -c | sort -rn

# Find slow API calls (> 1000ms)
docker-compose logs backend-api | \
  grep '"duration_ms"' | \
  jq 'select(.duration_ms > 1000)'
```

### Log Correlation

Per **Logging Strategy (Canonical §3)** - use `trace_id` to follow a request:

```bash
# Get trace_id from initial log entry
TRACE_ID="abc-123-def-456"

# Find all logs for this request
docker-compose logs backend-api | grep "\"trace_id\":\"$TRACE_ID\"" | jq '.'
```

---

# 3. Backend API Operations

## 3.1. API Health & Status

### Health Check Endpoints

Per **Monitoring & Observability Plan (§2.1.3)**:

```bash
# Overall health
curl https://api.platform.com/health

# Expected:
# { "status": "ok" }

# Database health
curl https://api.platform.com/health/db

# Expected:
# { "status": "ok", "database": "connected" }

# Redis health
curl https://api.platform.com/health/redis

# Expected:
# { "status": "ok", "redis": "connected" }
```

### API Latency Check

```bash
# Measure API response time
time curl -w "\nTime: %{time_total}s\n" https://api.platform.com/health

# Expected: < 500ms for health endpoint
# If > 1s, investigate (possible database or network issue)
```

## 3.2. Restarting Backend API

**When to restart:**
- High memory usage (> 80% of container limit)
- Service not responding to health checks
- After configuration changes
- Deployment of new version

**⚠️ WARNING:** Restarting causes brief downtime (30-60 seconds).

```bash
# Graceful restart (allows connections to finish)
docker-compose restart backend-api

# Check service is up
docker-compose ps backend-api

# Verify health
curl https://api.platform.com/health

# Check logs for errors
docker-compose logs --tail 50 backend-api
```

### Rollback Procedure

See **Deployment Runbook (DOC-039)** for detailed rollback procedures.

**Quick rollback:**

```bash
# Stop current version
docker-compose stop backend-api

# Switch to previous image tag
# Edit docker-compose.yml: image: backend-api:v1.2.3 → v1.2.2

# Start previous version
docker-compose up -d backend-api

# Verify
curl https://api.platform.com/health
docker-compose logs -f backend-api
```

## 3.3. Common Backend Issues

### Issue: High CPU Usage

**Symptoms:**
- API latency > 1s
- Slow response times
- High CPU metric in monitoring

**Diagnosis:**

```bash
# Check current CPU usage
docker stats backend-api

# Check for slow queries in logs
docker-compose logs backend-api | grep '"duration_ms"' | jq 'select(.duration_ms > 1000)'

# Check active database connections
docker-compose exec postgres psql -U admin -d platform_db -c \
  "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
```

**Actions:**

1. **Identify slow endpoints:**
   - Review logs for high `duration_ms`
   - Check Grafana: "Backend API Latency by Endpoint"

2. **Check database:**
   - See [§4.3 Database Performance](#43-database-performance)

3. **Temporary mitigation:**
   ```bash
   # Restart service to clear memory leaks
   docker-compose restart backend-api
   ```

4. **Escalate if:**
   - CPU usage > 80% sustained for > 10 minutes
   - Restart doesn't improve performance
   - Code optimization needed

### Issue: Memory Leak

**Symptoms:**
- Memory usage continuously increasing
- OOM errors in logs
- Service crashes

**Diagnosis:**

```bash
# Monitor memory over time
watch -n 5 'docker stats backend-api --no-stream'

# Check for OOM kills in logs
docker-compose logs backend-api | grep -i "out of memory"
```

**Actions:**

1. **Immediate mitigation:**
   ```bash
   # Restart to clear memory
   docker-compose restart backend-api
   ```

2. **Monitor:**
   - Set up alert if memory > 80% for 15 minutes

3. **Escalate:**
   - If leak persists after restart
   - Code review needed to identify leak source

### Issue: API Returning 5xx Errors

**Symptoms:**
- User reports errors
- Monitoring shows error rate spike
- Health check failures

**Diagnosis:**

```bash
# Check recent error logs
docker-compose logs --since 10m backend-api | grep '"level":"error"'

# Check HTTP status distribution
docker-compose logs backend-api | \
  grep '"status":' | \
  jq -r '.status' | \
  sort | uniq -c | sort -rn

# Check database connectivity
curl https://api.platform.com/health/db
```

**Actions:**

1. **Identify root cause:**
   - Database connection issue? → See [§4.1](#41-database-connectivity)
   - Redis connection issue? → Check Redis health
   - Application bug? → Check error stack traces in logs

2. **Immediate actions:**
   ```bash
   # Restart service if unresponsive
   docker-compose restart backend-api
   
   # Check dependencies
   docker-compose ps
   # Ensure postgres, redis are "Up"
   ```

3. **Escalate if:**
   - Error rate > 5% sustained
   - Unable to identify root cause in 15 minutes
   - P0 incident (all API endpoints down)

---

# 4. Database Operations

## 4.1. Database Connectivity

### Check Database Status

```bash
# Check container is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U admin -d platform_db -c "SELECT version();"

# Expected: PostgreSQL version info

# Check active connections
docker-compose exec postgres psql -U admin -d platform_db -c \
  "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"
```

### Database Connection Issues

**Symptoms:**
- API health check fails on /health/db
- "Connection refused" or "Too many connections" errors
- Slow query performance

**Diagnosis:**

```bash
# Check connection count
docker-compose exec postgres psql -U admin -d platform_db -c \
  "SELECT count(*) FROM pg_stat_activity;"

# Check max connections setting
docker-compose exec postgres psql -U admin -d platform_db -c \
  "SHOW max_connections;"

# Expected: 100 (per Technical Architecture §8.4)
```

**Actions:**

1. **If connection limit reached:**
   ```bash
   # Kill idle connections (> 5 minutes)
   docker-compose exec postgres psql -U admin -d platform_db -c \
     "SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
      WHERE state = 'idle' 
      AND state_change < now() - interval '5 minutes';"
   ```

2. **Restart database (⚠️ causes downtime):**
   ```bash
   docker-compose restart postgres
   
   # Wait 30 seconds for startup
   sleep 30
   
   # Verify
   curl https://api.platform.com/health/db
   ```

3. **Escalate if:**
   - Connection issues persist after restart
   - Need to increase max_connections (requires config change)

## 4.2. Database Performance Monitoring

### Key Metrics

```bash
# Check database size
docker-compose exec postgres psql -U admin -d platform_db -c \
  "SELECT pg_size_pretty(pg_database_size('platform_db'));"

# Check largest tables
docker-compose exec postgres psql -U admin -d platform_db -c \
  "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC 
   LIMIT 10;"

# Check cache hit ratio (should be > 90%)
docker-compose exec postgres psql -U admin -d platform_db -c \
  "SELECT sum(heap_blks_read) as heap_read, 
          sum(heap_blks_hit) as heap_hit, 
          sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio 
   FROM pg_statio_user_tables;"
```

## 4.3. Slow Query Diagnosis

**Symptoms:**
- API endpoints timing out
- High database CPU
- User complaints of slow load times

**Diagnosis:**

```bash
# Enable slow query logging (if not already enabled)
docker-compose exec postgres psql -U admin -d platform_db -c \
  "ALTER SYSTEM SET log_min_duration_statement = 1000;"  # Log queries > 1s

# Reload config
docker-compose exec postgres psql -U admin -d platform_db -c \
  "SELECT pg_reload_conf();"

# View slow queries
docker-compose logs postgres | grep "duration:"

# Check long-running queries
docker-compose exec postgres psql -U admin -d platform_db -c \
  "SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
   FROM pg_stat_activity 
   WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 seconds';"
```

**Actions:**

1. **Analyze query plan:**
   ```sql
   -- Example: Check why a query is slow
   EXPLAIN ANALYZE 
   SELECT * FROM warehouses 
   WHERE city = 'New York' 
   ORDER BY rating DESC 
   LIMIT 20;
   ```

2. **Check for missing indexes:**
   - See Database Specification (DOC-XXX) for required indexes
   - Common issue: filtering on un-indexed columns

3. **Kill runaway query (if necessary):**
   ```bash
   # Get PID from above query
   docker-compose exec postgres psql -U admin -d platform_db -c \
     "SELECT pg_terminate_backend(<PID>);"
   ```

4. **Escalate if:**
   - Query optimization needed
   - Index creation required
   - Database schema change needed

## 4.4. Database Backups

### Verify Backup Status

```bash
# Check last backup time
ls -lh /backups/postgres/ | tail -5

# Expected: Daily backups present

# Check backup size (should be consistent)
du -sh /backups/postgres/*
```

### Manual Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U admin platform_db | gzip > /backups/postgres/manual_backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Verify backup created
ls -lh /backups/postgres/manual_backup_*
```

### Restore from Backup (⚠️ DESTRUCTIVE)

**⚠️ WARNING:** This will overwrite the current database.

```bash
# 1. Stop backend to prevent writes
docker-compose stop backend-api

# 2. Drop and recreate database
docker-compose exec postgres psql -U admin -c "DROP DATABASE platform_db;"
docker-compose exec postgres psql -U admin -c "CREATE DATABASE platform_db;"

# 3. Restore backup
gunzip < /backups/postgres/backup_20231217.sql.gz | \
  docker-compose exec -T postgres psql -U admin platform_db

# 4. Run migrations if needed
docker-compose exec backend-api npm run migration:run

# 5. Restart backend
docker-compose start backend-api

# 6. Verify
curl https://api.platform.com/health/db
```

**Escalate immediately if:**
- Restore fails
- Data integrity issues after restore
- Need to restore to production

---

# 5. Common Issues & Resolutions

## 5.1. Service Won't Start

**Symptoms:**
- `docker-compose up` fails
- Service crashes immediately after start
- Error in startup logs

**Diagnosis:**

```bash
# Check service status
docker-compose ps

# View error logs
docker-compose logs backend-api

# Check for common issues:
# 1. Port already in use
netstat -tulpn | grep :4000

# 2. Environment variables missing
docker-compose exec backend-api env | grep -E 'DATABASE_URL|JWT_SECRET|API_KEY'

# 3. Database not ready
curl https://api.platform.com/health/db
```

**Actions:**

1. **Port conflict:**
   ```bash
   # Find process using port
   lsof -i :4000
   
   # Kill process or change port in docker-compose.yml
   ```

2. **Missing env vars:**
   ```bash
   # Check .env file exists and is complete
   cat .env | grep -E 'DATABASE_URL|JWT_SECRET'
   
   # Restart with env loaded
   docker-compose down
   docker-compose up -d
   ```

3. **Database not ready:**
   ```bash
   # Wait for database to be healthy
   docker-compose restart postgres
   sleep 30
   docker-compose restart backend-api
   ```

## 5.2. Email Notifications Not Sending

**Reference:** See Technical Architecture (DOC-002 §7.5) for email configuration.

**Symptoms:**
- Users not receiving emails
- Email errors in logs
- SendGrid errors

**Diagnosis:**

```bash
# Check for email errors in logs
docker-compose logs backend-api | grep -i "email\|sendgrid"

# Check SendGrid API key is set
docker-compose exec backend-api env | grep SENDGRID_API_KEY

# Test email send manually (if API supports)
curl -X POST https://api.platform.com/internal/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"admin@platform.com","subject":"Test"}'
```

**Actions:**

1. **Check SendGrid dashboard:**
   - Log in to SendGrid
   - Check delivery metrics
   - Look for bounces/blocks

2. **Verify API key:**
   ```bash
   # API key should start with "SG."
   docker-compose exec backend-api env | grep SENDGRID_API_KEY
   ```

3. **Check rate limits:**
   - SendGrid free tier: 100 emails/day
   - If exceeded, upgrade plan or reduce email volume

4. **Escalate if:**
   - API key is valid but emails still failing
   - SendGrid reports delivery issues
   - Need to debug email template issues

## 5.3. High Latency / Slow Performance

**Symptoms:**
- API response time > 1s
- Users complain of slowness
- Timeout errors

**Diagnosis:**

```bash
# 1. Check API latency
time curl https://api.platform.com/api/warehouses?city=New%20York

# 2. Check database performance
docker stats postgres

# 3. Check for slow queries
docker-compose logs postgres | grep "duration:" | tail -20

# 4. Check Redis cache
docker-compose exec redis redis-cli PING
# Expected: PONG
```

**Actions:**

1. **Identify bottleneck:**
   - High DB CPU → Slow queries (see [§4.3](#43-slow-query-diagnosis))
   - High API CPU → Code inefficiency
   - High network latency → External API issues

2. **Check cache effectiveness:**
   ```bash
   # Redis hit rate
   docker-compose exec redis redis-cli INFO stats | grep keyspace
   ```

3. **Clear cache (if stale):**
   ```bash
   docker-compose exec redis redis-cli FLUSHDB
   ```

4. **Temporary mitigation:**
   ```bash
   # Restart services to clear memory
   docker-compose restart backend-api
   docker-compose restart redis
   ```

## 5.4. Disk Space Full

**Symptoms:**
- "No space left on device" errors
- Services crashing
- Cannot write logs

**Diagnosis:**

```bash
# Check disk usage
df -h

# Check Docker disk usage
docker system df

# Find large directories
du -sh /* | sort -rh | head -10
```

**Actions:**

1. **Clean Docker resources:**
   ```bash
   # Remove unused containers, images, volumes
   docker system prune -a --volumes
   
   # Confirm space freed
   df -h
   ```

2. **Clean old logs:**
   ```bash
   # Truncate old log files
   find /var/log -name "*.log" -mtime +7 -exec truncate -s 0 {} \;
   ```

3. **Clean old backups:**
   ```bash
   # Keep only last 7 days of backups
   find /backups/postgres -name "*.sql.gz" -mtime +7 -delete
   ```

4. **Escalate if:**
   - Still no space after cleanup
   - Need to increase disk size
   - P0 if services cannot start

---

# 6. Health Checks & Diagnostics

## 6.1. Complete System Health Check

Run this script to check all system components:

```bash
#!/bin/bash
# system-health-check.sh

echo "=== System Health Check ==="
echo ""

# 1. Services Running
echo "1. Docker Services:"
docker-compose ps

# 2. API Health
echo ""
echo "2. API Health:"
curl -s https://api.platform.com/health | jq '.'

# 3. Database Health
echo ""
echo "3. Database Health:"
docker-compose exec postgres psql -U admin -d platform_db -c "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Database: OK"
else
  echo "❌ Database: FAIL"
fi

# 4. Redis Health
echo ""
echo "4. Redis Health:"
docker-compose exec redis redis-cli PING

# 5. Disk Space
echo ""
echo "5. Disk Space:"
df -h | grep -E "Filesystem|/$"

# 6. Recent Errors
echo ""
echo "6. Recent Errors (last hour):"
docker-compose logs --since 1h backend-api | grep '"level":"error"' | wc -l
echo "error logs found"

# 7. Database Connections
echo ""
echo "7. Database Connections:"
docker-compose exec postgres psql -U admin -d platform_db -c \
  "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"

echo ""
echo "=== Health Check Complete ==="
```

Run with:
```bash
chmod +x system-health-check.sh
./system-health-check.sh
```

## 6.2. Metrics Overview (If Monitoring Configured)

### Using Prometheus (Example)

If Prometheus is configured (see Monitoring & Observability Plan), access:

```bash
# Prometheus UI (example)
http://localhost:9090

# Key queries to run:
# - rate(http_requests_total[5m])  # Request rate
# - histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) # p95 latency
# - up  # Service availability
```

### Using Grafana (Example)

If Grafana is configured:

```bash
# Grafana UI (example)
http://localhost:3001

# Check dashboards:
# - Platform Overview
# - Backend API Metrics
# - Database Performance
```

**Note:** Monitoring setup is optional for MVP. See Monitoring & Observability Plan for full implementation.

---

# 7. Emergency Procedures

## 7.1. Complete System Restart

**⚠️ WARNING:** Causes downtime (~5 minutes). Only use in emergencies.

```bash
# 1. Stop all services
docker-compose down

# 2. Verify all stopped
docker-compose ps
# Should show no running containers

# 3. Start all services
docker-compose up -d

# 4. Wait for services to be ready
sleep 60

# 5. Verify health
curl https://api.platform.com/health
docker-compose ps

# 6. Check logs for errors
docker-compose logs --tail 50 backend-api
docker-compose logs --tail 50 postgres
```

## 7.2. Emergency Rollback

See **Deployment Runbook (DOC-039)** for complete rollback procedures.

**Quick rollback to last known good version:**

```bash
# 1. Stop current version
docker-compose stop

# 2. Switch to previous git tag
git checkout v1.2.3  # Replace with last known good version

# 3. Rebuild and start
docker-compose build
docker-compose up -d

# 4. Verify
curl https://api.platform.com/health
docker-compose logs -f backend-api

# 5. Monitor for issues
# Check error logs for 10 minutes
```

## 7.3. Database Emergency Recovery

**⚠️ CRITICAL:** Only use if database is corrupted or unrecoverable.

```bash
# 1. Stop backend to prevent writes
docker-compose stop backend-api

# 2. Backup current (possibly corrupt) database
docker-compose exec postgres pg_dump -U admin platform_db > /tmp/corrupt_backup.sql

# 3. Restore from last good backup
# See §4.4 for restore procedure

# 4. Restart services
docker-compose start backend-api

# 5. Verify
curl https://api.platform.com/health/db

# 6. Document incident
# Record: what happened, when, what was lost, how recovered
```

## 7.4. Escalation Contacts

**P0/P1 Incidents:**

```
On-Call Engineer: +XXX-XXXX-XXXX
Engineering Lead: +XXX-XXXX-XXXX
CTO: +XXX-XXXX-XXXX
```

**External Support:**

```
Hosting Provider: [Link to support portal]
Database Support: [Link to support]
```

**Internal Communication:**

```
Slack: #platform-incidents
Email: engineering@platform.com
```

---

# Appendices

## Appendix A: Docker Compose Quick Reference

### Essential Commands

```bash
# View status
docker-compose ps

# View logs
docker-compose logs -f <service>
docker-compose logs --tail 100 <service>
docker-compose logs --since 1h <service>

# Start/stop
docker-compose start <service>
docker-compose stop <service>
docker-compose restart <service>

# Execute commands
docker-compose exec <service> <command>
docker-compose exec backend-api sh
docker-compose exec postgres psql -U admin -d platform_db

# Build and restart
docker-compose build <service>
docker-compose up -d <service>

# Complete restart (⚠️ downtime)
docker-compose down
docker-compose up -d

# Check resource usage
docker stats

# Clean up
docker system prune -a --volumes
```

## Appendix B: Kubernetes Comparison (Post-MVP)

**Note:** Kubernetes is v2+ only (see Technical Architecture §10.7). This section is for future reference.

| Docker Compose | Kubernetes Equivalent | Notes |
|----------------|----------------------|-------|
| `docker-compose ps` | `kubectl get pods` | List running containers/pods |
| `docker-compose logs <service>` | `kubectl logs <pod>` | View logs |
| `docker-compose exec <service> sh` | `kubectl exec -it <pod> -- sh` | Shell access |
| `docker-compose restart <service>` | `kubectl rollout restart deployment/<name>` | Restart service |
| `docker-compose up -d` | `kubectl apply -f manifests/` | Deploy/update |
| `docker-compose down` | `kubectl delete -f manifests/` | Remove all |

**When Kubernetes is relevant (v2+):**
- Multiple environments with different resource requirements
- Auto-scaling needed (HPA)
- Rolling updates without downtime
- Multi-region deployments
- Team > 5 engineers

**MVP v1 Rationale for docker-compose:**
- Simpler operations
- Lower learning curve
- Sufficient for small scale
- Easier local development
- Cost-effective

## Appendix C: Tool Alternatives

This runbook uses specific tools as examples. Here are alternatives:

| Category | Used in Runbook | Alternatives |
|----------|----------------|--------------|
| **Monitoring** | Prometheus + Grafana | Datadog, New Relic, CloudWatch |
| **Logging** | Loki | ELK Stack, Splunk, CloudWatch Logs |
| **APM** | Open-source stack | Datadog APM, New Relic APM |
| **Alerting** | Grafana Alerts | PagerDuty, OpsGenie, AlertManager |
| **Container Runtime** | Docker Compose | Docker Swarm, Nomad, Kubernetes (v2+) |

**Adaptation Note:** Commands in this runbook are conceptual. Adapt to your actual tooling.

## Appendix D: Runbook Maintenance

### When to Update This Document

- After resolving a new type of incident
- When operational procedures change
- After infrastructure updates
- Quarterly review

### Runbook Improvement Process

1. **Identify gap during incident**
2. **Resolve incident first** (don't document during crisis)
3. **After resolution, document:**
   - What was the symptom?
   - How was it diagnosed?
   - What actions resolved it?
   - How to prevent recurrence?
4. **Submit update** to this runbook
5. **Review with team**

### Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-10 | Initial draft | Operations Team |
| 2.0 | 2025-12-17 | **CANONICAL HARDENING:** Scoped to MVP v1, removed Kubernetes as default, marked tools as examples, aligned with canonical documents, translated to English | Operations Team |

---

## Document Metadata

**Document ID:** DOC-006  
**Status:** Supporting / Reference (Canonical Alignment)  
**Version:** 2.0  
**Last Updated:** December 17, 2025  
**Next Review:** March 17, 2026  
**Maintained By:** Operations Team

### Related Documents

**Primary References (DO NOT duplicate these):**
- **DOC-002:** Technical Architecture Document (MVP v1 REVISED) - System architecture
- **DOC-039:** Deployment & Rollback Runbook - Deployment procedures
- **DOC-XXX:** Monitoring & Observability Plan (Canonical) - Monitoring specification
- **DOC-XXX:** Logging Strategy (Canonical) - Log structure and retention
- **DOC-048:** Security & Compliance Plan - Security procedures

**Supporting References:**
- **DOC-052:** Infrastructure as Code Plan - IaC principles
- **DOC-031:** Configuration Management Strategy - Config management
- **DOC-XXX:** Error Handling & Fault Tolerance - Error handling patterns

### Scope Statement

This document is intentionally **LIMITED** to MVP v1 operational procedures for small teams. It does NOT cover:

- Enterprise SRE practices
- Advanced incident management
- Kubernetes operations (v2+)
- Multi-region operations (v3+)
- Advanced automation

**For production-scale operations, this document will need significant expansion in post-MVP phases.**

---

**END OF DOCUMENT**

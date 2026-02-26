# Monitoring & Observability Plan (MVP v1) — CANONICAL

## Self-Storage Aggregator Platform

**Document Version:** 1.1 (CANONICAL)  
**Date:** December 15, 2025  
**Status:** Canonical  
**Author:** Platform Team  
**Reviewed by:** Engineering Lead, CTO

---

## Document Classification & Purpose

**Type:** Observability Contract — Canonical Specification  
**Status:** Canonical (normative for observability signals and principles)  
**Audience:** Backend Engineers, DevOps/SRE, Platform Team

### What This Document Defines

This document defines **canonical observability principles and signals** for the Self-Storage Aggregator platform:

- What metrics to collect and expose
- What logs to emit and how to structure them
- How to instrument distributed tracing
- What dashboards to provide
- What conditions warrant alerts (conceptually)
- Integration patterns with observability tooling

### What This Document Does NOT Define

This document does **NOT** specify:

- **Specific SLO/SLA target values** (e.g., "99.9% uptime") — these are environment-specific
- **Hard alert thresholds** (e.g., "CPU > 80%") — these are configurable per environment
- **Detailed incident response procedures** — see **Security & Compliance Plan MVP v1 § 10**
- **Logging implementation details** — see **Logging Strategy & Log Taxonomy MVP v1**
- **Business analytics** or conversion metrics — deferred to post-MVP

### Configuration Philosophy

**All numerical thresholds, targets, and limits in this document are:**
- Environment-dependent (dev, staging, production)
- Configurable via environment variables or configuration management
- Subject to adjustment based on load testing and operational experience
- Defined by SRE/Operations teams, not hardcoded in application logic

**This document provides the contract for WHAT to measure and HOW to expose it, not WHAT VALUES to enforce.**

---

## Table of Contents

1. [Overview](#1-overview)
2. [Metrics Collection](#2-metrics-collection)
3. [Distributed Tracing](#3-distributed-tracing)
4. [Dashboards](#4-dashboards)
5. [Alert Signals](#5-alert-signals)
6. [Observability Best Practices](#6-observability-best-practices)
7. [Monitoring Infrastructure](#7-monitoring-infrastructure)
8. [Integration Points](#8-integration-points)

---

## 1. Overview

### 1.1. Goals

**Primary Objectives:**

1. **Visibility** — Provide comprehensive observability into system behavior
2. **Rapid Detection** — Enable fast identification of anomalies and incidents
3. **Effective Troubleshooting** — Support root cause analysis through correlated signals
4. **Informed Decisions** — Enable data-driven operational and architectural decisions
5. **SLO Support** — Provide metrics foundation for defining and tracking Service Level Objectives

**Success Criteria:**

- All critical services instrumented with metrics, logs, and traces
- Alert signals defined for all SLO-impacting failure modes
- Dashboard coverage for all system components
- Log and trace correlation enabled via correlation IDs
- Metrics exposed in Prometheus-compatible format

### 1.2. Scope

**In Scope for MVP:**

- **Frontend Observability:**
  - Next.js application performance metrics
  - Core Web Vitals (LCP, FID, CLS)
  - JavaScript error tracking
  - User session correlation

- **Backend Observability:**
  - NestJS API services (8 modules per Backend Implementation Plan)
  - HTTP request/response metrics
  - Business operation metrics (bookings, searches, leads)
  - Queue processing metrics (if applicable)

- **Infrastructure Observability:**
  - API Gateway (Nginx) metrics
  - PostgreSQL database metrics
  - Redis cache metrics
  - System resource metrics (CPU, RAM, disk, network)

- **External Dependencies Monitoring:**
  - Google Maps / Google Maps API availability and latency
  - OpenAI API availability and latency
  - SendGrid (email) delivery metrics
  - Twilio (SMS) delivery metrics

**Out of Scope for MVP:**

- Mobile application monitoring (no mobile app in MVP)
- Advanced Real User Monitoring (RUM) with session replay
- Kubernetes-specific metrics (using Docker Compose in MVP)
- SIEM integration or advanced security analytics
- Full-featured APM solutions (NewRelic, Datadog) — using open-source stack
- Business intelligence and conversion analytics (deferred to post-MVP)

### 1.3. Observability Components

**Three Pillars of Observability:**

1. **Metrics (Prometheus)**
   - Quantitative data about system behavior
   - Time-series database with configurable retention
   - Scrape interval and retention defined per environment

2. **Logs (Loki)**
   - Textual records of discrete events
   - Structured JSON format (per Logging Strategy § 5)
   - Retention policy defined per environment

3. **Traces (OpenTelemetry + Jaeger — Optional)**
   - Request flow through distributed system
   - Sampling rate configurable per environment
   - Retention defined per environment

**Technology Stack:**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Metrics | Prometheus | Time-series metrics storage |
| Visualization | Grafana | Dashboards and exploration |
| Logs | Loki | Log aggregation |
| Log Shipping | Promtail | Log collection agent |
| Alerting | Alertmanager | Alert routing and notifications |
| Tracing (optional) | Jaeger | Distributed tracing backend |
| Exporters | Various | Metrics exposition |

**Observability Stack Architecture:**

```
Application Services → Exporters → Prometheus → Grafana
                    → Promtail  → Loki      → Grafana
                    → OTLP      → Jaeger    → Grafana (optional)
```

**Key Principles:**

1. **Minimalism** — Only essential metrics and logs for MVP
2. **Correlation** — Link metrics, logs, and traces via correlation IDs
3. **Automation** — Automated collection and aggregation
4. **Actionability** — Every signal must support operational decisions
5. **Developer Experience** — Easy to add new instrumentation

---

## 2. Metrics Collection

### 2.1. Backend Services Metrics

**Core HTTP Metrics (Required):**

All backend services must expose the following Prometheus metrics:

```typescript
// metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private registry: Registry;
  
  // HTTP request counter
  private httpRequestsTotal: Counter;
  
  // HTTP request duration histogram
  private httpRequestDuration: Histogram;
  
  // Active requests gauge
  private activeRequests: Gauge;
  
  constructor() {
    this.registry = new Registry();
    
    // Initialize metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'endpoint', 'status'],
      registers: [this.registry],
    });
    
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'endpoint', 'status'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10], // Configurable per environment
      registers: [this.registry],
    });
    
    this.activeRequests = new Gauge({
      name: 'http_active_requests',
      help: 'Number of active HTTP requests',
      registers: [this.registry],
    });
  }
  
  // Increment request counter
  incrementRequest(method: string, endpoint: string, status: number) {
    this.httpRequestsTotal.inc({
      method,
      endpoint: this.normalizeEndpoint(endpoint),
      status: Math.floor(status / 100) + 'xx',
    });
  }
  
  // Observe request duration
  observeDuration(method: string, endpoint: string, status: number, duration: number) {
    this.httpRequestDuration.observe(
      {
        method,
        endpoint: this.normalizeEndpoint(endpoint),
        status: Math.floor(status / 100) + 'xx',
      },
      duration / 1000 // Convert ms to seconds
    );
  }
  
  // Normalize endpoint to prevent cardinality explosion
  private normalizeEndpoint(endpoint: string): string {
    return endpoint
      .replace(/\/\d+/g, '/:id')
      .replace(/\/[a-f0-9-]{36}/g, '/:uuid')
      .replace(/\?.*/g, ''); // Remove query parameters
  }
  
  // Get metrics for Prometheus
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
```

**Required HTTP Metric Labels:**

| Metric | Labels | Cardinality Considerations |
|--------|--------|---------------------------|
| `http_requests_total` | `method`, `endpoint`, `status` | Normalize endpoints to prevent explosion |
| `http_request_duration_seconds` | `method`, `endpoint`, `status` | Same as above |
| `http_active_requests` | None | Single gauge value |

### 2.2. Business Operation Metrics

**Booking Lifecycle Metrics:**

Track key business operations relevant to system health:

```typescript
export class BookingMetricsService {
  // Booking state transitions
  private bookingStateTransitions: Counter;
  
  // Booking creation attempts
  private bookingCreationAttempts: Counter;
  
  constructor(registry: Registry) {
    this.bookingStateTransitions = new Counter({
      name: 'booking_state_transitions_total',
      help: 'Total booking state transitions',
      labelNames: ['from_status', 'to_status', 'success'],
      registers: [registry],
    });
    
    this.bookingCreationAttempts = new Counter({
      name: 'booking_creation_attempts_total',
      help: 'Total booking creation attempts',
      labelNames: ['result'], // 'success' or 'failure'
      registers: [registry],
    });
  }
  
  recordStateTransition(from: string, to: string, success: boolean) {
    this.bookingStateTransitions.inc({
      from_status: from,
      to_status: to,
      success: success.toString(),
    });
  }
  
  recordCreationAttempt(success: boolean) {
    this.bookingCreationAttempts.inc({
      result: success ? 'success' : 'failure',
    });
  }
}
```

**Warehouse Search Metrics:**

```typescript
export class SearchMetricsService {
  // Search attempts
  private searchAttempts: Counter;
  
  // Search result counts
  private searchResults: Histogram;
  
  constructor(registry: Registry) {
    this.searchAttempts = new Counter({
      name: 'warehouse_search_attempts_total',
      help: 'Total warehouse search attempts',
      labelNames: ['has_filters', 'has_results'],
      registers: [registry],
    });
    
    this.searchResults = new Histogram({
      name: 'warehouse_search_result_count',
      help: 'Number of results per search',
      buckets: [0, 1, 5, 10, 25, 50, 100],
      registers: [registry],
    });
  }
}
```

**AI Feature Usage Metrics:**

```typescript
export class AIMetricsService {
  // AI requests
  private aiRequests: Counter;
  
  // AI response times
  private aiResponseTime: Histogram;
  
  // AI cost tracking
  private aiCostTotal: Counter;
  
  constructor(registry: Registry) {
    this.aiRequests = new Counter({
      name: 'ai_requests_total',
      help: 'Total AI feature requests',
      labelNames: ['feature', 'result', 'cached'],
      registers: [registry],
    });
    
    this.aiResponseTime = new Histogram({
      name: 'ai_response_time_seconds',
      help: 'AI response time in seconds',
      labelNames: ['feature'],
      buckets: [0.5, 1, 2, 5, 10, 30],
      registers: [registry],
    });
    
    this.aiCostTotal = new Counter({
      name: 'ai_cost_total_usd',
      help: 'Total AI API cost in USD',
      labelNames: ['feature', 'model'],
      registers: [registry],
    });
  }
}
```

**CRM Lead Metrics:**

```typescript
export class LeadMetricsService {
  // Lead creation
  private leadCreated: Counter;
  
  // Lead status changes
  private leadStatusChanges: Counter;
  
  constructor(registry: Registry) {
    this.leadCreated = new Counter({
      name: 'crm_leads_created_total',
      help: 'Total leads created',
      labelNames: ['source'], // 'web_form', 'operator_created', etc.
      registers: [registry],
    });
    
    this.leadStatusChanges = new Counter({
      name: 'crm_lead_status_changes_total',
      help: 'Total lead status changes',
      labelNames: ['from_status', 'to_status'],
      registers: [registry],
    });
  }
}
```

### 2.3. API Gateway Metrics (Nginx)

**Nginx Exporter Configuration:**

Nginx must expose `/stub_status` endpoint and be scraped by `nginx-prometheus-exporter`.

**Key Nginx Metrics:**

| Metric | Description | Use Case |
|--------|-------------|----------|
| `nginx_http_requests_total` | Total HTTP requests | Overall traffic volume |
| `nginx_connections_active` | Active connections | Connection pool saturation |
| `nginx_connections_accepted` | Total accepted connections | Connection acceptance rate |
| `nginx_connections_handled` | Total handled connections | Connection handling rate |

### 2.4. PostgreSQL Metrics

**PostgreSQL Exporter Configuration:**

Use `postgres_exporter` to expose database metrics.

**Key Database Metrics:**

| Metric | Description | Alert Signal |
|--------|-------------|--------------|
| `pg_stat_database_xact_commit` | Committed transactions | Transaction volume |
| `pg_stat_database_tup_returned` | Rows returned by queries | Query activity |
| `pg_stat_database_conflicts` | Database conflicts | Potential issues |
| `pg_stat_activity_count` | Active connections | Connection pool usage |
| `pg_stat_bgwriter_buffers_alloc` | Allocated buffers | Memory pressure |
| `pg_stat_database_deadlocks` | Deadlock count | Concurrency issues |

**Slow Query Tracking:**

Per **Database Specification § 13**, slow queries are logged and can be tracked via:
- Application logs (queries exceeding threshold)
- PostgreSQL's `pg_stat_statements` extension

### 2.5. Redis Metrics

**Redis Exporter Configuration:**

Use `redis_exporter` to expose cache metrics.

**Key Redis Metrics:**

| Metric | Description | Alert Signal |
|--------|-------------|--------------|
| `redis_connected_clients` | Connected clients | Connection usage |
| `redis_memory_used_bytes` | Memory usage | Memory pressure |
| `redis_keyspace_hits_total` | Cache hits | Cache effectiveness |
| `redis_keyspace_misses_total` | Cache misses | Cache effectiveness |
| `redis_cpu_sys_seconds_total` | CPU time (system) | CPU usage |

**Cache Hit Rate Calculation:**

```promql
# Cache hit rate (%)
redis_keyspace_hits_total / (redis_keyspace_hits_total + redis_keyspace_misses_total) * 100
```

### 2.6. System Metrics (Node Exporter)

**Node Exporter Configuration:**

Deploy `node_exporter` to expose OS-level metrics.

**Key System Metrics:**

| Metric | Description |
|--------|-------------|
| `node_cpu_seconds_total` | CPU time by mode |
| `node_memory_MemAvailable_bytes` | Available memory |
| `node_memory_MemTotal_bytes` | Total memory |
| `node_filesystem_avail_bytes` | Available disk space |
| `node_filesystem_size_bytes` | Total disk space |
| `node_network_receive_bytes_total` | Network receive bytes |
| `node_network_transmit_bytes_total` | Network transmit bytes |

### 2.7. Frontend Web Vitals

**Next.js Performance Metrics:**

Frontend should emit Core Web Vitals to a backend endpoint for aggregation:

```typescript
// frontend/lib/webVitals.ts
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Send to backend metrics endpoint
  fetch('/api/metrics/web-vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      label: metric.label,
    }),
  });
}
```

**Core Web Vitals:**

| Metric | Description | Importance |
|--------|-------------|-----------|
| **LCP** (Largest Contentful Paint) | Loading performance | User-perceived load time |
| **FID** (First Input Delay) | Interactivity | Responsiveness to user input |
| **CLS** (Cumulative Layout Shift) | Visual stability | Layout shift prevention |
| **TTFB** (Time to First Byte) | Server response time | Backend performance |

---

## 3. Distributed Tracing

> **Reference:** For detailed logging requirements, see **Logging Strategy & Log Taxonomy MVP v1**.

### 3.1. OpenTelemetry Architecture

**Tracing Stack (Optional for MVP):**

- **Instrumentation:** OpenTelemetry SDK
- **Collection:** OTLP (OpenTelemetry Protocol)
- **Storage:** Jaeger
- **Visualization:** Grafana + Jaeger integration

**When to Enable Tracing:**

- Complex multi-service interactions
- Performance debugging across service boundaries
- Root cause analysis for distributed failures

### 3.2. Trace Propagation

**Correlation IDs:**

All requests must include a correlation ID for log/trace correlation:

```typescript
// middleware/correlation-id.middleware.ts
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = req.headers['x-request-id'] || uuidv4();
    req['correlationId'] = correlationId;
    res.setHeader('x-request-id', correlationId);
    
    // Attach to logger context (per Logging Strategy)
    AsyncLocalStorage.getStore().set('correlationId', correlationId);
    
    next();
  }
}
```

**Propagation via HTTP Headers:**

- `x-request-id` — Request correlation ID
- `x-trace-id` — Distributed trace ID (if tracing enabled)
- `x-span-id` — Current span ID (if tracing enabled)

### 3.3. Span Naming Conventions

**Naming Pattern:**

```
<service_name>.<operation_type>.<resource>
```

**Examples:**

- `backend-api.http.GET_/api/warehouses/:id`
- `backend-api.database.SELECT_warehouses`
- `backend-api.external.maps_geocode`

### 3.4. Sampling Configuration

**Sampling Strategy:**

Sampling rate is **environment-defined**:

- **Development:** 100% (all traces)
- **Staging:** Configurable (e.g., 50%)
- **Production:** Configurable (e.g., 10-20%)

**Adaptive Sampling:**

Consider implementing adaptive sampling based on:
- Error status (sample 100% of errors)
- Latency (sample 100% of slow requests)
- Random sampling for baseline traffic

---

## 4. Dashboards

### 4.1. Dashboard Hierarchy

**Level 1: Overview Dashboard**

High-level system health at a glance:
- Overall request rate
- Overall error rate
- Active services status
- Key external dependencies status

**Level 2: Service-Specific Dashboards**

Per-service operational metrics:
- Backend API dashboard
- Database dashboard
- Cache dashboard
- API Gateway dashboard

**Level 3: Domain-Specific Dashboards**

Business operation monitoring:
- Booking lifecycle dashboard
- Search performance dashboard
- CRM lead activity dashboard

### 4.2. Backend API Dashboard

**Panels:**

1. **Request Rate** — `http_requests_total` rate per endpoint
2. **Error Rate** — 5xx responses as % of total requests
3. **Response Time Distribution** — p50, p95, p99 latencies
4. **Active Requests** — Current in-flight requests
5. **Request Duration Heatmap** — Latency distribution over time
6. **Error Breakdown** — Errors by endpoint and status code

**Key Queries:**

```promql
# Request rate (requests per second)
rate(http_requests_total[5m])

# Error rate (%)
sum(rate(http_requests_total{status=~"5.."}[5m])) 
  / sum(rate(http_requests_total[5m])) * 100

# p95 latency
histogram_quantile(0.95, 
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, endpoint))
```

### 4.3. Database Dashboard

**Panels:**

1. **Connection Usage** — Active connections vs. pool size
2. **Query Rate** — Queries per second
3. **Slow Queries** — Queries exceeding threshold (per DB spec § 13)
4. **Transaction Rate** — Commits + rollbacks per second
5. **Deadlock Rate** — Deadlocks detected
6. **Cache Hit Ratio** — Buffer cache effectiveness

### 4.4. Error Monitoring Dashboard

**Panels:**

1. **Error Rate Timeline** — Errors over time by severity
2. **Error Distribution** — Top errors by type
3. **Error Rate by Endpoint** — Which endpoints are failing
4. **Recent Errors** — Last 50 errors with context

### 4.5. Booking Lifecycle Dashboard

**Panels:**

1. **Booking Creation Rate** — Bookings created per hour
2. **Booking State Distribution** — Current bookings by status
3. **State Transition Flow** — Sankey diagram of status changes
4. **Booking Creation Success Rate** — % of successful creations
5. **Average Time in Each State** — Duration analysis

### 4.6. Frontend Performance Dashboard

**Panels:**

1. **Core Web Vitals** — LCP, FID, CLS trends
2. **TTFB Distribution** — Server response time percentiles
3. **JavaScript Errors** — Error rate and types
4. **Page Load Time** — Full page load distribution

---

## 5. Alert Signals

> **IMPORTANT:** This section defines **WHAT conditions should trigger alerts**, not **WHAT THE THRESHOLDS ARE**. Specific threshold values are environment-defined and managed by SRE/Operations.

### 5.1. Notification Channels

**Supported Channels:**

- Slack (recommended for MVP)
- Email
- Telegram (optional)
- PagerDuty / Opsgenie (post-MVP)

**Configuration:**

Alertmanager routes alerts based on severity and team:

```yaml
# alertmanager.yml (example structure)
route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'team-alerts'
  
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'
      continue: true
    
    - match:
        severity: warning
      receiver: 'warning-alerts'

receivers:
  - name: 'team-alerts'
    slack_configs:
      - api_url: '${SLACK_WEBHOOK_URL}'
        channel: '#alerts'
```

### 5.2. Alert Signal Definitions

**Critical Alerts — Immediate Response Required**

| Alert Name | Condition (Conceptual) | Description |
|-----------|------------------------|-------------|
| `HighErrorRate` | Error rate exceeds critical threshold | Service degradation detected |
| `APIDown` | No successful requests in time window | Complete service outage |
| `DatabaseConnectionPoolExhausted` | Available connections below critical threshold | Database overload |
| `HighLatency` | p95 latency exceeds critical threshold | Severe performance degradation |
| `DiskSpaceCritical` | Disk usage above critical threshold | Imminent disk full |

**Warning Alerts — Investigation Required**

| Alert Name | Condition (Conceptual) | Description |
|-----------|------------------------|-------------|
| `ElevatedErrorRate` | Error rate above baseline but below critical | Elevated error rate detected |
| `SlowResponseTime` | p95 latency elevated but below critical | Performance degradation |
| `DatabaseSlowQueries` | Slow query count elevated | Database performance issue |
| `HighMemoryUsage` | Memory usage elevated | Potential memory leak |
| `CacheMissRateHigh` | Cache hit rate below threshold | Cache ineffectiveness |

**Informational Alerts — Awareness Only**

| Alert Name | Condition (Conceptual) | Description |
|-----------|------------------------|-------------|
| `NewDeployment` | Deployment event detected | New version deployed |
| `ConfigurationChange` | Configuration updated | Config change detected |
| `ScheduledMaintenance` | Maintenance window active | Planned maintenance |

### 5.3. Alert Definitions (Prometheus Rules)

**Example Alert Structure (Thresholds Parameterized):**

```yaml
# prometheus/alerts/backend-alerts.yml
groups:
  - name: backend-alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m])) 
            / sum(rate(http_requests_total[5m])) * 100 
            > ${CRITICAL_ERROR_RATE_THRESHOLD}
        for: 5m
        labels:
          severity: critical
          component: backend-api
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} (threshold: ${CRITICAL_ERROR_RATE_THRESHOLD}%)"
      
      - alert: HighLatency
        expr: |
          histogram_quantile(0.95, 
            sum(rate(http_request_duration_seconds_bucket[5m])) by (le, endpoint)
          ) > ${CRITICAL_LATENCY_THRESHOLD}
        for: 10m
        labels:
          severity: critical
          component: backend-api
        annotations:
          summary: "High latency detected on {{ $labels.endpoint }}"
          description: "p95 latency is {{ $value }}s (threshold: ${CRITICAL_LATENCY_THRESHOLD}s)"
      
      - alert: DatabaseConnectionPoolHigh
        expr: |
          pg_stat_activity_count 
            / ${DB_MAX_CONNECTIONS} * 100 
            > ${DB_CONNECTION_POOL_WARNING_THRESHOLD}
        for: 5m
        labels:
          severity: warning
          component: database
        annotations:
          summary: "Database connection pool usage high"
          description: "Connection pool at {{ $value | humanizePercentage }}"
```

**Threshold Variables (Environment-Defined):**

```bash
# .env.monitoring
CRITICAL_ERROR_RATE_THRESHOLD=5          # Configurable
CRITICAL_LATENCY_THRESHOLD=2.0           # Configurable
DB_CONNECTION_POOL_WARNING_THRESHOLD=70  # Configurable
DB_MAX_CONNECTIONS=100                   # From DB spec
```

### 5.4. Escalation Policy

> **Reference:** For detailed incident response procedures, see **Security & Compliance Plan MVP v1 § 10**.

**Escalation Levels (Conceptual):**

| Severity | Initial Response Time | Escalation Path |
|----------|----------------------|-----------------|
| **CRITICAL** | Environment-defined (e.g., <15 min) | On-call engineer → Engineering Lead → CTO |
| **WARNING** | Environment-defined (e.g., <1 hour) | Engineering team via Slack |
| **INFO** | Environment-defined (e.g., <24 hours) | Log for review |

**Incident Phases:**

Refer to **Security & Compliance Plan § 10.2** for full incident lifecycle:
1. DETECTION
2. TRIAGE
3. CONTAINMENT
4. ERADICATION
5. RECOVERY
6. POST_INCIDENT

---

## 6. Observability Best Practices

### 6.1. SRE Principles

**Key Concepts:**

1. **Service Level Indicators (SLIs)** — Measurable metrics of service quality
2. **Service Level Objectives (SLOs)** — Target values for SLIs
3. **Service Level Agreements (SLAs)** — Contractual commitments based on SLOs
4. **Error Budget** — Acceptable failure rate derived from SLO

**SLI Definition Methodology:**

For each critical user journey or service:
1. Identify the key quality metric (availability, latency, correctness)
2. Define how to measure it (what queries/calculations)
3. Set a target objective (SLO)
4. Calculate error budget from SLO

**Example SLI/SLO Framework (Values Environment-Defined):**

```typescript
interface SLO {
  name: string;
  sli_metric: string;              // Prometheus query
  target_percentage: number;       // Environment-defined (e.g., 99.5)
  measurement_window_hours: number; // Environment-defined (e.g., 24)
  alert_threshold: number;         // When to alert (e.g., 99.0)
}

// Example (actual values configured per environment)
const exampleSLO: SLO = {
  name: "Search API Availability",
  sli_metric: "sum(rate(http_requests_total{endpoint='/api/warehouses/search'}[1h]))",
  target_percentage: process.env.SEARCH_API_SLO_TARGET, // e.g., 99.5
  measurement_window_hours: 24,
  alert_threshold: process.env.SEARCH_API_ALERT_THRESHOLD, // e.g., 99.0
};
```

### 6.2. Error Budget Tracking

**Error Budget Calculation:**

```
Error Budget = (1 - SLO) × Total Requests
```

**Example (Conceptual):**

If SLO is 99.5% availability over 24 hours:
- Allowed error rate: 0.5%
- For 1,000,000 requests: 5,000 errors allowed
- If you've had 2,500 errors: 50% of budget consumed

**Error Budget Dashboard Panel:**

```promql
# Error budget consumption (%)
(1 - (
  sum(rate(http_requests_total{status!~"5.."}[24h])) 
    / sum(rate(http_requests_total[24h]))
)) / (1 - ${SLO_TARGET})
```

### 6.3. Observability Maturity

**Level 1: Basic (MVP)** ✅
- Core metrics collected
- Basic dashboards available
- Critical alerts defined
- Manual investigation via logs

**Level 2: Intermediate (Post-MVP)**
- Distributed tracing enabled
- Automated anomaly detection
- Proactive alerting based on trends
- SLO tracking automated

**Level 3: Advanced (Future)**
- Full-stack observability
- AI-driven root cause analysis
- Predictive alerting
- Automated remediation

---

## 7. Monitoring Infrastructure

### 7.1. Prometheus Configuration

**Basic Prometheus Setup:**

```yaml
# prometheus.yml
global:
  scrape_interval: ${SCRAPE_INTERVAL}     # Configurable (e.g., 15s)
  evaluation_interval: ${EVAL_INTERVAL}   # Configurable (e.g., 15s)
  
scrape_configs:
  # Backend API
  - job_name: 'backend-api'
    static_configs:
      - targets: ['backend-api:3000']
    metrics_path: '/metrics'
  
  # PostgreSQL
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
  
  # Redis
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
  
  # Nginx
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']
  
  # Node Exporter (system metrics)
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']

# Load alert rules
rule_files:
  - "/etc/prometheus/alerts/*.yml"
```

**Storage Configuration:**

```bash
# Prometheus command-line flags (configurable)
--storage.tsdb.path=/prometheus
--storage.tsdb.retention.time=${PROMETHEUS_RETENTION_TIME}  # e.g., 30d
--storage.tsdb.retention.size=${PROMETHEUS_RETENTION_SIZE}  # e.g., 10GB
```

### 7.2. Grafana Setup

**Data Source Configuration:**

```yaml
# grafana/provisioning/datasources/prometheus.yml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
  
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
  
  - name: Jaeger
    type: jaeger
    access: proxy
    url: http://jaeger:16686
```

### 7.3. Loki Configuration

> **Reference:** For log structure, levels, and retention policies, see **Logging Strategy & Log Taxonomy MVP v1**.

**Basic Loki Setup:**

```yaml
# loki/loki-config.yml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2024-01-01
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb_shipper:
    active_index_directory: /loki/index
    cache_location: /loki/cache
    shared_store: filesystem
  filesystem:
    directory: /loki/chunks

limits_config:
  retention_period: ${LOKI_RETENTION_PERIOD}  # Environment-defined (e.g., 14d)
```

### 7.4. Promtail Configuration

**Log Collection Setup:**

```yaml
# promtail/promtail-config.yml
server:
  http_listen_port: 9080

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  # Application logs
  - job_name: backend-api
    static_configs:
      - targets:
          - localhost
        labels:
          job: backend-api
          __path__: /var/log/backend-api/*.log
    pipeline_stages:
      - json:
          expressions:
            level: level
            message: message
            trace_id: trace_id
      - labels:
          level:
          trace_id:
  
  # Docker container logs
  - job_name: docker
    static_configs:
      - targets:
          - localhost
        labels:
          job: docker
          __path__: /var/lib/docker/containers/*/*-json.log
    pipeline_stages:
      - json:
          expressions:
            log: log
            stream: stream
```

### 7.5. Exporters Setup

**PostgreSQL Exporter:**

```bash
docker run -d \
  --name postgres-exporter \
  -e DATA_SOURCE_NAME="postgresql://exporter_user:${POSTGRES_EXPORTER_PASSWORD}@postgres:5432/selfstorage?sslmode=disable" \
  -p 9187:9187 \
  prometheuscommunity/postgres-exporter:latest
```

**Redis Exporter:**

```bash
docker run -d \
  --name redis-exporter \
  -e REDIS_ADDR="redis:6379" \
  -e REDIS_PASSWORD="${REDIS_PASSWORD}" \
  -p 9121:9121 \
  oliver006/redis_exporter:latest
```

**Nginx Exporter:**

```bash
docker run -d \
  --name nginx-exporter \
  -p 9113:9113 \
  nginx/nginx-prometheus-exporter:latest \
  -nginx.scrape-uri=http://nginx:8080/stub_status
```

**Node Exporter:**

```bash
docker run -d \
  --name node-exporter \
  -p 9100:9100 \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  -v /:/rootfs:ro \
  prom/node-exporter:latest \
  --path.procfs=/host/proc \
  --path.sysfs=/host/sys \
  --path.rootfs=/rootfs
```

---

## 8. Integration Points

### 8.1. Integration with Logging Strategy

**Cross-Reference:** **Logging Strategy & Log Taxonomy MVP v1**

**Key Integration Points:**

1. **Log Levels** — Defined in Logging Strategy § 4
2. **Log Structure** — JSON format per Logging Strategy § 5
3. **Correlation IDs** — `trace_id` and `request_id` per Logging Strategy § 3
4. **PII Masking** — Masking rules per Logging Strategy § 4.3
5. **Retention Policies** — Log retention per Logging Strategy § 6

**Observability Plan Scope:**
- Defines HOW to collect and aggregate logs (Loki/Promtail)
- References Logging Strategy for WHAT to log and HOW to structure logs

### 8.2. Integration with Security & Compliance Plan

**Cross-Reference:** **Security & Compliance Plan MVP v1**

**Key Integration Points:**

1. **Incident Response** — Incident procedures in Security Plan § 10
2. **Escalation Policies** — Escalation matrix in Security Plan § 10.3
3. **Security Monitoring** — Security event logging in Security Plan § 4.4
4. **Breach Notification** — Data breach procedures in Security Plan § 10.6

**Observability Plan Scope:**
- Defines observability signals that trigger incident response
- References Security Plan for incident handling procedures

### 8.3. Integration with Error Handling Specification

**Cross-Reference:** **Error Handling & Fault Tolerance Specification MVP v1**

**Key Integration Points:**

1. **Error → Log → Alert Mapping** — Defined in Error Handling Spec § 11.1
2. **Retry Logic** — Retry metrics and observability in Error Handling Spec § 7
3. **Circuit Breakers** — Circuit breaker state metrics in Error Handling Spec § 6

**Observability Plan Scope:**
- Defines metrics for error rates and patterns
- References Error Handling Spec for error categorization and retry behavior

### 8.4. Integration with API Rate Limiting

**Cross-Reference:** **API Rate Limiting & Throttling Specification MVP v1**

**Key Integration Points:**

1. **Rate Limit Metrics** — Rate limit hit counters
2. **Throttling Signals** — Alert when rate limits frequently exceeded
3. **Quota Tracking** — External API quota consumption

**Observability Plan Scope:**
- Defines metrics for rate limit enforcement
- Tracks quota consumption for external dependencies (Maps API, Claude API)

---

## Appendix A: Example SLOs (Non-Normative)

> **IMPORTANT:** The values in this appendix are **EXAMPLES ONLY** and are **NOT NORMATIVE**. Actual SLO values must be defined per environment based on business requirements, infrastructure capacity, and operational experience.

### Example SLO Definitions

| Service | SLI Metric | Example Target | Example Alert Threshold | Notes |
|---------|-----------|----------------|-------------------------|-------|
| Overall API | Availability | 99.5% | 99.0% | Example only |
| Search Endpoint | Latency (p95) | < 500ms | < 800ms | Example only |
| Booking Endpoint | Success Rate | 99.0% | 98.5% | Example only |
| Database | Connection Pool | < 80% used | > 90% used | Example only |
| Redis | Cache Hit Rate | > 85% | < 70% | Example only |

### Example Alert Thresholds

| Metric | Example Dev | Example Staging | Example Prod | Notes |
|--------|-------------|-----------------|--------------|-------|
| Error Rate | > 10% | > 5% | > 2% | Example only |
| p95 Latency | > 2s | > 1s | > 500ms | Example only |
| CPU Usage | > 90% | > 85% | > 80% | Example only |
| Memory Usage | > 90% | > 85% | > 80% | Example only |
| Disk Usage | > 90% | > 85% | > 80% | Example only |

---

## Appendix B: Quick Reference

### Key Prometheus Queries

```promql
# Error rate (%)
sum(rate(http_requests_total{status=~"5.."}[5m])) 
  / sum(rate(http_requests_total[5m])) * 100

# p95 latency
histogram_quantile(0.95, 
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# Request rate (requests per second)
sum(rate(http_requests_total[5m]))

# CPU usage (%)
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage (%)
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disk usage (%)
(1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100
```

### Key LogQL Queries

```logql
# All errors
{service="backend-api"} | json | level="error"

# Logs by trace ID
{service="backend-api"} | json | trace_id="your-trace-id"

# HTTP 500 errors
{service="nginx"} | json | status="500"

# Error count by message
sum by (message) (count_over_time({service="backend-api"} | json | level="error" [1h]))
```

---

## Document Metadata

**Document Classification:** Canonical Observability Contract  
**Version:** 1.1 (CANONICAL)  
**Status:** Canonical  
**Maintained by:** Platform Team  
**Review Frequency:** Quarterly or upon major infrastructure changes  
**Next Scheduled Review:** March 2026

### Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-06 | Initial version | Platform Team |
| 1.1 | 2025-12-15 | CANONICAL refactor: removed hard SLO/SLA, made thresholds configurable, de-duplicated logging/security, removed business analytics, added positioning | Platform Team |

### Related Documents

- **Logging Strategy & Log Taxonomy MVP v1** — Log structure, levels, retention
- **Security & Compliance Plan MVP v1** — Incident response, escalation, breach procedures
- **Error Handling & Fault Tolerance Specification MVP v1** — Error categorization, retry logic
- **API Rate Limiting & Throttling Specification MVP v1** — Rate limit metrics
- **Technical Architecture Document MVP v1** — System architecture and components
- **Backend Implementation Plan MVP v1** — Service structure and layering

---

**END OF DOCUMENT**

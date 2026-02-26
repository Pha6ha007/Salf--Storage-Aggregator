# Project Structure — Self-Storage Aggregator
# Where every file lives and why

```
storagecompare/
│
├── CLAUDE.md                          ← ROOT (Claude Code reads this automatically)
│                                         Master instructions for ALL AI agents
│
├── .cursorrules                       ← Cursor reads this automatically
│                                         (copy key rules from CLAUDE.md)
│
├── docs/                              ← ALL 100+ specification documents
│   ├── core/                          ← Tier 1: canonical specs (highest priority)
│   │   ├── Functional_Specification_MVP_v1.md
│   │   ├── Technical_Architecture_Document_MVP_v1_CANONICAL.md
│   │   ├── api_design_blueprint_mvp_v1_CANONICAL.md
│   │   ├── full_database_specification_mvp_v1_CANONICAL.md
│   │   └── backend_implementation_plan_mvp_v1_CANONICAL.md
│   │
│   ├── security/                      ← Tier 2: security & non-functional
│   │   ├── Security_and_Compliance_Plan_MVP_v1.md
│   │   ├── API_Rate_Limiting_Throttling_Specification.md
│   │   ├── Error_Handling_Fault_Tolerance_Specification.md
│   │   └── Logging_Strategy_CANONICAL.md
│   │
│   ├── features/                      ← Tier 3: feature specs
│   │   ├── AI_Core_Design_MVP_v1_CANONICAL.md
│   │   ├── Booking_Flow_Technical_Specification.md
│   │   ├── CRM_Lead_Management_System.md
│   │   ├── DOC-097_Payment_Billing_Integration.md
│   │   └── DOC-092_Warehouse_Quality_Score.md
│   │
│   ├── frontend/                      ← Tier 4: frontend & UX
│   │   ├── Frontend_Architecture_Specification.md
│   │   ├── DOC-048_Frontend_Performance_Optimization.md
│   │   ├── DOC-049_Frontend_SEO_Strategy.md
│   │   └── Design_System_Overview.md
│   │
│   ├── infrastructure/                ← Tier 5: ops & infra
│   │   ├── DOC-042_Disaster_Recovery.md
│   │   ├── DOC-052_Infrastructure_as_Code.md
│   │   ├── Monitoring_and_Observability.md
│   │   ├── Configuration_Management_Strategy.md
│   │   └── DOC-043_Distributed_tracing.md
│   │
│   ├── legal/                         ← Tier 6: business & legal
│   │   ├── Legal_Documentation_Unified_Guide.md
│   │   ├── DOC-054_Legal_Checklist.md
│   │   ├── DOC-060_Operator_Agreement.md
│   │   └── DOC-106_Trust_Safety_Framework.md
│   │
│   ├── multi-region/                  ← Tier 7: scaling
│   │   ├── DOC-058_Multi_Country_Scaling.md
│   │   └── DOC-059_Multi_Region_Technical.md
│   │
│   ├── operations/                    ← Tier 8: supporting
│   │   ├── Backup_and_Restore_Playbook.md
│   │   ├── support_maintenance_playbook.md
│   │   ├── release_management_versioning.md
│   │   ├── team_engineering_process_guidelines.md
│   │   └── User_Operator_Documentation.md
│   │
│   └── data/                          ← Data dictionary & glossary
│       ├── unified_data_dictionary_mvp_v1.csv
│       └── unified_glossary.md
│
├── guides/                            ← HOW-TO guides (for humans & AI)
│   ├── WORKFLOW_GUIDE.md              ← ✅ WORKFLOW GUIDE GOES HERE
│   ├── MIGRATION_CHECKLIST.md         ← Track progress of RU→UAE migration
│   └── DEVELOPMENT_QUICKSTART.md      ← How to start coding (future)
│
├── agents/                            ← 🤖 AI Agent configurations (future)
│   ├── README.md                      ← Agent architecture overview
│   ├── agent-docs-migrator.md         ← Agent: document migration
│   ├── agent-backend-builder.md       ← Agent: NestJS backend
│   ├── agent-frontend-builder.md      ← Agent: Next.js frontend
│   ├── agent-qa-validator.md          ← Agent: testing & validation
│   └── agent-devops.md                ← Agent: infrastructure & CI/CD
│
├── scripts/                           ← Automation scripts
│   ├── migrate-region.sh              ← Phase 1 automated replacements
│   ├── validate-migration.sh          ← Phase 3 validation checks
│   └── check-cross-refs.sh            ← Verify doc cross-references
│
├── src/                               ← Application source code (future)
│   ├── backend/                       ← NestJS monolith
│   └── frontend/                      ← Next.js app
│
├── infrastructure/                    ← IaC (future)
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
│
└── .github/
    └── workflows/                     ← CI/CD (future)
```

## Key Rules

### What Claude Code reads automatically:
- `CLAUDE.md` in project root — ALWAYS loaded as system context

### What Cursor reads automatically:
- `.cursorrules` in project root — ALWAYS loaded as system context

### What agents reference:
- Each agent file in `agents/` points to specific docs in `docs/`
- Agents never modify `docs/core/` without explicit approval
- Agents always validate against `docs/data/unified_data_dictionary.csv`

### Document hierarchy (conflict resolution):
```
docs/core/     → highest priority (canonical source of truth)
docs/security/ → security & compliance rules
docs/features/ → feature behavior
docs/frontend/ → UI/UX rules
Everything else → supporting context
```

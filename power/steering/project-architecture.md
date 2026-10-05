---
inclusion: always
---

# Project Architecture & Structure

## Overview

Full-stack TypeScript monorepo with two packages:
- `backend/` — Express REST API (port 3001)
- `frontend/` — Vite + React SPA (port 5173)

The `.kiro/` directory contains all Kiro configuration: specs, steering, hooks, agents, and settings.

---

## Directory Structure

```
your-project/
├── .kiro/
│   ├── specs/          # Lesson 1: EARS-notation requirements
│   ├── steering/       # Lesson 2: Always-loaded coding conventions
│   ├── hooks/          # Lesson 3: Event-triggered automations
│   ├── settings/       # Lesson 5: MCP server configuration
│   └── agents/         # Lesson 6: Custom agent definitions
├── backend/
│   ├── src/
│   │   ├── index.ts        # App entry point
│   │   ├── types.ts        # Shared domain types
│   │   ├── taskStore.ts    # In-memory store + business logic
│   │   └── routes/
│   │       └── tasks.ts    # REST route handlers
│   └── tests/
│       ├── taskStore.test.ts   # Unit tests
│       └── pbt.test.ts         # Property-based tests (Lesson 4)
├── frontend/
│   └── src/
│       ├── App.tsx         # Root component + state
│       ├── api.ts          # API client (never call fetch directly in components)
│       ├── types.ts        # Shared TS types
│       └── components/     # One file per component
└── power/                  # This Kiro Power
```

---

## API Design Rules

- All endpoints follow REST conventions
- Every response uses `ApiResponse<T>` envelope: `{ success: boolean, data?: T, error?: string }`
- Errors must include meaningful messages — never expose stack traces
- HTTP status codes must be semantically correct (201 create, 404 not found, 400 bad input)
- **Always register static routes (e.g. `/stats`) before dynamic ones (e.g. `/:id`)**

---

## Frontend Patterns

- API calls go through `src/api.ts` only — never call `fetch` directly in components
- State lives in the top-level `App.tsx`, passed down as props
- No external UI libraries — plain CSS with CSS variables for theming
- One file per component in `src/components/`

---

## Testing Strategy

- Unit tests in `tests/taskStore.test.ts` — example-based, cover normal + error paths
- Property-based tests in `tests/pbt.test.ts` — fast-check, verify invariants for any input
- Run all tests: `npm run test:run` from `backend/`

---

## Hook Automation

Three hooks run automatically:

| Hook | Trigger | What it does |
|------|---------|-------------|
| `lint-on-ts-save` | PostFileSave `.ts/.tsx` | Runs `tsc --noEmit` |
| `test-on-src-save` | PostFileSave `backend/src/` | Runs full test suite |
| `spec-alignment-check` | SessionStart | Reviews spec, flags unimplemented requirements |

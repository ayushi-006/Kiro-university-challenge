---
inclusion: always
---

# Project Architecture & Structure

## Overview

This is a full-stack TypeScript monorepo with two packages:
- `backend/` — Express REST API (port 3001)
- `frontend/` — Vite + React SPA (port 5173)

The `.kiro/` directory contains all Kiro configuration: specs, steering, hooks, agents, and settings.

---

## Directory Structure

```
kiro-task-manager/
├── .kiro/
│   ├── specs/          # Lesson 1: Spec-driven requirements (EARS notation)
│   ├── steering/       # Lesson 2: Coding conventions (always-loaded)
│   ├── hooks/          # Lesson 3: Event-triggered automations
│   ├── settings/       # Lesson 5: MCP server configuration
│   └── agents/         # Lesson 6: Custom agent definitions
├── backend/
│   ├── src/
│   │   ├── index.ts        # App entry point
│   │   ├── types.ts        # Shared domain types
│   │   ├── taskStore.ts    # In-memory store with business logic
│   │   └── routes/
│   │       └── tasks.ts    # REST route handlers
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx        # React entry point
│   │   ├── App.tsx         # Root component with routing
│   │   ├── types.ts        # Shared TS types (mirrors backend)
│   │   ├── api.ts          # API client (fetch wrapper)
│   │   └── components/     # React UI components
│   ├── package.json
│   └── vite.config.ts
└── tests/
    ├── taskStore.test.ts   # Unit tests
    └── pbt.test.ts         # Property-based tests (Lesson 4)
```

---

## API Design Principles

- All endpoints follow REST conventions.
- Every response uses the `ApiResponse<T>` envelope: `{ success: boolean, data?: T, error?: string }`.
- Errors must include meaningful messages (never expose stack traces).
- HTTP status codes must be semantically correct (201 for create, 404 for not found, etc.).

---

## Frontend Patterns

- API calls go through `src/api.ts` only — never call `fetch` directly in components.
- State lives in the top-level `App.tsx` and is passed down as props.
- No external UI libraries — plain CSS with CSS variables for theming.
- Components go in `src/components/`, one file per component.

---

## Testing Strategy

- Unit tests for `TaskStore` methods live in `tests/taskStore.test.ts`.
- Property-based tests (PBT) using `fast-check` live in `tests/pbt.test.ts`.
- PBT tests verify invariants: filter idempotency, sort stability, stats consistency.
- Tests run via `npm test` from the `backend/` directory.

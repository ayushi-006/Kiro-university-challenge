---
name: task-manager-power
version: 1.0.0
description: A Kiro Power for building spec-driven full-stack TypeScript task management apps. Bundles TypeScript conventions, architecture patterns, and property-based testing workflows.
keywords:
  - task manager
  - task management
  - todo app
  - rest api
  - typescript
  - express
  - react
  - property-based testing
  - fast-check
activation: keyword
steering:
  - steering/typescript-conventions.md
  - steering/project-architecture.md
---

# Task Manager Power

This Power gives Kiro everything it needs to build, extend, and maintain a full-stack TypeScript task management app — spec-first, steered, and property-tested.

## What's included

| File | Purpose |
|------|---------|
| `steering/typescript-conventions.md` | Strict TS rules: typing, error handling, naming, immutability |
| `steering/project-architecture.md` | Folder layout, API design rules, frontend patterns, hook setup |

## When it activates

Mention any of: *task manager, task management, todo, REST API, TypeScript, Express, React, property-based testing, fast-check* — and this Power loads automatically.

## What Kiro will do on activation

1. Load TypeScript conventions — strict types, error handling, naming rules
2. Load architecture guide — folder structure, API envelope pattern, route ordering rules
3. Remind you to write your spec in `.kiro/specs/` before writing any code
4. Suggest the three automation hooks: lint on save, tests on save, spec check on session start

## Project structure this Power assumes

```
your-project/
├── .kiro/
│   ├── specs/       # EARS-notation requirements (write this first)
│   ├── steering/    # Conventions from this Power
│   ├── hooks/       # Lint + test automation
│   ├── settings/    # MCP server config
│   └── agents/      # Custom review + test agents
├── backend/         # Express + TypeScript API (port 3001)
├── frontend/        # Vite + React SPA (port 5173)
└── backend/tests/   # Unit tests + property-based tests
```

## Quick start

Ask Kiro:
> "Use the task-manager-power to scaffold a new task management app"

Kiro will walk you through writing the spec, setting up steering, implementing the API, and adding property-based tests.

---

*Built for the Kiro University Challenge 2026 · #KiroUniversity #BuildWithKiro*

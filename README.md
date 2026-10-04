# Kiro Task Manager 🗂️

> **Kiro University Challenge 2026 — Final Exam Submission**  
> A full-stack task management app built spec-first with Kiro, demonstrating all 7 required lessons.

[![Kiro University 2026](https://img.shields.io/badge/Kiro_University-2026-6366f1?style=flat)](https://kiro.dev/2026/university/)

---

## What It Does

A working full-stack task manager with:
- Create, read, update, and delete tasks
- Filter by status, priority, and tag — plus full-text search
- Live stats dashboard (total, todo, in-progress, done, high-priority, overdue)
- Clean dark-mode UI, fully responsive

**Stack:** React 18 + TypeScript (frontend) · Express + TypeScript (backend) · In-memory store · fast-check PBT

---

## Quick Start

```bash
# 1. Install dependencies
npm run install:all

# 2. Start the backend (terminal 1)
npm run dev:backend       # http://localhost:3001

# 3. Start the frontend (terminal 2)
npm run dev:frontend      # http://localhost:5173

# 4. Run all tests
npm run test:run
```

---

## Kiro Lessons Demonstrated

### Lesson 1 — Spec-Driven Development 📋
**File:** `.kiro/specs/task-manager.md`

The entire app was built from a spec written in **EARS notation** (Easy Approach to Requirements Syntax):
- `WHEN … THE SYSTEM SHALL …` for every feature: task creation, filtering, stats, API contract
- The spec drove the TypeScript types (`types.ts`), validation logic (`taskStore.ts`), and route handlers
- Every requirement maps 1:1 to code

### Lesson 2 — Steering Documents 🧭
**Files:** `.kiro/steering/typescript-conventions.md`, `.kiro/steering/project-architecture.md`

Two always-loaded steering files enforce consistent patterns across all sessions:
- `typescript-conventions.md` — strict typing, interfaces vs types, null safety, error handling, naming rules
- `project-architecture.md` — directory structure, API design, frontend patterns, testing strategy

### Lesson 3 — Hooks ⚡
**Files:** `.kiro/hooks/`

Three hooks automate quality checks:
| Hook | Trigger | Action |
|------|---------|--------|
| `lint-on-ts-save` | `PostFileSave` on `.ts/.tsx` | Runs `tsc --noEmit` to catch type errors |
| `test-on-src-save` | `PostFileSave` on `backend/src/` | Runs the full test suite |
| `spec-alignment-check` | `SessionStart` | Agent reviews the spec and flags unimplemented requirements |

### Lesson 4 — Property-Based Testing (PBT) 🧪
**File:** `tests/pbt.test.ts`

Uses **fast-check** to verify invariants that hold for *any* generated input — not just hand-picked examples. 20+ property tests covering:
- Creation invariants (UUID format, default fields, title trimming)
- Filter invariants (filter results ⊆ all results, status filter only returns matching tasks)
- Sort invariant (list is always newest-first)
- Stats invariant (todo + in_progress + done always equals total)
- Delete invariant (stats.total decreases by exactly 1)

```bash
npm run test:run   # runs unit tests + PBT together
```

### Lesson 5 — MCP (Model Context Protocol) 🔌
**File:** `.kiro/settings/mcp.json`

Three MCP servers configured:
- **`aws-docs`** — AWS Documentation server for referencing AWS services during development
- **`github`** — GitHub MCP server for repo and PR management directly in Kiro
- **`filesystem`** — Filesystem server scoped to the project directory

### Lesson 6 — Custom Agents 🤖
**Files:** `.kiro/agents/`

Two purpose-built agents:
- **`code-reviewer`** — TypeScript code review agent that checks against steering conventions and spec requirements. Read-only tools only (`read_file`, `grep_search`, `list_directory`).
- **`test-writer`** — Specialised agent for writing PBT and unit tests using fast-check + Jest. Has write access to the tests directory.

### Lesson 7 — Kiro CLI 💻
This project was initialized and developed using the **Kiro CLI**:
```bash
# Project was scaffolded and managed via Kiro CLI
kiro init
kiro spec          # generated spec from requirements
kiro steer         # applied steering across sessions
kiro agent run code-reviewer   # invoked custom agent for review
```

---

## Project Structure

```
kiro-task-manager/
├── .kiro/
│   ├── specs/
│   │   └── task-manager.md          # Lesson 1: EARS spec
│   ├── steering/
│   │   ├── typescript-conventions.md # Lesson 2: Code style
│   │   └── project-architecture.md   # Lesson 2: Architecture guide
│   ├── hooks/
│   │   ├── lint-on-ts-save.json      # Lesson 3: TS lint on save
│   │   ├── test-on-src-save.json     # Lesson 3: Tests on save
│   │   └── spec-alignment-check.json # Lesson 3: Spec review on start
│   ├── settings/
│   │   └── mcp.json                  # Lesson 5: MCP server config
│   └── agents/
│       ├── code-reviewer.json        # Lesson 6: Review agent
│       └── test-writer.json          # Lesson 6: Test writing agent
├── backend/
│   └── src/
│       ├── index.ts          # Express app entry point
│       ├── types.ts          # Domain types (from spec)
│       ├── taskStore.ts      # Business logic + in-memory store
│       └── routes/tasks.ts   # REST API routes
├── frontend/
│   └── src/
│       ├── App.tsx           # Root component + state
│       ├── api.ts            # API client
│       ├── types.ts          # Shared types
│       └── components/       # StatsBar, TaskCard, CreateTaskForm, FilterBar
└── tests/
    ├── taskStore.test.ts     # Unit tests
    └── pbt.test.ts           # Property-based tests (Lesson 4)
```

---

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/tasks` | List tasks (supports `?status`, `?priority`, `?tag`, `?search`) |
| `GET` | `/api/tasks/stats` | Get aggregate stats |
| `GET` | `/api/tasks/:id` | Get a single task |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/health` | Health check |

All responses use the envelope: `{ "success": boolean, "data": T, "error": string }`

---

## Built With Kiro

This project was built using [Kiro](https://kiro.dev) as the primary development tool — spec first, then steered, hooked, tested with PBT, and extended with MCP + custom agents.

`#KiroUniversity` `#BuildWithKiro`

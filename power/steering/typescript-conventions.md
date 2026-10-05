---
inclusion: always
---

# TypeScript & Code Conventions

These conventions apply to all TypeScript files in this project. Kiro must follow these rules when generating or modifying code.

---

## 1. TypeScript Strictness

Always use `strict: true`. All functions must have explicit return types.

```typescript
// ✅ Good
function getTaskById(id: string): Task | null {
  return store.get(id) ?? null;
}

// ❌ Bad
function getTaskById(id) {
  return store.get(id);
}
```

---

## 2. Interfaces over Type Aliases for Object Shapes

Use `interface` for object/data shapes, `type` for unions.

```typescript
// ✅ Good
interface Task {
  id: string;
  title: string;
}
type Priority = 'low' | 'medium' | 'high';
```

---

## 3. Null Safety

Prefer `null` over `undefined` for intentionally absent values. Use `??` not `||`.

```typescript
// ✅ Good
const due = task.dueDate ?? null;
```

---

## 4. Error Handling

Always wrap route handlers in try/catch. Never expose stack traces in responses.

```typescript
// ✅ Good
try {
  const task = store.create(req.body);
  res.status(201).json({ success: true, data: task });
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  res.status(400).json({ success: false, error: message });
}
```

---

## 5. Immutability

Prefer `const`. Never mutate function arguments — return new objects.

```typescript
// ✅ Good
const updated: Task = { ...existing, ...changes, updatedAt: now };
```

---

## 6. Naming Conventions

| Construct | Convention | Example |
|---|---|---|
| Variables/functions | camelCase | `createTask` |
| Types/Interfaces | PascalCase | `Task`, `ApiResponse` |
| Constants | UPPER_SNAKE_CASE | `MAX_TITLE_LENGTH` |
| Files | kebab-case | `task-store.ts` |
| React components | PascalCase | `TaskCard.tsx` |

---

## 7. Imports

Group: external packages first, then internal modules, blank line between.

```typescript
import express, { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Task } from '../types';
import { taskStore } from '../taskStore';
```

---

## 8. React Components

Functional components only. Define prop types with `interface`.

```tsx
interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

function TaskCard({ task, onDelete }: TaskCardProps): JSX.Element {
  return <div>{task.title}</div>;
}
```

---
inclusion: always
---

# TypeScript & Code Conventions

These conventions apply to all TypeScript files in this project. Kiro must follow these rules when generating or modifying code.

---

## 1. TypeScript Strictness

Always use `strict: true`. All functions must have explicit return types — never rely on inference alone.

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

Use `interface` for object/data shapes, `type` for union/intersection types.

```typescript
// ✅ Good
interface Task {
  id: string;
  title: string;
}

type Priority = 'low' | 'medium' | 'high';

// ❌ Bad — using type for object shapes
type Task = {
  id: string;
  title: string;
};
```

---

## 3. Null Safety

Prefer `null` over `undefined` for intentionally absent values. Use nullish coalescing (`??`) instead of `||` when the falsy check should only cover null/undefined.

```typescript
// ✅ Good
const due = task.dueDate ?? null;

// ❌ Bad (treats "" and 0 as absent)
const due = task.dueDate || null;
```

---

## 4. Error Handling

Always wrap Express route handlers in try/catch. Throw typed errors with descriptive messages.

```typescript
// ✅ Good
router.post('/', (req, res) => {
  try {
    const task = store.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ success: false, error: message });
  }
});
```

---

## 5. Immutability

Prefer `const` over `let`. Never mutate function arguments; return new objects.

```typescript
// ✅ Good
const updated: Task = { ...existing, ...changes, updatedAt: now };

// ❌ Bad
existing.title = changes.title;
```

---

## 6. Naming Conventions

| Construct | Convention | Example |
|---|---|---|
| Variables/functions | camelCase | `createTask`, `taskList` |
| Types/Interfaces | PascalCase | `Task`, `ApiResponse` |
| Constants | UPPER_SNAKE_CASE | `MAX_TITLE_LENGTH` |
| Files | kebab-case | `task-store.ts` |
| React components | PascalCase | `TaskCard.tsx` |

---

## 7. Imports

- Use named imports instead of namespace imports where possible.
- Group imports: external packages first, then internal modules, with a blank line between.

```typescript
// ✅ Good
import express, { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Task, CreateTaskDTO } from '../types';
import { taskStore } from '../taskStore';
```

---

## 8. React Components

- Functional components only — no class components.
- Define prop types with `interface`, not inline.
- Keep components small and single-purpose.

```tsx
// ✅ Good
interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

function TaskCard({ task, onDelete }: TaskCardProps): JSX.Element {
  return <div>{task.title}</div>;
}
```

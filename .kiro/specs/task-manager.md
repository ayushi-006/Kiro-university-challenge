# Spec: Kiro Task Manager

## Overview

A full-stack task management web application that allows users to create, organize, prioritize, and track tasks through their lifecycle. Built with React (frontend), Express + TypeScript (backend), and an in-memory store.

---

## Requirements

### 1. Task Creation

WHEN a user submits a new task with a title  
THE SYSTEM SHALL create a task with a unique UUID, set `status` to `"todo"`, `priority` to `"medium"` if not provided, and record `createdAt` and `updatedAt` timestamps.

WHEN a user submits a task with an empty or missing title  
THE SYSTEM SHALL reject the request with a 400 error and an informative message.

WHEN a user submits a task title exceeding 200 characters  
THE SYSTEM SHALL reject the request with a 400 error.

WHEN a user provides an optional `dueDate`  
THE SYSTEM SHALL validate it is a valid ISO 8601 date string before accepting the task.

---

### 2. Task Retrieval

WHEN a user requests all tasks  
THE SYSTEM SHALL return a list sorted by `createdAt` descending (newest first).

WHEN a user filters tasks by `status`  
THE SYSTEM SHALL return only tasks matching the given status value (`todo`, `in_progress`, or `done`).

WHEN a user filters tasks by `priority`  
THE SYSTEM SHALL return only tasks matching the given priority value (`low`, `medium`, or `high`).

WHEN a user filters tasks by `tag`  
THE SYSTEM SHALL return only tasks whose `tags` array contains the specified tag.

WHEN a user provides a `search` query  
THE SYSTEM SHALL return tasks whose `title` or `description` contains the query string (case-insensitive).

WHEN a user requests a task by ID that does not exist  
THE SYSTEM SHALL return a 404 response with an error message.

---

### 3. Task Updates

WHEN a user sends a PATCH request with valid fields  
THE SYSTEM SHALL merge the changes into the existing task and update `updatedAt` to the current timestamp.

WHEN a user attempts to set `status` to an invalid value  
THE SYSTEM SHALL reject the update with a 400 error.

WHEN a user attempts to update a task that does not exist  
THE SYSTEM SHALL return a 404 response.

---

### 4. Task Deletion

WHEN a user sends a DELETE request for a task that exists  
THE SYSTEM SHALL remove the task permanently and return a success response.

WHEN a user sends a DELETE request for a task that does not exist  
THE SYSTEM SHALL return a 404 response.

---

### 5. Task Statistics

WHEN a user requests task statistics  
THE SYSTEM SHALL return counts for: `total`, `todo`, `in_progress`, `done`, `highPriority`, and `overdue` tasks.

WHEN computing overdue tasks  
THE SYSTEM SHALL count tasks where `dueDate` is in the past and `status` is not `"done"`.

---

### 6. Frontend Dashboard

WHEN a user opens the application  
THE SYSTEM SHALL display a dashboard with a task list, a stats summary, and controls to create and filter tasks.

WHEN a user creates a task via the UI  
THE SYSTEM SHALL show the new task immediately in the list without requiring a page refresh.

WHEN a user marks a task as done  
THE SYSTEM SHALL visually distinguish it from active tasks (e.g., strikethrough, muted color).

WHEN a user deletes a task via the UI  
THE SYSTEM SHALL remove it from the list immediately and update the stats summary.

---

### 7. API Contract

WHEN any API request succeeds  
THE SYSTEM SHALL respond with `{ "success": true, "data": ... }` and an appropriate 2xx HTTP status code.

WHEN any API request fails  
THE SYSTEM SHALL respond with `{ "success": false, "error": "..." }` and an appropriate 4xx or 5xx HTTP status code.

---

## Data Model

```typescript
interface Task {
  id: string;          // UUID v4
  title: string;       // 1–200 characters
  description: string; // optional, defaults to ""
  priority: 'low' | 'medium' | 'high';  // defaults to "medium"
  status: 'todo' | 'in_progress' | 'done';  // defaults to "todo"
  tags: string[];      // optional array of labels
  dueDate: string | null;  // ISO 8601 date or null
  createdAt: string;   // ISO 8601 datetime (set on creation)
  updatedAt: string;   // ISO 8601 datetime (updated on every change)
}
```

---

## Non-Functional Requirements

- The backend API MUST respond within 200ms for all CRUD operations (in-memory store).
- The frontend MUST be responsive and usable on both desktop and mobile screens.
- All TypeScript code MUST use strict mode with explicit return types on all functions.
- All API responses MUST follow the `ApiResponse<T>` envelope format.

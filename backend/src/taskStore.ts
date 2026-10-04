/**
 * In-memory task store with full CRUD operations.
 * Designed per the spec requirements in .kiro/specs/task-manager.md
 */

import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilters, TaskStats, Priority, Status } from './types';

const VALID_PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const VALID_STATUSES: Status[] = ['todo', 'in_progress', 'done'];

export class TaskStore {
  private tasks: Map<string, Task> = new Map();

  /**
   * Create a new task with validation.
   * WHEN a user provides a title THE SYSTEM SHALL create a task with a unique ID.
   */
  create(dto: CreateTaskDTO): Task {
    if (!dto.title || dto.title.trim().length === 0) {
      throw new Error('Task title is required and cannot be empty');
    }
    if (dto.title.trim().length > 200) {
      throw new Error('Task title must not exceed 200 characters');
    }
    if (dto.priority && !VALID_PRIORITIES.includes(dto.priority)) {
      throw new Error(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
    if (dto.dueDate && isNaN(Date.parse(dto.dueDate))) {
      throw new Error('Invalid dueDate format. Must be a valid ISO 8601 date string');
    }

    const now = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      title: dto.title.trim(),
      description: dto.description?.trim() ?? '',
      priority: dto.priority ?? 'medium',
      status: 'todo',
      tags: dto.tags ?? [],
      dueDate: dto.dueDate ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Retrieve a single task by ID.
   * WHEN a user requests a task by ID THE SYSTEM SHALL return the task or null if not found.
   */
  getById(id: string): Task | null {
    return this.tasks.get(id) ?? null;
  }

  /**
   * List all tasks with optional filtering.
   * WHEN a user lists tasks with filters THE SYSTEM SHALL return only matching tasks.
   */
  list(filters: TaskFilters = {}): Task[] {
    let result = Array.from(this.tasks.values());

    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }
    if (filters.tag) {
      result = result.filter((t) => t.tags.includes(filters.tag!));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    // Sort by createdAt descending (newest first)
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Update a task by ID with partial fields.
   * WHEN a user updates a task THE SYSTEM SHALL merge changes and update the updatedAt timestamp.
   */
  update(id: string, dto: UpdateTaskDTO): Task | null {
    const existing = this.tasks.get(id);
    if (!existing) return null;

    if (dto.title !== undefined) {
      if (dto.title.trim().length === 0) {
        throw new Error('Task title cannot be empty');
      }
      if (dto.title.trim().length > 200) {
        throw new Error('Task title must not exceed 200 characters');
      }
    }
    if (dto.priority && !VALID_PRIORITIES.includes(dto.priority)) {
      throw new Error(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
    if (dto.status && !VALID_STATUSES.includes(dto.status)) {
      throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    if (dto.dueDate && isNaN(Date.parse(dto.dueDate))) {
      throw new Error('Invalid dueDate format. Must be a valid ISO 8601 date string');
    }

    const updated: Task = {
      ...existing,
      ...(dto.title !== undefined && { title: dto.title.trim() }),
      ...(dto.description !== undefined && { description: dto.description.trim() }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.tags !== undefined && { tags: dto.tags }),
      ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updated);
    return updated;
  }

  /**
   * Delete a task by ID.
   * WHEN a user deletes a task THE SYSTEM SHALL remove it and return true, or false if not found.
   */
  delete(id: string): boolean {
    return this.tasks.delete(id);
  }

  /**
   * Compute aggregate statistics across all tasks.
   * WHEN a user requests stats THE SYSTEM SHALL return counts by status, priority, and overdue status.
   */
  getStats(): TaskStats {
    const all = Array.from(this.tasks.values());
    const now = new Date();

    return {
      total: all.length,
      todo: all.filter((t) => t.status === 'todo').length,
      in_progress: all.filter((t) => t.status === 'in_progress').length,
      done: all.filter((t) => t.status === 'done').length,
      highPriority: all.filter((t) => t.priority === 'high').length,
      overdue: all.filter(
        (t) =>
          t.dueDate !== null &&
          t.status !== 'done' &&
          new Date(t.dueDate) < now
      ).length,
    };
  }

  /** Seed with sample data for demo purposes */
  seed(): void {
    const samples: CreateTaskDTO[] = [
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        priority: 'high',
        tags: ['devops', 'automation'],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        title: 'Write API documentation',
        description: 'Document all REST endpoints using OpenAPI 3.0 specification',
        priority: 'medium',
        tags: ['docs', 'api'],
      },
      {
        title: 'Implement property-based tests',
        description: 'Add fast-check PBT tests for the task filtering logic',
        priority: 'high',
        tags: ['testing', 'quality'],
      },
      {
        title: 'Review pull requests',
        description: 'Review and merge open PRs from team members',
        priority: 'medium',
        tags: ['collaboration'],
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        title: 'Update dependencies',
        description: 'Run npm audit and update packages with known vulnerabilities',
        priority: 'low',
        tags: ['maintenance'],
      },
    ];

    samples.forEach((s) => {
      const task = this.create(s);
      // Move a couple to different statuses for demo
      if (task.title === 'Implement property-based tests') {
        this.update(task.id, { status: 'in_progress' });
      }
      if (task.title === 'Update dependencies') {
        this.update(task.id, { status: 'done' });
      }
    });
  }
}

// Singleton store instance shared across the app
export const taskStore = new TaskStore();
taskStore.seed();

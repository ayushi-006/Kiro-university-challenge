/**
 * Core domain types for the Kiro Task Manager.
 * These types are derived from the spec in .kiro/specs/task-manager.md
 */

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  tags: string[];
  dueDate: string | null;   // ISO 8601 date string or null
  createdAt: string;        // ISO 8601 datetime string
  updatedAt: string;        // ISO 8601 datetime string
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
  dueDate?: string | null;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  tags?: string[];
  dueDate?: string | null;
}

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  tag?: string;
  search?: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  in_progress: number;
  done: number;
  highPriority: number;
  overdue: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

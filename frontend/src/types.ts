/**
 * Shared domain types — mirrors backend/src/types.ts
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
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
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

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  tag?: string;
  search?: string;
}

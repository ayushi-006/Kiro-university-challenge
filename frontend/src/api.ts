/**
 * API client — all fetch calls go through here.
 * Follows the steering rule: never call fetch directly in components.
 */

import type {
  Task,
  TaskStats,
  ApiResponse,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilters,
} from './types';

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error(json.error ?? 'Request failed');
  }
  return json.data as T;
}

export const api = {
  /** List tasks with optional filters */
  listTasks(filters: TaskFilters = {}): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.tag) params.set('tag', filters.tag);
    if (filters.search) params.set('search', filters.search);
    const qs = params.toString();
    return request<Task[]>(`/tasks${qs ? `?${qs}` : ''}`);
  },

  /** Get a single task by ID */
  getTask(id: string): Promise<Task> {
    return request<Task>(`/tasks/${id}`);
  },

  /** Create a new task */
  createTask(dto: CreateTaskDTO): Promise<Task> {
    return request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /** Update a task (partial) */
  updateTask(id: string, dto: UpdateTaskDTO): Promise<Task> {
    return request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },

  /** Delete a task */
  deleteTask(id: string): Promise<void> {
    return request<void>(`/tasks/${id}`, { method: 'DELETE' });
  },

  /** Get aggregate stats */
  getStats(): Promise<TaskStats> {
    return request<TaskStats>('/tasks/stats');
  },
};

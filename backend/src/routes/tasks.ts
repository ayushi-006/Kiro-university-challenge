/**
 * Task routes — REST API for task CRUD operations and stats.
 * Base path: /api/tasks
 */

import { Router, Request, Response } from 'express';
import { taskStore } from '../taskStore';
import { ApiResponse, Task, TaskStats, TaskFilters, CreateTaskDTO, UpdateTaskDTO } from '../types';

const router = Router();

// GET /api/tasks/stats - task statistics  ← must be BEFORE /:id
router.get('/stats', (_req: Request, res: Response) => {
  try {
    const stats = taskStore.getStats();
    const response: ApiResponse<TaskStats> = { success: true, data: stats };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
});

// GET /api/tasks - list tasks with optional filters
router.get('/', (req: Request, res: Response) => {
  try {
    const filters: TaskFilters = {
      status: req.query.status as TaskFilters['status'],
      priority: req.query.priority as TaskFilters['priority'],
      tag: req.query.tag as string | undefined,
      search: req.query.search as string | undefined,
    };

    // Remove undefined keys
    Object.keys(filters).forEach((k) => {
      if (filters[k as keyof TaskFilters] === undefined) {
        delete filters[k as keyof TaskFilters];
      }
    });

    const tasks = taskStore.list(filters);
    const response: ApiResponse<Task[]> = { success: true, data: tasks };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
});

// GET /api/tasks/:id - get single task
router.get('/:id', (req: Request, res: Response) => {
  try {
    const task = taskStore.getById(req.params.id);
    if (!task) {
      const response: ApiResponse<never> = { success: false, error: 'Task not found' };
      return res.status(404).json(response);
    }
    const response: ApiResponse<Task> = { success: true, data: task };
    return res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    return res.status(500).json(response);
  }
});

// POST /api/tasks - create task
router.post('/', (req: Request, res: Response) => {
  try {
    const dto: CreateTaskDTO = req.body;
    const task = taskStore.create(dto);
    const response: ApiResponse<Task> = {
      success: true,
      data: task,
      message: 'Task created successfully',
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(400).json(response);
  }
});

// PATCH /api/tasks/:id - update task
router.patch('/:id', (req: Request, res: Response) => {
  try {
    const dto: UpdateTaskDTO = req.body;
    const task = taskStore.update(req.params.id, dto);
    if (!task) {
      const response: ApiResponse<never> = { success: false, error: 'Task not found' };
      return res.status(404).json(response);
    }
    const response: ApiResponse<Task> = {
      success: true,
      data: task,
      message: 'Task updated successfully',
    };
    return res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    return res.status(400).json(response);
  }
});

// DELETE /api/tasks/:id - delete task
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = taskStore.delete(req.params.id);
    if (!deleted) {
      const response: ApiResponse<never> = { success: false, error: 'Task not found' };
      return res.status(404).json(response);
    }
    const response: ApiResponse<never> = {
      success: true,
      message: 'Task deleted successfully',
    };
    return res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    return res.status(500).json(response);
  }
});

export default router;

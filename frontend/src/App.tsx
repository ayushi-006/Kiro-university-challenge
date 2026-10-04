import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskStats, TaskFilters, CreateTaskDTO, Status } from './types';
import { api } from './api';
import { StatsBar } from './components/StatsBar';
import { TaskCard } from './components/TaskCard';
import { CreateTaskForm } from './components/CreateTaskForm';
import { FilterBar } from './components/FilterBar';
import './index.css';

const EMPTY_STATS: TaskStats = {
  total: 0,
  todo: 0,
  in_progress: 0,
  done: 0,
  highPriority: 0,
  overdue: 0,
};

export default function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>(EMPTY_STATS);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const [taskList, taskStats] = await Promise.all([
        api.listTasks(filters),
        api.getStats(),
      ]);
      setTasks(taskList);
      setStats(taskStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleCreate(dto: CreateTaskDTO): Promise<void> {
    await api.createTask(dto);
    await loadData();
  }

  async function handleStatusChange(id: string, status: Status): Promise<void> {
    try {
      await api.updateTask(id, { status });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }

  async function handleDelete(id: string): Promise<void> {
    try {
      await api.deleteTask(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <span className="header-icon">✅</span>
            <div>
              <h1 className="header-title">Kiro Task Manager</h1>
              <p className="header-subtitle">Kiro University Challenge 2026</p>
            </div>
          </div>
          <CreateTaskForm onSubmit={handleCreate} />
        </div>
      </header>

      <main className="app-main">
        <StatsBar stats={stats} />

        {error && (
          <div className="error-banner" role="alert">
            ⚠️ {error}
            <button onClick={() => setError(null)} aria-label="Dismiss error">✕</button>
          </div>
        )}

        <FilterBar filters={filters} onChange={setFilters} />

        {loading ? (
          <div className="loading-state">Loading tasks…</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No tasks found. {Object.keys(filters).length > 0 ? 'Try clearing your filters.' : 'Create your first task!'}</p>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built with{' '}
          <a href="https://kiro.dev" target="_blank" rel="noopener noreferrer">
            Kiro
          </a>{' '}
          — Spec-driven · Steered · Hooked · PBT · MCP · Custom Agents
        </p>
      </footer>
    </div>
  );
}

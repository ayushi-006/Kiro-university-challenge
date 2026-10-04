import type { TaskStats } from '../types';

interface StatsBarProps {
  stats: TaskStats;
}

export function StatsBar({ stats }: StatsBarProps): JSX.Element {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-card stat-todo">
        <span className="stat-value">{stats.todo}</span>
        <span className="stat-label">To Do</span>
      </div>
      <div className="stat-card stat-progress">
        <span className="stat-value">{stats.in_progress}</span>
        <span className="stat-label">In Progress</span>
      </div>
      <div className="stat-card stat-done">
        <span className="stat-value">{stats.done}</span>
        <span className="stat-label">Done</span>
      </div>
      <div className="stat-card stat-high">
        <span className="stat-value">{stats.highPriority}</span>
        <span className="stat-label">High Priority</span>
      </div>
      {stats.overdue > 0 && (
        <div className="stat-card stat-overdue">
          <span className="stat-value">{stats.overdue}</span>
          <span className="stat-label">Overdue ⚠️</span>
        </div>
      )}
    </div>
  );
}

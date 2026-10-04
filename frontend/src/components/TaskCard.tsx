import type { Task, Status } from '../types';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'done') return false;
  return new Date(task.dueDate) < new Date();
}

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps): JSX.Element {
  const overdue = isOverdue(task);
  const done = task.status === 'done';

  return (
    <div className={`task-card ${done ? 'task-done' : ''} ${overdue ? 'task-overdue' : ''}`}>
      <div className="task-card-header">
        <span
          className="priority-badge"
          style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
        >
          {task.priority}
        </span>
        <span className="task-status-badge">{STATUS_LABELS[task.status]}</span>
      </div>

      <h3 className={`task-title ${done ? 'task-title-done' : ''}`}>{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {task.dueDate && (
        <p className={`task-due ${overdue ? 'overdue-text' : ''}`}>
          {overdue ? '⚠️ Overdue: ' : '📅 Due: '}
          {formatDate(task.dueDate)}
        </p>
      )}

      <div className="task-card-actions">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
          className="status-select"
          aria-label="Change task status"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          onClick={() => onDelete(task.id)}
          className="btn-delete"
          aria-label={`Delete task: ${task.title}`}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

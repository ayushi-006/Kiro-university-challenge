import { useState, type FormEvent } from 'react';
import type { CreateTaskDTO, Priority } from '../types';

interface CreateTaskFormProps {
  onSubmit: (dto: CreateTaskDTO) => Promise<void>;
}

export function CreateTaskForm({ onSubmit }: CreateTaskFormProps): JSX.Element {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dto: CreateTaskDTO = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        dueDate: dueDate || null,
      };
      await onSubmit(dto);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTags('');
      setDueDate('');
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button className="btn-primary btn-create-toggle" onClick={() => setOpen(true)}>
        + New Task
      </button>
    );
  }

  return (
    <form className="create-task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h2>New Task</h2>
        <button
          type="button"
          className="btn-close"
          onClick={() => setOpen(false)}
          aria-label="Close form"
        >
          ✕
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="task-title">Title *</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={200}
          required
          autoFocus
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details..."
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-due">Due Date</label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="task-tags">Tags (comma-separated)</label>
        <input
          id="task-tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. frontend, bug, docs"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating…' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}

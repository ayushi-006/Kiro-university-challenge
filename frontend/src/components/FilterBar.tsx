import type { TaskFilters, Status, Priority } from '../types';

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps): JSX.Element {
  function set(patch: Partial<TaskFilters>): void {
    onChange({ ...filters, ...patch });
  }

  function clear(): void {
    onChange({});
  }

  const hasFilters =
    filters.status || filters.priority || filters.tag || filters.search;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <input
          type="search"
          value={filters.search ?? ''}
          onChange={(e) => set({ search: e.target.value || undefined })}
          placeholder="🔍 Search tasks…"
          className="filter-search"
          aria-label="Search tasks"
        />
      </div>

      <div className="filter-group">
        <select
          value={filters.status ?? ''}
          onChange={(e) =>
            set({ status: (e.target.value as Status) || undefined })
          }
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filters.priority ?? ''}
          onChange={(e) =>
            set({ priority: (e.target.value as Priority) || undefined })
          }
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <input
          type="text"
          value={filters.tag ?? ''}
          onChange={(e) => set({ tag: e.target.value || undefined })}
          placeholder="Filter by tag…"
          className="filter-tag"
          aria-label="Filter by tag"
        />
      </div>

      {hasFilters && (
        <button className="btn-clear-filters" onClick={clear}>
          ✕ Clear Filters
        </button>
      )}
    </div>
  );
}

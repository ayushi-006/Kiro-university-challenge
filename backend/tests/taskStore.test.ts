/**
 * Unit tests for TaskStore — example-based tests complementing the PBT suite.
 */

import { TaskStore } from '../src/taskStore';

describe('TaskStore — create', () => {
  test('creates a task with default fields', () => {
    const store = new TaskStore();
    const task = store.create({ title: 'My Task' });
    expect(task.title).toBe('My Task');
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('medium');
    expect(task.description).toBe('');
    expect(task.tags).toEqual([]);
    expect(task.dueDate).toBeNull();
    expect(task.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  test('trims whitespace from title', () => {
    const store = new TaskStore();
    const task = store.create({ title: '  My Task  ' });
    expect(task.title).toBe('My Task');
  });

  test('throws on empty title', () => {
    const store = new TaskStore();
    expect(() => store.create({ title: '' })).toThrow('required');
    expect(() => store.create({ title: '   ' })).toThrow('required');
  });

  test('throws on title exceeding 200 chars', () => {
    const store = new TaskStore();
    expect(() => store.create({ title: 'a'.repeat(201) })).toThrow('200');
  });

  test('throws on invalid dueDate', () => {
    const store = new TaskStore();
    expect(() => store.create({ title: 'Task', dueDate: 'not-a-date' })).toThrow('dueDate');
  });
});

describe('TaskStore — list & filter', () => {
  test('returns tasks sorted newest-first', async () => {
    const store = new TaskStore();
    store.create({ title: 'First' });
    await new Promise((r) => setTimeout(r, 5));
    store.create({ title: 'Second' });
    const tasks = store.list();
    expect(tasks[0].title).toBe('Second');
    expect(tasks[1].title).toBe('First');
  });

  test('filters by status', () => {
    const store = new TaskStore();
    const t1 = store.create({ title: 'A' });
    const t2 = store.create({ title: 'B' });
    store.update(t1.id, { status: 'done' });
    const done = store.list({ status: 'done' });
    const todo = store.list({ status: 'todo' });
    expect(done).toHaveLength(1);
    expect(done[0].id).toBe(t1.id);
    expect(todo).toHaveLength(1);
    expect(todo[0].id).toBe(t2.id);
  });

  test('filters by priority', () => {
    const store = new TaskStore();
    store.create({ title: 'High', priority: 'high' });
    store.create({ title: 'Low', priority: 'low' });
    expect(store.list({ priority: 'high' })).toHaveLength(1);
    expect(store.list({ priority: 'low' })).toHaveLength(1);
  });

  test('filters by tag', () => {
    const store = new TaskStore();
    store.create({ title: 'Tagged', tags: ['api', 'backend'] });
    store.create({ title: 'Other', tags: ['frontend'] });
    expect(store.list({ tag: 'api' })).toHaveLength(1);
    expect(store.list({ tag: 'frontend' })).toHaveLength(1);
    expect(store.list({ tag: 'nonexistent' })).toHaveLength(0);
  });

  test('searches by title case-insensitively', () => {
    const store = new TaskStore();
    store.create({ title: 'Fix the Bug', description: 'something' });
    store.create({ title: 'Write tests' });
    expect(store.list({ search: 'bug' })).toHaveLength(1);
    expect(store.list({ search: 'WRITE' })).toHaveLength(1);
    expect(store.list({ search: 'nothing' })).toHaveLength(0);
  });
});

describe('TaskStore — update', () => {
  test('updates fields and advances updatedAt', async () => {
    const store = new TaskStore();
    const task = store.create({ title: 'Original' });
    await new Promise((r) => setTimeout(r, 5));
    const updated = store.update(task.id, { title: 'Updated', status: 'in_progress' });
    expect(updated).not.toBeNull();
    expect(updated!.title).toBe('Updated');
    expect(updated!.status).toBe('in_progress');
    expect(updated!.createdAt).toBe(task.createdAt);
    expect(updated!.updatedAt).not.toBe(task.updatedAt);
  });

  test('returns null for unknown ID', () => {
    const store = new TaskStore();
    expect(store.update('00000000-0000-0000-0000-000000000000', { status: 'done' })).toBeNull();
  });

  test('throws on invalid status', () => {
    const store = new TaskStore();
    const task = store.create({ title: 'Task' });
    expect(() =>
      store.update(task.id, { status: 'invalid' as 'done' })
    ).toThrow('Invalid status');
  });
});

describe('TaskStore — delete', () => {
  test('deletes an existing task and returns true', () => {
    const store = new TaskStore();
    const task = store.create({ title: 'Delete Me' });
    expect(store.delete(task.id)).toBe(true);
    expect(store.getById(task.id)).toBeNull();
  });

  test('returns false when task does not exist', () => {
    const store = new TaskStore();
    expect(store.delete('00000000-0000-0000-0000-000000000000')).toBe(false);
  });
});

describe('TaskStore — stats', () => {
  test('counts match actual task states', () => {
    const store = new TaskStore();
    const t1 = store.create({ title: 'A', priority: 'high' });
    const t2 = store.create({ title: 'B', priority: 'medium' });
    store.create({ title: 'C', priority: 'high' });
    store.update(t1.id, { status: 'in_progress' });
    store.update(t2.id, { status: 'done' });

    const stats = store.getStats();
    expect(stats.total).toBe(3);
    expect(stats.todo).toBe(1);
    expect(stats.in_progress).toBe(1);
    expect(stats.done).toBe(1);
    expect(stats.highPriority).toBe(2);
  });

  test('overdue counts tasks past due date that are not done', () => {
    const store = new TaskStore();
    const past = '2020-01-01';
    const future = '2099-01-01';
    store.create({ title: 'Overdue', dueDate: past });
    store.create({ title: 'Not due yet', dueDate: future });
    const t3 = store.create({ title: 'Overdue but done', dueDate: past });
    store.update(t3.id, { status: 'done' });

    const stats = store.getStats();
    expect(stats.overdue).toBe(1);
  });
});

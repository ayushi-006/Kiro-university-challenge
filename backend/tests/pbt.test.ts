/**
 * Property-Based Tests (PBT) — Lesson 4
 *
 * Uses fast-check to verify invariants that must hold for ANY input.
 * These tests complement unit tests by automatically generating hundreds of
 * edge-case inputs and asserting structural properties rather than specific values.
 *
 * Run: npm test from the backend/ directory
 */

import * as fc from 'fast-check';
import { TaskStore } from '../src/taskStore';
import type { Priority, Status } from '../src/types';

// ── Arbitraries (generators) ─────────────────────────────────────────────────

const arbTitle = fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0);
const arbDescription = fc.string({ maxLength: 500 });
const arbPriority = fc.constantFrom<Priority>('low', 'medium', 'high');
const arbStatus = fc.constantFrom<Status>('todo', 'in_progress', 'done');
const arbTag = fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0);
const arbTags = fc.array(arbTag, { maxLength: 5 });
const arbIsoDate = fc
  .date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
  .map((d) => d.toISOString().split('T')[0]);

const arbCreateDTO = fc.record({
  title: arbTitle,
  description: fc.option(arbDescription, { nil: undefined }),
  priority: fc.option(arbPriority, { nil: undefined }),
  tags: fc.option(arbTags, { nil: undefined }),
  dueDate: fc.option(arbIsoDate, { nil: undefined }),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function freshStore(): TaskStore {
  return new TaskStore();
}

// ── Properties ────────────────────────────────────────────────────────────────

describe('PBT — TaskStore creation invariants', () => {
  test('created task always has status=todo and a non-empty UUID', () => {
    fc.assert(
      fc.property(arbCreateDTO, (dto) => {
        const store = freshStore();
        const task = store.create(dto);
        expect(task.status).toBe('todo');
        expect(task.id).toMatch(/^[0-9a-f-]{36}$/);
        expect(task.title.trim()).toBe(task.title); // title is trimmed
        expect(task.createdAt).toBe(task.updatedAt); // fresh task timestamps match
      })
    );
  });

  test('created task title matches the trimmed input title', () => {
    fc.assert(
      fc.property(arbTitle, (title) => {
        const store = freshStore();
        const task = store.create({ title });
        expect(task.title).toBe(title.trim());
      })
    );
  });

  test('priority defaults to medium when not provided', () => {
    fc.assert(
      fc.property(arbTitle, (title) => {
        const store = freshStore();
        const task = store.create({ title });
        expect(task.priority).toBe('medium');
      })
    );
  });

  test('tags default to empty array when not provided', () => {
    fc.assert(
      fc.property(arbTitle, (title) => {
        const store = freshStore();
        const task = store.create({ title });
        expect(Array.isArray(task.tags)).toBe(true);
        expect(task.tags).toHaveLength(0);
      })
    );
  });
});

describe('PBT — TaskStore retrieval invariants', () => {
  test('getById always finds a task that was just created', () => {
    fc.assert(
      fc.property(arbCreateDTO, (dto) => {
        const store = freshStore();
        const created = store.create(dto);
        const found = store.getById(created.id);
        expect(found).not.toBeNull();
        expect(found!.id).toBe(created.id);
      })
    );
  });

  test('getById returns null for any random non-existent ID', () => {
    fc.assert(
      fc.property(fc.uuid(), (randomId) => {
        const store = freshStore();
        expect(store.getById(randomId)).toBeNull();
      })
    );
  });

  test('list() without filters returns ALL created tasks (count invariant)', () => {
    fc.assert(
      fc.property(fc.array(arbCreateDTO, { minLength: 1, maxLength: 20 }), (dtos) => {
        const store = freshStore();
        dtos.forEach((dto) => store.create(dto));
        const all = store.list();
        expect(all).toHaveLength(dtos.length);
      })
    );
  });

  test('list() is always sorted newest-first by createdAt', () => {
    fc.assert(
      fc.property(fc.array(arbCreateDTO, { minLength: 2, maxLength: 10 }), (dtos) => {
        const store = freshStore();
        dtos.forEach((dto) => store.create(dto));
        const all = store.list();
        for (let i = 0; i < all.length - 1; i++) {
          expect(new Date(all[i].createdAt).getTime()).toBeGreaterThanOrEqual(
            new Date(all[i + 1].createdAt).getTime()
          );
        }
      })
    );
  });
});

describe('PBT — TaskStore filter invariants', () => {
  test('filtering by status returns only tasks with that status', () => {
    fc.assert(
      fc.property(
        fc.array(arbCreateDTO, { minLength: 1, maxLength: 15 }),
        arbStatus,
        (dtos, targetStatus) => {
          const store = freshStore();
          const created = dtos.map((dto) => store.create(dto));
          // Update some tasks to the target status
          created.slice(0, Math.floor(created.length / 2)).forEach((t) =>
            store.update(t.id, { status: targetStatus })
          );
          const filtered = store.list({ status: targetStatus });
          filtered.forEach((t) => {
            expect(t.status).toBe(targetStatus);
          });
        }
      )
    );
  });

  test('filtering by priority returns only tasks with that priority', () => {
    fc.assert(
      fc.property(
        fc.array(arbCreateDTO, { minLength: 1, maxLength: 15 }),
        arbPriority,
        (dtos, targetPriority) => {
          const store = freshStore();
          dtos.forEach((dto) => store.create({ ...dto, priority: targetPriority }));
          const filtered = store.list({ priority: targetPriority });
          filtered.forEach((t) => {
            expect(t.priority).toBe(targetPriority);
          });
        }
      )
    );
  });

  test('filter by tag: all returned tasks contain that tag', () => {
    fc.assert(
      fc.property(
        fc.array(arbCreateDTO, { minLength: 1, maxLength: 15 }),
        arbTag,
        (dtos, targetTag) => {
          const store = freshStore();
          dtos.forEach((dto, i) => {
            // Half the tasks get the target tag
            const tags = i % 2 === 0 ? [targetTag] : dto.tags ?? [];
            store.create({ ...dto, tags });
          });
          const filtered = store.list({ tag: targetTag });
          filtered.forEach((t) => {
            expect(t.tags).toContain(targetTag);
          });
        }
      )
    );
  });

  test('filter count is always <= total count (filtering never expands the set)', () => {
    fc.assert(
      fc.property(
        fc.array(arbCreateDTO, { minLength: 0, maxLength: 20 }),
        arbStatus,
        (dtos, status) => {
          const store = freshStore();
          dtos.forEach((dto) => store.create(dto));
          const all = store.list();
          const filtered = store.list({ status });
          expect(filtered.length).toBeLessThanOrEqual(all.length);
        }
      )
    );
  });
});

describe('PBT — TaskStore update invariants', () => {
  test('update preserves the task ID and createdAt', () => {
    fc.assert(
      fc.property(arbCreateDTO, arbStatus, arbPriority, (dto, newStatus, newPriority) => {
        const store = freshStore();
        const original = store.create(dto);
        const updated = store.update(original.id, { status: newStatus, priority: newPriority });
        expect(updated).not.toBeNull();
        expect(updated!.id).toBe(original.id);
        expect(updated!.createdAt).toBe(original.createdAt);
        // updatedAt must be >= createdAt (never goes backwards)
        expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
          new Date(updated!.createdAt).getTime()
        );
        // The updated fields must match what we passed
        expect(updated!.status).toBe(newStatus);
        expect(updated!.priority).toBe(newPriority);
      })
    );
  });

  test('update returns null for non-existent IDs', () => {
    fc.assert(
      fc.property(fc.uuid(), arbStatus, (randomId, status) => {
        const store = freshStore();
        const result = store.update(randomId, { status });
        expect(result).toBeNull();
      })
    );
  });
});

describe('PBT — TaskStore delete invariants', () => {
  test('delete returns true for existing tasks and removes them from list()', () => {
    fc.assert(
      fc.property(arbCreateDTO, (dto) => {
        const store = freshStore();
        const task = store.create(dto);
        const deleted = store.delete(task.id);
        expect(deleted).toBe(true);
        expect(store.getById(task.id)).toBeNull();
        expect(store.list().find((t) => t.id === task.id)).toBeUndefined();
      })
    );
  });

  test('delete returns false for non-existent IDs', () => {
    fc.assert(
      fc.property(fc.uuid(), (randomId) => {
        const store = freshStore();
        expect(store.delete(randomId)).toBe(false);
      })
    );
  });
});

describe('PBT — TaskStore stats invariants', () => {
  test('stats.total always equals the number of tasks created', () => {
    fc.assert(
      fc.property(fc.array(arbCreateDTO, { minLength: 0, maxLength: 20 }), (dtos) => {
        const store = freshStore();
        dtos.forEach((dto) => store.create(dto));
        const stats = store.getStats();
        expect(stats.total).toBe(dtos.length);
      })
    );
  });

  test('stats counts by status always sum to total', () => {
    fc.assert(
      fc.property(fc.array(arbCreateDTO, { minLength: 0, maxLength: 20 }), (dtos) => {
        const store = freshStore();
        dtos.forEach((dto) => store.create(dto));
        const stats = store.getStats();
        expect(stats.todo + stats.in_progress + stats.done).toBe(stats.total);
      })
    );
  });

  test('stats.highPriority never exceeds total', () => {
    fc.assert(
      fc.property(fc.array(arbCreateDTO, { minLength: 0, maxLength: 20 }), (dtos) => {
        const store = freshStore();
        dtos.forEach((dto) => store.create(dto));
        const stats = store.getStats();
        expect(stats.highPriority).toBeLessThanOrEqual(stats.total);
      })
    );
  });

  test('stats after deletion decreases total by exactly 1', () => {
    fc.assert(
      fc.property(
        fc.array(arbCreateDTO, { minLength: 1, maxLength: 20 }),
        (dtos) => {
          const store = freshStore();
          const tasks = dtos.map((dto) => store.create(dto));
          const before = store.getStats().total;
          store.delete(tasks[0].id);
          const after = store.getStats().total;
          expect(after).toBe(before - 1);
        }
      )
    );
  });
});

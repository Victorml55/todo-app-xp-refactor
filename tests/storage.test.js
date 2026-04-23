// ==========================================
// PRUEBAS: storage.test.js
// Módulo: src/storage/storage.js
// ==========================================

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { saveTask, loadTasks, updateTask, deleteTaskAPI, saveTags, loadTags, saveTheme, loadTheme } from '../src/storage/storage.js';

// Mock de fetch para Node.js
global.fetch = jest.fn();

// Mock de localStorage para Node.js
const localStorageMock = (() => {
  let store = {};
  return {
    getItem:  (key)        => store[key] ?? null,
    setItem:  (key, value) => { store[key] = String(value); },
    removeItem:(key)       => { delete store[key]; },
    clear:    ()           => { store = {}; },
  };
})();

global.localStorage = localStorageMock;

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// ── saveTask / loadTasks ──────────────────────
describe('saveTask y loadTasks', () => {
  test('loadTasks retorna las tareas del servidor', async () => {
    const tasks = [{ id: 1, title: 'Tarea', completed: false, tags: ['general'], description: '', createdAt: null, dueDate: null }];
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => tasks });
    const loaded = await loadTasks();
    expect(loaded.length).toBe(1);
    expect(loaded[0].title).toBe('Tarea');
  });

  test('loadTasks retorna arreglo vacío si falla el servidor', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const loaded = await loadTasks();
    expect(loaded).toEqual([]);
  });

  test('saveTask envía la tarea al servidor y retorna la creada', async () => {
    const task    = { title: 'Nueva', completed: false, tags: ['general'] };
    const created = { id: 1, ...task };
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => created });
    const result = await saveTask(task);
    expect(result).toEqual(created);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/tasks'),
      expect.objectContaining({ method: 'POST' }),
    );
  });
});

// ── saveTags / loadTags ────────────────────────
describe('saveTags y loadTags', () => {
  test('guarda y carga etiquetas correctamente', () => {
    saveTags(['general', 'trabajo', 'casa']);
    const loaded = loadTags();
    expect(loaded).toContain('trabajo');
    expect(loaded).toContain('casa');
  });

  test('retorna general por defecto si no hay etiquetas', () => {
    const loaded = loadTags();
    expect(loaded).toEqual(['general']);
  });

  test('siempre incluye general aunque no esté guardada', () => {
    saveTags(['trabajo']);
    const loaded = loadTags();
    expect(loaded).toContain('general');
  });
});

// ── saveTheme / loadTheme ──────────────────────
describe('saveTheme y loadTheme', () => {
  test('guarda y carga el tema dark', () => {
    saveTheme('dark');
    expect(loadTheme()).toBe('dark');
  });

  test('guarda y carga el tema light', () => {
    saveTheme('light');
    expect(loadTheme()).toBe('light');
  });

  test('retorna light por defecto si no hay tema guardado', () => {
    expect(loadTheme()).toBe('light');
  });
});
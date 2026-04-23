// ==========================================
// PRUEBAS: storage.test.js
// Módulo: src/storage/storage.js
// ==========================================

import { describe, test, expect, beforeEach } from '@jest/globals';
import { saveTasks, loadTasks, saveTags, loadTags, saveTheme, loadTheme } from '../src/storage/storage.js';

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
});

// ── saveTasks / loadTasks ──────────────────────
describe('saveTasks y loadTasks', () => {
  test('guarda y carga tareas correctamente', () => {
    const tasks = [{ id: 1, title: 'Tarea', completed: false, tags: ['general'], description: '', createdAt: null, dueDate: null }];
    saveTasks(tasks);
    const loaded = loadTasks();
    expect(loaded.length).toBe(1);
    expect(loaded[0].title).toBe('Tarea');
  });

  test('retorna arreglo vacío si no hay tareas guardadas', () => {
    const loaded = loadTasks();
    expect(loaded).toEqual([]);
  });

  test('agrega campos faltantes a tareas antiguas', () => {
    const tasks = [{ id: 1, title: 'Vieja' }];
    saveTasks(tasks);
    const loaded = loadTasks();
    expect(loaded[0].tags).toEqual(['general']);
    expect(loaded[0].description).toBe('');
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
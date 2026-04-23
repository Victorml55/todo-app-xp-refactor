// ==========================================
// PRUEBAS: tasks.test.js
// Módulo: src/tasks/tasks.js
// ==========================================

import { describe, test, expect } from '@jest/globals';
import {
  createTask,
  addTask,
  deleteTask,
  toggleComplete,
  editTask,
  filterTasks,
  addTag,
  deleteTag,
  isValidTitle,
} from '../src/tasks/tasks.js';

// ── createTask ─────────────────────────────────
describe('createTask', () => {
  test('crea una tarea con los campos correctos', () => {
    const task = createTask('Estudiar', 'Repasar XP', null, ['general']);
    expect(task.title).toBe('Estudiar');
    expect(task.description).toBe('Repasar XP');
    expect(task.completed).toBe(false);
    expect(task.tags).toEqual(['general']);
    expect(task.id).toBeDefined();
    expect(task.createdAt).toBeDefined();
  });

  test('asigna etiqueta general si no se pasan tags', () => {
    const task = createTask('Tarea', '', null, []);
    expect(task.tags).toEqual(['general']);
  });

  test('recorta espacios del título', () => {
    const task = createTask('  Tarea con espacios  ', '', null, ['general']);
    expect(task.title).toBe('Tarea con espacios');
  });
});

// ── addTask ────────────────────────────────────
describe('addTask', () => {
  test('agrega una tarea al arreglo', () => {
    const tasks   = [];
    const newTask = createTask('Nueva', '', null, ['general']);
    const result  = addTask(tasks, newTask);
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Nueva');
  });

  test('no modifica el arreglo original', () => {
    const tasks   = [];
    const newTask = createTask('Nueva', '', null, ['general']);
    addTask(tasks, newTask);
    expect(tasks.length).toBe(0);
  });
});

// ── deleteTask ─────────────────────────────────
describe('deleteTask', () => {
  test('elimina la tarea con el ID correcto', () => {
    const task1  = createTask('Tarea 1', '', null, ['general']);
    const task2  = createTask('Tarea 2', '', null, ['general']);
    const tasks  = [task1, task2];
    const result = deleteTask(tasks, task1.id);
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Tarea 2');
  });

  test('no elimina nada si el ID no existe', () => {
    const task   = createTask('Tarea', '', null, ['general']);
    const result = deleteTask([task], 9999);
    expect(result.length).toBe(1);
  });
});

// ── toggleComplete ─────────────────────────────
describe('toggleComplete', () => {
  test('marca una tarea como completada', () => {
    const task   = createTask('Tarea', '', null, ['general']);
    const result = toggleComplete([task], task.id);
    expect(result[0].completed).toBe(true);
  });

  test('desmarca una tarea completada', () => {
    const task     = { ...createTask('Tarea', '', null, ['general']), completed: true };
    const result   = toggleComplete([task], task.id);
    expect(result[0].completed).toBe(false);
  });

  test('no modifica otras tareas', () => {
    const task1  = createTask('Tarea 1', '', null, ['general']);
    const task2  = createTask('Tarea 2', '', null, ['general']);
    const result = toggleComplete([task1, task2], task1.id);
    expect(result[1].completed).toBe(false);
  });
});

// ── editTask ───────────────────────────────────
describe('editTask', () => {
  test('actualiza el título de una tarea', () => {
    const task   = createTask('Viejo título', '', null, ['general']);
    const result = editTask([task], task.id, { title: 'Nuevo título' });
    expect(result[0].title).toBe('Nuevo título');
  });

  test('no modifica otras tareas', () => {
    const task1  = createTask('Tarea 1', '', null, ['general']);
    const task2  = createTask('Tarea 2', '', null, ['general']);
    const result = editTask([task1, task2], task1.id, { title: 'Editada' });
    expect(result[1].title).toBe('Tarea 2');
  });
});

// ── filterTasks ────────────────────────────────
describe('filterTasks', () => {
  const task1 = { ...createTask('Estudiar', 'XP', null, ['escuela']), completed: false };
  const task2 = { ...createTask('Compras', 'Mandado', null, ['casa']),  completed: true  };

  test('filtra solo pendientes', () => {
    const result = filterTasks([task1, task2], { status: 'pending', tag: null, search: '' });
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Estudiar');
  });

  test('filtra solo completadas', () => {
    const result = filterTasks([task1, task2], { status: 'completed', tag: null, search: '' });
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Compras');
  });

  test('filtra por etiqueta', () => {
    const result = filterTasks([task1, task2], { status: 'all', tag: 'casa', search: '' });
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Compras');
  });

  test('filtra por búsqueda de texto', () => {
    const result = filterTasks([task1, task2], { status: 'all', tag: null, search: 'estud' });
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Estudiar');
  });

  test('retorna todas si no hay filtros', () => {
    const result = filterTasks([task1, task2], { status: 'all', tag: null, search: '' });
    expect(result.length).toBe(2);
  });
});

// ── addTag ─────────────────────────────────────
describe('addTag', () => {
  test('agrega una etiqueta nueva', () => {
    const result = addTag(['general'], 'trabajo');
    expect(result).toContain('trabajo');
  });

  test('retorna null si la etiqueta ya existe', () => {
    const result = addTag(['general', 'trabajo'], 'trabajo');
    expect(result).toBeNull();
  });

  test('retorna null si el nombre está vacío', () => {
    const result = addTag(['general'], '   ');
    expect(result).toBeNull();
  });

  test('convierte espacios a guiones', () => {
    const result = addTag(['general'], 'mi etiqueta');
    expect(result).toContain('mi-etiqueta');
  });
});

// ── deleteTag ──────────────────────────────────
describe('deleteTag', () => {
  test('elimina la etiqueta del arreglo', () => {
    const { tags } = deleteTag(['general', 'trabajo'], [], 'trabajo');
    expect(tags).not.toContain('trabajo');
  });

  test('no elimina la etiqueta general', () => {
    const { tags } = deleteTag(['general', 'trabajo'], [], 'general');
    expect(tags).toContain('general');
  });

  test('remueve la etiqueta de las tareas que la tienen', () => {
    const task     = { ...createTask('T', '', null, ['trabajo']), id: 1 };
    const { tasks } = deleteTag(['general', 'trabajo'], [task], 'trabajo');
    expect(tasks[0].tags).not.toContain('trabajo');
    expect(tasks[0].tags).toContain('general');
  });
});

// ── isValidTitle ───────────────────────────────
describe('isValidTitle', () => {
  test('retorna true para un título válido', () => {
    expect(isValidTitle('Mi tarea')).toBe(true);
  });

  test('retorna false para un título vacío', () => {
    expect(isValidTitle('')).toBe(false);
  });

  test('retorna false para un título con solo espacios', () => {
    expect(isValidTitle('   ')).toBe(false);
  });
});
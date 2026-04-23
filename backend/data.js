// ==========================================
// MÓDULO: data.js
// Responsabilidad: almacenamiento en memoria
// ==========================================

let tasks = [];
let nextId = 1;

/**
 * Retorna todas las tareas
 * @returns {Array}
 */
export function getAllTasks() {
  return tasks;
}

/**
 * Busca una tarea por ID
 * @param {number} id
 * @returns {Object|undefined}
 */
export function getTaskById(id) {
  return tasks.find(t => t.id === id);
}

/**
 * Agrega una nueva tarea
 * @param {Object} taskData
 * @returns {Object}
 */
export function insertTask(taskData) {
  const task = {
    id:          nextId++,
    title:       taskData.title.trim(),
    description: taskData.description?.trim() || '',
    completed:   false,
    tags:        taskData.tags?.length > 0 ? taskData.tags : ['general'],
    createdAt:   new Date().toISOString(),
    dueDate:     taskData.dueDate || null,
  };
  tasks.push(task);
  return task;
}

/**
 * Actualiza una tarea por ID
 * @param {number} id
 * @param {Object} changes
 * @returns {Object|null}
 */
export function updateTask(id, changes) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...changes };
  return tasks[index];
}

/**
 * Elimina una tarea por ID
 * @param {number} id
 * @returns {boolean}
 */
export function removeTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}
// ==========================================
// MÓDULO: tasks.js
// Responsabilidad: lógica de tareas (CRUD)
// ==========================================

/**
 * Crea una nueva tarea
 * @param {string} title
 * @param {string} description
 * @param {string|null} dueDate
 * @param {Array} tags
 * @returns {Object}
 */
export function createTask(title, description, dueDate, tags) {
  return {
    id:          Date.now(),
    title:       title.trim(),
    description: description.trim(),
    completed:   false,
    tags:        tags.length > 0 ? tags : ['general'],
    createdAt:   new Date().toISOString(),
    dueDate:     dueDate || null,
  };
}

/**
 * Agrega una tarea al arreglo
 * @param {Array} tasks
 * @param {Object} newTask
 * @returns {Array}
 */
export function addTask(tasks, newTask) {
  return [...tasks, newTask];
}

/**
 * Elimina una tarea por ID
 * @param {Array} tasks
 * @param {number} id
 * @returns {Array}
 */
export function deleteTask(tasks, id) {
  return tasks.filter(task => task.id !== id);
}

/**
 * Alterna el estado completado de una tarea
 * @param {Array} tasks
 * @param {number} id
 * @returns {Array}
 */
export function toggleComplete(tasks, id) {
  return tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

/**
 * Edita los campos de una tarea
 * @param {Array} tasks
 * @param {number} id
 * @param {Object} changes - { title, description, dueDate, tags }
 * @returns {Array}
 */
export function editTask(tasks, id, changes) {
  return tasks.map(task =>
    task.id === id ? { ...task, ...changes } : task
  );
}

/**
 * Filtra tareas por estado, etiqueta y búsqueda
 * @param {Array} tasks
 * @param {Object} filters - { status, tag, search }
 * @returns {Array}
 */
export function filterTasks(tasks, { status, tag, search }) {
  return tasks.filter(task => {
    if (status === 'pending'   && task.completed)  return false;
    if (status === 'completed' && !task.completed) return false;
    if (tag && !task.tags.includes(tag))           return false;
    if (search) {
      const q       = search.toLowerCase();
      const inTitle = task.title.toLowerCase().includes(q);
      const inDesc  = task.description.toLowerCase().includes(q);
      const inTags  = task.tags.some(t => t.toLowerCase().includes(q));
      if (!inTitle && !inDesc && !inTags) return false;
    }
    return true;
  });
}

/**
 * Agrega una etiqueta al arreglo de etiquetas disponibles
 * @param {Array} tags
 * @param {string} newTag
 * @returns {Array|null} null si ya existe
 */
export function addTag(tags, newTag) {
  const formatted = newTag.trim().toLowerCase().replace(/\s+/g, '-');
  if (!formatted || tags.includes(formatted)) return null;
  return [...tags, formatted];
}

/**
 * Elimina una etiqueta y la remueve de todas las tareas
 * @param {Array} tags
 * @param {Array} tasks
 * @param {string} tagName
 * @returns {{ tags: Array, tasks: Array }}
 */
export function deleteTag(tags, tasks, tagName) {
  if (tagName === 'general') return { tags, tasks };
  const newTags  = tags.filter(t => t !== tagName);
  const newTasks = tasks.map(task => {
    const filtered = task.tags.filter(t => t !== tagName);
    return { ...task, tags: filtered.length > 0 ? filtered : ['general'] };
  });
  return { tags: newTags, tasks: newTasks };
}

/**
 * Valida que el título no esté vacío
 * @param {string} title
 * @returns {boolean}
 */
export function isValidTitle(title) {
  return title.trim().length > 0;
}
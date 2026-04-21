// MÓDULO: tasks.js
// Responsabilidad: lógica de tareas (CRUD)

/**
 * Crea una nueva tarea
 * @param {string} text - Texto de la tarea
 * @returns {Object} Nueva tarea
 */
export function createTask(text) {
  return {
    id: Date.now(),
    text: text.trim(),
    completed: false
  };
}

/**
 * Agrega una tarea al arreglo
 * @param {Array} tasks - Arreglo actual
 * @param {string} text - Texto de la nueva tarea
 * @returns {Array} Nuevo arreglo con la tarea agregada
 */
export function addTask(tasks, text) {
  const newTask = createTask(text);
  return [...tasks, newTask];
}

/**
 * Elimina una tarea por ID
 * @param {Array} tasks - Arreglo actual
 * @param {number} id - ID de la tarea a eliminar
 * @returns {Array} Nuevo arreglo sin la tarea
 */
export function deleteTask(tasks, id) {
  return tasks.filter(task => task.id !== id);
}

/**
 * Alterna el estado completado de una tarea
 * @param {Array} tasks - Arreglo actual
 * @param {number} id - ID de la tarea
 * @returns {Array} Nuevo arreglo con el estado actualizado
 */
export function toggleComplete(tasks, id) {
  return tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

/**
 * Edita el texto de una tarea
 * @param {Array} tasks - Arreglo actual
 * @param {number} id - ID de la tarea
 * @param {string} newText - Nuevo texto
 * @returns {Array} Nuevo arreglo con el texto actualizado
 */
export function editTask(tasks, id, newText) {
  return tasks.map(task =>
    task.id === id ? { ...task, text: newText.trim() } : task
  );
}

/**
 * Filtra tareas según estado
 * @param {Array} tasks - Arreglo actual
 * @param {string} filter - 'all', 'pending', 'completed'
 * @returns {Array} Tareas filtradas
 */
export function filterTasks(tasks, filter) {
  if (filter === 'pending')   return tasks.filter(t => !t.completed);
  if (filter === 'completed') return tasks.filter(t => t.completed);
  return tasks;
}

/**
 * Valida que el texto de una tarea no esté vacío
 * @param {string} text - Texto a validar
 * @returns {boolean} true si es válido
 */
export function isValidText(text) {
  return text.trim().length > 0;
}
// ==========================================
// MÓDULO: storage.js
// Responsabilidad: manejo de localStorage
// ==========================================

const TASKS_KEY = 'tasks';
const TAGS_KEY  = 'availableTags';
const THEME_KEY = 'theme';

/**
 * Guarda las tareas en localStorage
 * @param {Array} tasks
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Error al guardar tareas:', e);
  }
}

/**
 * Carga las tareas desde localStorage
 * @returns {Array}
 */
export function loadTasks() {
  try {
    const saved = localStorage.getItem(TASKS_KEY);
    const tasks = saved ? JSON.parse(saved) : [];
    return tasks.map(task => ({
      ...task,
      tags:        task.tags        || ['general'],
      description: task.description || '',
      createdAt:   task.createdAt   || null,
      dueDate:     task.dueDate     || null,
    }));
  } catch (e) {
    console.warn('Error al cargar tareas:', e);
    return [];
  }
}

/**
 * Guarda las etiquetas disponibles
 * @param {Array} tags
 */
export function saveTags(tags) {
  try {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  } catch (e) {
    console.warn('Error al guardar etiquetas:', e);
  }
}

/**
 * Carga las etiquetas disponibles
 * @returns {Array}
 */
export function loadTags() {
  try {
    const saved = localStorage.getItem(TAGS_KEY);
    const tags  = saved ? JSON.parse(saved) : ['general'];
    return tags.includes('general') ? tags : ['general', ...tags];
  } catch (e) {
    return ['general'];
  }
}

/**
 * Guarda la preferencia de tema
 * @param {string} theme - 'dark' | 'light'
 */
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Carga la preferencia de tema
 * @returns {string}
 */
export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}
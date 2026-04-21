// MÓDULO: storage.js
// Responsabilidad: manejo de localStorage

const STORAGE_KEY = 'tasks';
const THEME_KEY = 'theme';

/**
 * Guarda el arreglo de tareas en localStorage
 * @param {Array} tasks - Arreglo de tareas a guardar
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Error al guardar tareas:', e);
  }
}

/**
 * Carga las tareas desde localStorage
 * @returns {Array} Arreglo de tareas guardadas
 */
export function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn('Error al cargar tareas:', e);
    return [];
  }
}

/**
 * Guarda la preferencia de tema
 * @param {string} theme - 'dark' o 'light'
 */
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Carga la preferencia de tema
 * @returns {string} 'dark' o 'light'
 */
export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}
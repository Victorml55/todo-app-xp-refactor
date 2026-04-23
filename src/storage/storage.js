// ==========================================
// MÓDULO: storage.js
// Responsabilidad: comunicación con API REST
// ==========================================

const API_URL = 'http://localhost:3000/api/tasks';

/**
 * Obtiene todas las tareas desde el servidor
 * @returns {Promise<Array>}
 */
export async function loadTasks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al obtener tareas');
    return await res.json();
  } catch (e) {
    console.warn('Error al cargar tareas:', e);
    return [];
  }
}

/**
 * Crea una tarea en el servidor
 * @param {Object} task
 * @returns {Promise<Object|null>}
 */
export async function saveTask(task) {
  try {
    const res = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Error al crear tarea');
    return await res.json();
  } catch (e) {
    console.warn('Error al guardar tarea:', e);
    return null;
  }
}

/**
 * Actualiza una tarea en el servidor
 * @param {number} id
 * @param {Object} changes
 * @returns {Promise<Object|null>}
 */
export async function updateTask(id, changes) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(changes),
    });
    if (!res.ok) throw new Error('Error al actualizar tarea');
    return await res.json();
  } catch (e) {
    console.warn('Error al actualizar tarea:', e);
    return null;
  }
}

/**
 * Elimina una tarea en el servidor
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export async function deleteTaskAPI(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar tarea');
    return true;
  } catch (e) {
    console.warn('Error al eliminar tarea:', e);
    return false;
  }
}

// ── localStorage para tags y tema ──────────────
const TAGS_KEY  = 'availableTags';
const THEME_KEY = 'theme';

export function saveTags(tags) {
  try {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  } catch (e) {
    console.warn('Error al guardar etiquetas:', e);
  }
}

export function loadTags() {
  try {
    const saved = localStorage.getItem(TAGS_KEY);
    const tags  = saved ? JSON.parse(saved) : ['general'];
    return tags.includes('general') ? tags : ['general', ...tags];
  } catch (e) {
    return ['general'];
  }
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}
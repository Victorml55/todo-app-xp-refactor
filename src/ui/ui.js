// MÓDULO: ui.js
// Responsabilidad: manipulación del DOM

/**
 * Renderiza la lista de tareas en el DOM
 * @param {Array} tasks - Tareas a mostrar
 * @param {Function} onComplete - Callback al completar
 * @param {Function} onEdit - Callback al editar
 * @param {Function} onDelete - Callback al eliminar
 */
export function renderTasks(tasks, { onComplete, onEdit, onDelete }) {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  if (tasks.length === 0) {
    list.innerHTML = '<li class="empty">No hay tareas aquí.</li>';
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="btn-complete">✓</button>
        <button class="btn-edit">✎</button>
        <button class="btn-delete">✕</button>
      </div>
    `;

    li.querySelector('.btn-complete').addEventListener('click', () => onComplete(task.id));
    li.querySelector('.btn-edit').addEventListener('click', () => onEdit(task.id, li));
    li.querySelector('.btn-delete').addEventListener('click', () => onDelete(task.id));

    list.appendChild(li);
  });
}

/**
 * Convierte una tarea en modo edición
 * @param {Object} task - Tarea a editar
 * @param {HTMLElement} li - Elemento del DOM
 * @param {Function} onSave - Callback al guardar
 * @param {Function} onCancel - Callback al cancelar
 */
export function renderEditMode(task, li, { onSave, onCancel }) {
  const textSpan = li.querySelector('.task-text');
  const actions = li.querySelector('.task-actions');

  const input = document.createElement('input');
  input.type = 'text';
  input.value = task.text;
  input.className = 'edit-input';
  textSpan.replaceWith(input);
  input.focus();

  actions.innerHTML = `
    <button class="btn-save">Guardar</button>
    <button class="btn-cancel">Cancelar</button>
  `;

  actions.querySelector('.btn-save').addEventListener('click', () => onSave(input.value));
  actions.querySelector('.btn-cancel').addEventListener('click', onCancel);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSave(input.value);
    if (e.key === 'Escape') onCancel();
  });
}

/**
 * Muestra error en el input principal
 * @param {string} message - Mensaje de error
 */
export function showInputError(message) {
  const input = document.getElementById('taskInput');
  input.classList.add('error');
  input.placeholder = message;
  setTimeout(() => {
    input.classList.remove('error');
    input.placeholder = 'Escribe una tarea...';
  }, 2000);
}

/**
 * Limpia el campo de input principal
 */
export function clearInput() {
  document.getElementById('taskInput').value = '';
}

/**
 * Actualiza el botón de filtro activo
 * @param {string} filter - Filtro activo
 */
export function updateFilterButtons(filter) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

/**
 * Aplica o quita el tema oscuro
 * @param {boolean} isDark - true para modo oscuro
 */
export function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  document.getElementById('themeBtn').textContent =
    isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
}
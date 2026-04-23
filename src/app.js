// MÓDULO: app.js
// Responsabilidad: punto de entrada y eventos

import { saveTasks, loadTasks, saveTheme, loadTheme } from './storage/storage.js';
import { addTask, deleteTask, toggleComplete, editTask, filterTasks, isValidText } from './tasks/tasks.js';
import { renderTasks, renderEditMode, showInputError, clearInput, updateFilterButtons, applyTheme } from './ui/ui.js';

// ── Estado global 
let tasks = loadTasks();
let currentFilter = 'all';

// ── Renderizado 
function render() {
  const filtered = filterTasks(tasks, currentFilter);
  renderTasks(filtered, {
    onComplete: handleComplete,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });
}

// ── Handlers 
function handleAdd() {
  const input = document.getElementById('taskInput');
  const text = input.value;

  if (!isValidText(text)) {
    showInputError('El campo no puede estar vacío.');
    return;
  }

  tasks = addTask(tasks, text);
  saveTasks(tasks);
  clearInput();
  render();
}

function handleComplete(id) {
  tasks = toggleComplete(tasks, id);
  saveTasks(tasks);
  render();
}

function handleDelete(id) {
  tasks = deleteTask(tasks, id);
  saveTasks(tasks);
  render();
}

function handleEdit(id, li) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  renderEditMode(task, li, {
    onSave: (newText) => {
      if (!isValidText(newText)) {
        const input = li.querySelector('.edit-input');
        input.classList.add('error');
        input.placeholder = 'No puede estar vacío';
        setTimeout(() => input.classList.remove('error'), 2000);
        return;
      }
      tasks = editTask(tasks, id, newText);
      saveTasks(tasks);
      render();
    },
    onCancel: () => render()
  });
}

function handleFilter(filter) {
  currentFilter = filter;
  updateFilterButtons(filter);
  render();
}

// ── Tema 
window.toggleTheme = function () {
  const isDark = document.body.classList.toggle('dark');
  saveTheme(isDark ? 'dark' : 'light');
  applyTheme(isDark);
};

// ── Eventos 
document.getElementById('addBtn').addEventListener('click', handleAdd);

document.getElementById('taskInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAdd();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => handleFilter(btn.dataset.filter));
});

// ── Inicio 
applyTheme(loadTheme() === 'dark');
render();
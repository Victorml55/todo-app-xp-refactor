// ==========================================
// MÓDULO: app.js
// Responsabilidad: punto de entrada y eventos
// ==========================================

import { loadTasks, saveTask, updateTask, deleteTaskAPI, saveTags, loadTags, saveTheme, loadTheme } from './storage/storage.js';
import { createTask, addTag, deleteTag, filterTasks, isValidTitle } from './tasks/tasks.js';
import { renderTable, renderNewTaskTagSelector, renderEditTagSelector, renderTagsManagement, renderTagFilters, updateStatusFilters, openEditModal, closeEditModal, openConfirmModal, closeConfirmModal, showInputError, applyTheme } from './ui/ui.js';

// ── Estado ─────────────────────────────────────
let tasks          = [];
let availableTags  = loadTags();
let statusFilter   = 'all';
let tagFilter      = null;
let searchQuery    = '';
let editingTaskId  = null;
let deletingTaskId = null;
let newTaskTags    = ['general'];
let editingTags    = ['general'];

// ── Render principal ───────────────────────────
function render() {
  const filtered = filterTasks(tasks, {
    status: statusFilter,
    tag:    tagFilter,
    search: searchQuery,
  });

  renderTable(filtered, {
    onComplete: handleToggleComplete,
    onEdit:     handleOpenEdit,
    onDelete:   handleOpenDelete,
  });

  renderTagFilters(availableTags, tagFilter, handleTagFilter);
  renderTagsManagement(availableTags, handleDeleteTag);
  renderNewTaskTagSelector(availableTags, newTaskTags, handleNewTaskTagChange);
}

// ── Handlers — Tareas ──────────────────────────
async function handleAddTask() {
  const title   = document.getElementById('taskTitle').value;
  const desc    = document.getElementById('taskDesc').value;
  const dueDate = document.getElementById('taskDueDate').value;

  if (!isValidTitle(title)) {
    showInputError('taskTitle', 'El título no puede estar vacío');
    return;
  }

  const taskData = createTask(title, desc, dueDate, newTaskTags);
  const saved    = await saveTask(taskData);
  if (!saved) return;

  tasks = await loadTasks();

  document.getElementById('taskTitle').value   = '';
  document.getElementById('taskDesc').value    = '';
  document.getElementById('taskDueDate').value = '';
  newTaskTags = ['general'];

  render();
}

async function handleToggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  await updateTask(id, { completed: !task.completed });
  tasks = await loadTasks();
  render();
}

function handleOpenDelete(id) {
  deletingTaskId = id;
  openConfirmModal();
}

async function handleConfirmDelete() {
  if (deletingTaskId === null) return;
  await deleteTaskAPI(deletingTaskId);
  tasks          = await loadTasks();
  deletingTaskId = null;
  closeConfirmModal();
  render();
}

function handleOpenEdit(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  editingTaskId = id;
  editingTags   = [...task.tags];
  openEditModal(task, availableTags, editingTags, handleEditTagChange);
}

async function handleSaveEdit() {
  if (!editingTaskId) return;
  const title = document.getElementById('editTitle').value;

  if (!isValidTitle(title)) {
    showInputError('editTitle', 'El título no puede estar vacío');
    return;
  }

  const changes = {
    title:       title.trim(),
    description: document.getElementById('editDesc').value.trim(),
    dueDate:     document.getElementById('editDueDate').value || null,
    tags:        editingTags.length > 0 ? editingTags : ['general'],
  };

  await updateTask(editingTaskId, changes);
  tasks         = await loadTasks();
  editingTaskId = null;
  closeEditModal();
  render();
}

// ── Handlers — Tags ────────────────────────────
function handleNewTaskTagChange(selected, tag) {
  if (selected) {
    if (!newTaskTags.includes(tag)) newTaskTags.push(tag);
  } else {
    newTaskTags = newTaskTags.filter(t => t !== tag);
    if (newTaskTags.length === 0) newTaskTags = ['general'];
  }
  renderNewTaskTagSelector(availableTags, newTaskTags, handleNewTaskTagChange);
}

function handleEditTagChange(selected, tag) {
  if (selected) {
    if (!editingTags.includes(tag)) editingTags.push(tag);
  } else {
    editingTags = editingTags.filter(t => t !== tag);
    if (editingTags.length === 0) editingTags = ['general'];
  }
  renderEditTagSelector(availableTags, editingTags, handleEditTagChange);
}

function handleCreateTag() {
  const input  = document.getElementById('newTagInput');
  const result = addTag(availableTags, input.value);
  if (!result) {
    showInputError('newTagInput', 'Ya existe o es inválida');
    return;
  }
  availableTags = result;
  saveTags(availableTags);
  input.value = '';
  render();
}

function handleDeleteTag(tagName) {
  const result  = deleteTag(availableTags, tasks, tagName);
  availableTags = result.tags;
  tasks         = result.tasks;
  if (tagFilter === tagName) tagFilter = null;
  saveTags(availableTags);
  render();
}

// ── Handlers — Filtros ─────────────────────────
function handleStatusFilter(filter) {
  statusFilter = filter;
  updateStatusFilters(filter);
  render();
}

function handleTagFilter(tag) {
  tagFilter = tagFilter === tag ? null : tag;
  render();
}

// ── Handler — Tema ─────────────────────────────
function handleToggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  saveTheme(isDark ? 'dark' : 'light');
  applyTheme(isDark);
}

// ── Eventos ────────────────────────────────────
document.getElementById('addBtn').addEventListener('click', handleAddTask);

document.getElementById('taskTitle').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleAddTask();
});

document.getElementById('taskDesc').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleAddTask();
});

document.getElementById('createTagBtn').addEventListener('click', handleCreateTag);

document.getElementById('newTagInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleCreateTag();
});

document.getElementById('saveEditBtn').addEventListener('click', handleSaveEdit);
document.getElementById('closeEditBtn').addEventListener('click', () => { editingTaskId = null; closeEditModal(); });
document.getElementById('cancelEditBtn').addEventListener('click', () => { editingTaskId = null; closeEditModal(); });

document.getElementById('confirmDeleteBtn').addEventListener('click', handleConfirmDelete);
document.getElementById('cancelDeleteBtn').addEventListener('click', () => { deletingTaskId = null; closeConfirmModal(); });

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => handleStatusFilter(btn.dataset.filter));
});

document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value;
  render();
});

document.getElementById('themeBtn').addEventListener('click', handleToggleTheme);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    editingTaskId  = null;
    deletingTaskId = null;
    closeEditModal();
    closeConfirmModal();
  }
});

// ── Inicio ─────────────────────────────────────
async function init() {
  applyTheme(loadTheme() === 'dark');
  tasks = await loadTasks();
  render();
}

init();
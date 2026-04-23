// ==========================================
// MÓDULO: ui.js
// Responsabilidad: manipulación del DOM
// ==========================================

/**
 * Formatea una fecha ISO a dd/mm/yyyy
 * @param {string} isoStr
 * @returns {string}
 */
function formatDate(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Formatea una fecha yyyy-mm-dd a dd/mm/yyyy
 * @param {string} dateStr
 * @returns {string}
 */
function formatDueDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return '—';
  return `${d}/${m}/${y}`;
}

/**
 * Construye un chip de etiqueta seleccionable
 * @param {string} tag
 * @param {boolean} isSelected
 * @param {Function} onChange
 * @returns {HTMLElement}
 */
function buildTagChip(tag, isSelected, onChange) {
  const chip = document.createElement('span');
  chip.className = `tag-chip-check${isSelected ? ' selected' : ''}`;
  chip.dataset.tag = tag;
  chip.textContent = tag;
  chip.addEventListener('click', () => {
    const nowSelected = !chip.classList.contains('selected');
    onChange(nowSelected, tag);
  });
  return chip;
}

/**
 * Renderiza la tabla de tareas
 * @param {Array} tasks
 * @param {Object} callbacks - { onComplete, onEdit, onDelete }
 */
export function renderTable(tasks, { onComplete, onEdit, onDelete }) {
  const tbody     = document.getElementById('taskTableBody');
  const emptyDiv  = document.getElementById('emptyState');
  const tableWrap = document.querySelector('.table-wrap');
  tbody.innerHTML = '';

  if (tasks.length === 0) {
    tableWrap.style.display = 'none';
    emptyDiv.style.display  = 'block';
    return;
  }

  tableWrap.style.display = 'block';
  emptyDiv.style.display  = 'none';

  tasks.forEach(task => {
    const tr = document.createElement('tr');
    if (task.completed) tr.classList.add('is-completed');

    // Título + tags
    const tdTitle  = document.createElement('td');
    const titleDiv = document.createElement('div');
    titleDiv.className = `cell-title${task.completed ? ' done-text' : ''}`;
    titleDiv.textContent = task.title || '(sin título)';
    tdTitle.appendChild(titleDiv);

    if (task.tags && task.tags.length > 0) {
      const tagRow = document.createElement('div');
      tagRow.className = 'cell-tags';
      task.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className   = 'inline-tag';
        tag.textContent = t;
        tagRow.appendChild(tag);
      });
      tdTitle.appendChild(tagRow);
    }

    // Descripción
    const tdDesc = document.createElement('td');
    tdDesc.className   = 'cell-desc';
    tdDesc.textContent = task.description || '—';

    // Fecha creación
    const tdCreated = document.createElement('td');
    tdCreated.className   = 'cell-date';
    tdCreated.textContent = formatDate(task.createdAt);

    // Fecha límite
    const tdDue = document.createElement('td');
    tdDue.className   = 'cell-date';
    tdDue.textContent = formatDueDate(task.dueDate);

    // Completado
    const tdDone    = document.createElement('td');
    tdDone.className = 'cell-done';
    const toggleBtn = document.createElement('button');
    toggleBtn.className   = `complete-toggle${task.completed ? ' checked' : ''}`;
    toggleBtn.title       = task.completed ? 'Marcar como pendiente' : 'Marcar como completada';
    toggleBtn.textContent = '✓';
    toggleBtn.addEventListener('click', () => onComplete(task.id));
    tdDone.appendChild(toggleBtn);

    // Acciones
    const tdActions = document.createElement('td');
    tdActions.className = 'cell-actions';
    const actWrap   = document.createElement('div');
    actWrap.className = 'actions-wrap';

    const editBtn = document.createElement('button');
    editBtn.className   = 'btn-edit';
    editBtn.textContent = '✎ Editar';
    editBtn.addEventListener('click', () => onEdit(task.id));

    const delBtn = document.createElement('button');
    delBtn.className   = 'btn-delete';
    delBtn.textContent = '✕ Eliminar';
    delBtn.addEventListener('click', () => onDelete(task.id));

    actWrap.appendChild(editBtn);
    actWrap.appendChild(delBtn);
    tdActions.appendChild(actWrap);

    tr.append(tdTitle, tdDesc, tdCreated, tdDue, tdDone, tdActions);
    tbody.appendChild(tr);
  });
}

/**
 * Renderiza el selector de tags del formulario de nueva tarea
 * @param {Array} availableTags
 * @param {Array} selectedTags
 * @param {Function} onChange
 */
export function renderNewTaskTagSelector(availableTags, selectedTags, onChange) {
  const container = document.getElementById('newTaskTagSelector');
  container.innerHTML = '';
  availableTags.forEach(tag => {
    const chip = buildTagChip(tag, selectedTags.includes(tag), onChange);
    container.appendChild(chip);
  });
}

/**
 * Renderiza el selector de tags del modal de edición
 * @param {Array} availableTags
 * @param {Array} selectedTags
 * @param {Function} onChange
 */
export function renderEditTagSelector(availableTags, selectedTags, onChange) {
  const container = document.getElementById('editTagSelector');
  container.innerHTML = '';
  availableTags.forEach(tag => {
    const chip = buildTagChip(tag, selectedTags.includes(tag), onChange);
    container.appendChild(chip);
  });
}

/**
 * Renderiza la sección de gestión de etiquetas
 * @param {Array} availableTags
 * @param {Function} onDelete
 */
export function renderTagsManagement(availableTags, onDelete) {
  const container = document.getElementById('tagListManage');
  container.innerHTML = '';
  availableTags.forEach(tag => {
    const chip  = document.createElement('span');
    chip.className = `tag-manage-chip${tag === 'general' ? ' is-general' : ''}`;
    const label = document.createElement('span');
    label.textContent = tag;
    chip.appendChild(label);
    if (tag !== 'general') {
      const del = document.createElement('button');
      del.className   = 'delete-tag';
      del.textContent = '✕';
      del.title       = `Eliminar etiqueta "${tag}"`;
      del.addEventListener('click', () => onDelete(tag));
      chip.appendChild(del);
    }
    container.appendChild(chip);
  });
}

/**
 * Renderiza los filtros de etiquetas en la barra superior
 * @param {Array} availableTags
 * @param {string|null} activeTag
 * @param {Function} onFilter
 */
export function renderTagFilters(availableTags, activeTag, onFilter) {
  const container = document.getElementById('tagFilters');
  container.innerHTML = '';
  availableTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className   = `tag-filter-btn${activeTag === tag ? ' active' : ''}`;
    btn.textContent = tag;
    btn.addEventListener('click', () => onFilter(tag));
    container.appendChild(btn);
  });
}

/**
 * Actualiza los botones de filtro de estado
 * @param {string} activeFilter
 */
export function updateStatusFilters(activeFilter) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === activeFilter);
  });
}

/**
 * Abre el modal de edición con los datos de la tarea
 * @param {Object} task
 * @param {Array} availableTags
 * @param {Array} selectedTags
 * @param {Function} onTagChange
 */
export function openEditModal(task, availableTags, selectedTags, onTagChange) {
  document.getElementById('editTitle').value   = task.title       || '';
  document.getElementById('editDesc').value    = task.description || '';
  document.getElementById('editDueDate').value = task.dueDate     || '';
  renderEditTagSelector(availableTags, selectedTags, onTagChange);
  document.getElementById('editModal').style.display = 'flex';
}

/**
 * Cierra el modal de edición
 */
export function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

/**
 * Abre el modal de confirmación de eliminación
 */
export function openConfirmModal() {
  document.getElementById('confirmModal').style.display = 'flex';
}

/**
 * Cierra el modal de confirmación
 */
export function closeConfirmModal() {
  document.getElementById('confirmModal').style.display = 'none';
}

/**
 * Muestra error en el input de título
 * @param {string} inputId
 * @param {string} placeholder
 */
export function showInputError(inputId, placeholder) {
  const input = document.getElementById(inputId);
  input.classList.add('error');
  const original = input.placeholder;
  input.placeholder = placeholder;
  setTimeout(() => {
    input.classList.remove('error');
    input.placeholder = original;
  }, 2000);
}

/**
 * Aplica el tema oscuro o claro
 * @param {boolean} isDark
 */
export function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
}
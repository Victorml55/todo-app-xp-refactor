// ==========================================
// MÓDULO: routes.js
// Responsabilidad: endpoints REST
// ==========================================

import express from 'express';
import { getAllTasks, getTaskById, insertTask, updateTask, removeTask } from './data.js';

const router = express.Router();

// GET /api/tasks — obtener todas las tareas
router.get('/', (req, res) => {
  res.json(getAllTasks());
});

// GET /api/tasks/:id — obtener una tarea por ID
router.get('/:id', (req, res) => {
  const task = getTaskById(Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.json(task);
});

// POST /api/tasks — crear una tarea
router.post('/', (req, res) => {
  const { title, description, dueDate, tags } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  const task = insertTask({ title, description, dueDate, tags });
  res.status(201).json(task);
});

// PUT /api/tasks/:id — actualizar una tarea
router.put('/:id', (req, res) => {
  const { title, description, dueDate, tags, completed } = req.body;
  if (title !== undefined && title.trim() === '') {
    return res.status(400).json({ error: 'El título no puede estar vacío' });
  }
  const raw = { title: title?.trim(), description, dueDate, tags, completed };
  const changes = Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== undefined));
  const updated = updateTask(Number(req.params.id), changes);
  if (!updated) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.json(updated);
});

// DELETE /api/tasks/:id — eliminar una tarea
router.delete('/:id', (req, res) => {
  const deleted = removeTask(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.json({ message: 'Tarea eliminada correctamente' });
});

export default router;
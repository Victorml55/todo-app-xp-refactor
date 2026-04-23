// ==========================================
// MÓDULO: server.js
// Responsabilidad: configuración del servidor
// ==========================================

import express from 'express';
import cors    from 'cors';
import taskRoutes from './routes.js';

const app  = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/tasks', taskRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'ToDo API corriendo correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
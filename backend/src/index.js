/**
 * 🚀 TrendingClips Backend
 * Servidor Express para la plataforma de videos cortos
 */

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rutas de ejemplo
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TrendingClips Backend is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    name: 'TrendingClips API',
    version: '1.0.0',
    description: 'Plataforma de videos cortos estilo TikTok',
    endpoints: {
      health: 'GET /api/health',
      auth: 'POST /api/auth/register, POST /api/auth/login',
      videos: 'GET /api/videos, POST /api/videos',
      users: 'GET /api/users/:id, PUT /api/users/:id',
      messages: 'GET /api/messages, POST /api/messages'
    }
  });
});

// Socket.io - Eventos en tiempo real
io.on('connection', (socket) => {
  console.log(`[Socket.io] Usuario conectado: ${socket.id}`);

  // Evento: Usuario entra a chat
  socket.on('join-chat', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`[Socket.io] ${socket.id} se unió a chat de usuario ${userId}`);
  });

  // Evento: Enviar mensaje en tiempo real
  socket.on('send-message', (data) => {
    const { senderId, receiverId, message } = data;
    io.to(`user-${receiverId}`).emit('receive-message', {
      senderId,
      message,
      timestamp: new Date().toISOString()
    });
  });

  // Evento: Notificación de like
  socket.on('like-video', (data) => {
    const { userId, videoId, likedBy } = data;
    io.to(`user-${userId}`).emit('notification', {
      type: 'like',
      message: `${likedBy} le gustó tu video`,
      videoId,
      timestamp: new Date().toISOString()
    });
  });

  // Evento: Notificación de nuevo comentario
  socket.on('new-comment', (data) => {
    const { userId, videoId, commentBy } = data;
    io.to(`user-${userId}`).emit('notification', {
      type: 'comment',
      message: `${commentBy} comentó tu video`,
      videoId,
      timestamp: new Date().toISOString()
    });
  });

  // Evento: Nuevo seguidor
  socket.on('new-follow', (data) => {
    const { userId, followedBy } = data;
    io.to(`user-${userId}`).emit('notification', {
      type: 'follow',
      message: `${followedBy} te ha seguido`,
      timestamp: new Date().toISOString()
    });
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log(`[Socket.io] Usuario desconectado: ${socket.id}`);
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    status: err.status || 500
  });
});

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🎬 TrendingClips Backend              ║
║  ✅ Servidor iniciado                  ║
║  🔗 http://localhost:${PORT}              ║
╚════════════════════════════════════════╝
  `);
  console.log('Socket.io activo para comunicación en tiempo real');
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
});

module.exports = { app, io };
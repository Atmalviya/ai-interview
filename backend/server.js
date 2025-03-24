const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const socketService = require('./services/socketService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: config.cors
});

// Socket connection handling
io.on('connection', (socket) => {
  socketService.setupSocket(socket);
});

// Start server
httpServer.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running on port ${config.port}`);
}); 
// chess-backend/server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Chess = require('chess.js').Chess;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve a simple message at the root URL
app.get('/', (req, res) => {
  res.send('Chess backend running!');
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  const game = new Chess();

  console.log('New client connected');

  // Listen for moves from the client
  socket.on('makeMove', (move) => {
    const result = game.move(move);

    if (result) {
      io.emit('moveMade', game.fen()); // Broadcast the updated board to all clients
    } else {
      socket.emit('invalidMove'); // Notify the client of an invalid move
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

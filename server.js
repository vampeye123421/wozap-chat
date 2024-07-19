// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files from 'public' folder

// Handle new socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Broadcast incoming messages to all clients
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Handle private messages
  socket.on('private message', ({ recipient, message }) => {
    io.to(recipient).emit('private message', message);
  });

  // Handle group messages
  socket.on('group message', ({ group, message }) => {
    io.to(group).emit('group message', message);
  });

  // Handle user joining a group
  socket.on('join group', (group) => {
    socket.join(group);
  });

  // Handle user leaving a group
  socket.on('leave group', (group) => {
    socket.leave(group);
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

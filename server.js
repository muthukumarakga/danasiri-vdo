const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');

// Serve files from the 'public' folder
app.use(express.static('public'));

// This handles the room-based URL (e.g., /studio)
app.get('/:room', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        socket.to(roomId).emit('peer-ready');
    });

    socket.on('signal', (data) => {
        socket.to(data.roomId).emit('signal', data.content);
    });
});

const PORT = 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');

// Crucial: This tells the server to look in the 'public' folder for index.html
app.use(express.static('public'));

// Enables custom room names in the URL
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
    console.log(`DANASIRI SERVER ONLINE: Port ${PORT}`);
});

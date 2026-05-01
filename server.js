const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { 
    cors: { origin: "*" },
    transports: ['websocket'] 
});

app.use(express.static('public'));

app.get('/:room', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
        // Alert the room that someone is ready
        socket.to(roomId).emit('peer-ready', socket.id);
    });

    socket.on('signal', (data) => {
        // Relays: offer, answer, ice-candidates, or custom triggers
        socket.to(data.roomId).emit('signal', data.content);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`DANASIRI ENGINE RUNNING ON PORT ${PORT}`);
});

const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" },
    methods: ["GET", "POST"]
});

app.use(express.static('public'));

// Vanity Route: Served as /roomName
app.get('/:room', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('Engine Link Established:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined address: ${roomId}`);
        // Notify others in the room
        socket.to(roomId).emit('peer-joined', socket.id);
    });

    socket.on('signal', (data) => {
        // Relay signaling (Offer/Answer/ICE)
        socket.to(data.roomId).emit('signal', data.content);
    });

    socket.on('disconnect', () => console.log('Link Severed:', socket.id));
});

const PORT = 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ======================================
    DANASIRI ENGINE ACTIVE
    PORT: ${PORT}
    ======================================
    `);
});

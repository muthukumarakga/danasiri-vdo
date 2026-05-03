const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');

app.use(express.static('public'));

app.get('/:room', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        // Tell the broadcaster a viewer is ready to receive
        socket.to(roomId).emit('peer-ready'); 
    });

    socket.on('signal', (data) => {
        // Pass WebRTC signals (SDP/Candidates) between push and view
        socket.to(data.roomId).emit('signal', data.content);
    });
});

const PORT = 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`DANASIRI SERVER ONLINE: Port ${PORT}`);
});

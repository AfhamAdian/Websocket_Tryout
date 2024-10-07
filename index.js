const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cookie = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookie());
app.use(express.json());

io.on('connection', socket => {
    console.log(`A user connected ${socket.id}`);

    socket.on('message', (message, first, roomId) => {
        try {
            if (first == 'first') {
                console.log(first);
                socket.broadcast.emit('message', `First message ${message}`);
            } else {
                console.log(first);
                console.log(roomId);
                console.log(message);
                if (roomId) {
                    socket.to(roomId).emit('message', message);
                } else {
                    socket.broadcast.emit('message', message);
                }
            }
        } catch (error) {
            console.error('Error handling message event:', error);
        }
    });

    socket.on('joinRoom', roomId => {
        try {
            console.log(roomId);
            socket.join(roomId);
        } catch (error) {
            console.error('Error handling joinRoom event:', error);
        }
    });
});

app.post('/joinRoom', async (req, res) => {
    try {
        const roomId = req.body.roomId;
        console.log(roomId);
        res
            .status(200)
            .cookie("roomId", roomId)
            .json({ payLoad: "Room Joined" });
    } catch (error) {
        console.error('Error in /joinRoom route:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
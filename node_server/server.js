const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';
const MAX_MESSAGE_LENGTH = 500;
const MAX_NAME_LENGTH = 40;
const MAX_HISTORY_PER_PICTURE = 100;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: CLIENT_ORIGIN } });

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pictures = [
    { id: 1, url: '/imgs/a.jpg', artist: 'Artist 1', description: 'Lorem ipsum' },
    { id: 2, url: '/imgs/b.jpg', artist: 'Artist 2', description: 'Lorem ipsum' },
    { id: 3, url: '/imgs/a.jpg', artist: 'Artist 3', description: 'Lorem ipsum' },
    { id: 4, url: '/imgs/b.jpg', artist: 'Artist 4', description: 'Lorem ipsum' },
    { id: 5, url: '/imgs/a.jpg', artist: 'Artist 5', description: 'Lorem ipsum' },
    { id: 6, url: '/imgs/b.jpg', artist: 'Artist 6', description: 'Lorem ipsum' },
    { id: 7, url: '/imgs/a.jpg', artist: 'Artist 7', description: 'Lorem ipsum' },
    { id: 8, url: '/imgs/b.jpg', artist: 'Artist 8', description: 'Lorem ipsum' },
];

// In-memory chat history, keyed by picture id
const messagesByPicture = new Map();

const findPicture = (id) => pictures.find(p => p.id === Number(id));
const roomName = (pictureId) => `picture:${pictureId}`;

app.get('/api/pictures', (req, res) => {
    const search = String(req.query.search || '').trim().toLowerCase();
    const result = search
        ? pictures.filter(p => p.artist.toLowerCase().includes(search))
        : pictures;
    res.json(result);
});

app.get('/api/pictures/:id', (req, res) => {
    const picture = findPicture(req.params.id);
    if (!picture) {
        return res.status(404).json({ error: 'Picture not found' });
    }
    res.json(picture);
});

app.get('/api/pictures/:id/messages', (req, res) => {
    if (!findPicture(req.params.id)) {
        return res.status(404).json({ error: 'Picture not found' });
    }
    res.json(messagesByPicture.get(Number(req.params.id)) || []);
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinPicture', (pictureId) => {
        const picture = findPicture(pictureId);
        if (!picture) return;

        // A socket discusses one picture at a time
        for (const room of socket.rooms) {
            if (room.startsWith('picture:')) socket.leave(room);
        }
        socket.join(roomName(picture.id));
        socket.emit('history', messagesByPicture.get(picture.id) || []);
    });

    socket.on('leavePicture', (pictureId) => {
        socket.leave(roomName(Number(pictureId)));
    });

    socket.on('newMessage', (payload) => {
        const picture = findPicture(payload && payload.pictureId);
        const text = String((payload && payload.text) || '').trim().slice(0, MAX_MESSAGE_LENGTH);
        const author = String((payload && payload.author) || '').trim().slice(0, MAX_NAME_LENGTH) || 'Anonymous';
        if (!picture || !text) return;

        const message = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            pictureId: picture.id,
            author,
            text,
            timestamp: new Date().toISOString(),
        };

        const history = messagesByPicture.get(picture.id) || [];
        history.push(message);
        if (history.length > MAX_HISTORY_PER_PICTURE) history.shift();
        messagesByPicture.set(picture.id, history);

        io.to(roomName(picture.id)).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

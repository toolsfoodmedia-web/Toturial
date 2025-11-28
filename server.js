const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Data files
const VIDEOS_FILE = path.join(__dirname, 'videos.json');
const PPTS_FILE = path.join(__dirname, 'ppts.json');

// Helper functions
function readData(file) {
    try {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify([], null, 2));
        }
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
}

function writeData(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data:', error);
    }
}

// Video endpoints
app.get('/api/videos', (req, res) => {
    const videos = readData(VIDEOS_FILE);
    res.json(videos);
});

app.post('/api/videos', (req, res) => {
    const videos = readData(VIDEOS_FILE);
    const newVideo = {
        id: Date.now().toString(),
        ...req.body
    };
    videos.push(newVideo);
    writeData(VIDEOS_FILE, videos);
    res.json(newVideo);
});

app.put('/api/videos/:id', (req, res) => {
    const videos = readData(VIDEOS_FILE);
    const index = videos.findIndex(v => v.id === req.params.id);
    if (index !== -1) {
        videos[index] = { ...videos[index], ...req.body };
        writeData(VIDEOS_FILE, videos);
        res.json(videos[index]);
    } else {
        res.status(404).json({ error: 'Video not found' });
    }
});

app.delete('/api/videos/:id', (req, res) => {
    const videos = readData(VIDEOS_FILE);
    const filteredVideos = videos.filter(v => v.id !== req.params.id);
    if (filteredVideos.length !== videos.length) {
        writeData(VIDEOS_FILE, filteredVideos);
        res.json({ message: 'Video deleted' });
    } else {
        res.status(404).json({ error: 'Video not found' });
    }
});

// PPT endpoints
app.get('/api/ppts', (req, res) => {
    const ppts = readData(PPTS_FILE);
    res.json(ppts);
});

app.post('/api/ppts', (req, res) => {
    const ppts = readData(PPTS_FILE);
    const newPpt = {
        id: Date.now().toString(),
        ...req.body
    };
    ppts.push(newPpt);
    writeData(PPTS_FILE, ppts);
    res.json(newPpt);
});

app.put('/api/ppts/:id', (req, res) => {
    const ppts = readData(PPTS_FILE);
    const index = ppts.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        ppts[index] = { ...ppts[index], ...req.body };
        writeData(PPTS_FILE, ppts);
        res.json(ppts[index]);
    } else {
        res.status(404).json({ error: 'PPT not found' });
    }
});

app.delete('/api/ppts/:id', (req, res) => {
    const ppts = readData(PPTS_FILE);
    const filteredPpts = ppts.filter(p => p.id !== req.params.id);
    if (filteredPpts.length !== ppts.length) {
        writeData(PPTS_FILE, filteredPpts);
        res.json({ message: 'PPT deleted' });
    } else {
        res.status(404).json({ error: 'PPT not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../dist', 'index.html')));
} else {
  app.use(express.static(path.join(__dirname, '../public')));
}

app.get('/api/presentations', async (req, res) => {
  try {
    const Presentation = require('./models/Presentation');
    const presentations = await Presentation.find();
    res.json(presentations);
  } catch (err) {
    console.error('Error fetching presentations:', err);
    res.status(500).json({ error: 'Failed to fetch presentations' });
  }
});

app.post('/api/presentations', async (req, res) => {
  try {
    const Presentation = require('./models/Presentation');
    const presentation = new Presentation(req.body);
    await presentation.save();
    res.json(presentation);
  } catch (err) {
    console.error('Error creating presentation:', err);
    res.status(500).json({ error: 'Failed to create presentation' });
  }
});

require('./sockets')(io);

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in .env');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.js (Updated Backend - Conditional _id Visibility Based on Requester Role)

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();

app.use(express.json());
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const NoteSchema = new mongoose.Schema({
  content: String,
  createdBy: String
});

const Note = mongoose.model('Note', NoteSchema);

const users = [
  { username: 'user', password: 'user', role: 'user' },
  { username: 'admin', password: 'admin', role: 'admin' }
];

const secret = process.env.JWT_SECRET || 'fallback-secret'; // Use env for production

// Middleware to authenticate JWT
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username: user.username, role: user.role }, secret, { expiresIn: '1h' });
  res.json({ token });
});

// Get all notes (Updated: If requester is admin, show _id for all; else omit _id for admin-created notes)
app.get('/notes', authenticate, async (req, res) => {
  const notes = await Note.find();
  const isRequesterAdmin = req.user.role === 'admin';
  const transformedNotes = notes.map(note => {
    const noteObj = note.toObject();
    if (!isRequesterAdmin && noteObj.createdBy === 'admin') {
      const { _id, ...rest } = noteObj;
      return rest;
    } else {
      return noteObj;
    }
  });
  res.json(transformedNotes);
});

// Create a note
app.post('/notes', authenticate, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content required' });

  const note = new Note({ content, createdBy: req.user.username });
  await note.save();
  res.json(note);
});

// Delete a note (only by creator or admin)
app.delete('/notes/:id', authenticate, async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });

  // if (note.createdBy !== req.user.username && req.user.role !== 'admin') {
  //   return res.status(403).json({ error: 'Unauthorized to delete this note' });
  // }

  await Note.deleteOne({ _id: req.params.id });
  res.json({ success: true });
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Explicit root handler
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
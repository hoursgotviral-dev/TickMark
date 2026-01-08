
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { tag, q } = req.query;
  let query = { userId: req.userId };

  if (tag) query.tags = tag;
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } }
    ];
  }

  const notes = await Note.find(query).sort({ createdAt: -1 });
  res.json(notes);
});

router.post('/', async (req, res) => {
  const { title, content, tags } = req.body;
  const note = new Note({ title, content, tags, userId: req.userId });
  await note.save();
  res.status(201).json(note);
});

router.delete('/:id', async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Deleted' });
});

module.exports = router;

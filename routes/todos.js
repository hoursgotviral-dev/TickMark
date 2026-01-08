
const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(todos);
});

router.post('/', async (req, res) => {
  const { title, priority } = req.body;
  const todo = new Todo({ title, priority, userId: req.userId });
  await todo.save();
  res.status(201).json(todo);
});

router.patch('/:id', async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
});

router.delete('/:id', async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Deleted' });
});

module.exports = router;

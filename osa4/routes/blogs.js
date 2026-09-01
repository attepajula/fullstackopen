// routes/blogs.js
const express = require('express');
const Blog = require('../models/blog');
const router = express.Router();

router.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

router.post('/', async (req, res) => {
  try {
    const blog = new Blog(req.body)
    const result = await blog.save()
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, context: 'query' }
    )
    if (!updated) return res.status(404).end()
    res.json(updated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
// 4.13 & 4.14 too

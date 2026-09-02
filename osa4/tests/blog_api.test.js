const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let testUser
let token

const initialBlogs = [
  {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5
  },
  {
    title: 'Another Blog',
    author: 'Jane Doe',
    url: 'http://example.com/another',
    likes: 10
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('testpassword', 10)
  testUser = await new User({ username: 'testuser', name: 'Test User', passwordHash }).save()

  token = jwt.sign({ username: testUser.username, id: testUser._id }, process.env.SECRET)

  const blogsWithUser = initialBlogs.map(b => ({ ...b, user: testUser._id }))
  await Blog.insertMany(blogsWithUser)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog posts have id property instead of _id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert.ok(blog.id)
  assert.strictEqual(blog._id, undefined)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog Post',
    author: 'Test Author',
    url: 'http://example.com/new',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await Blog.find({})
  assert.strictEqual(blogsAfter.length, initialBlogs.length + 1)

  const titles = blogsAfter.map(b => b.title)
  assert.ok(titles.includes('New Blog Post'))
})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newBlog = {
    title: 'No Token Blog',
    author: 'Test Author',
    url: 'http://example.com/no-token',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAfter = await Blog.find({})
  assert.strictEqual(blogsAfter.length, initialBlogs.length)
})

test('likes defaults to 0 if missing from request', async () => {
  const newBlog = {
    title: 'Blog Without Likes',
    author: 'Test Author',
    url: 'http://example.com/no-likes'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added and returns 400', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'http://example.com/no-title',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAfter = await Blog.find({})
  assert.strictEqual(blogsAfter.length, initialBlogs.length)
})

test('blog without url is not added and returns 400', async () => {
  const newBlog = {
    title: 'No URL Blog',
    author: 'Test Author',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAfter = await Blog.find({})
  assert.strictEqual(blogsAfter.length, initialBlogs.length)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedData = { likes: blogToUpdate.likes + 1 }

  const response = await api
    .put(`/api/blogs/${blogToUpdate._id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
})

test('updating a non-existent blog returns 404', async () => {
  const nonExistentId = new mongoose.Types.ObjectId()

  await api
    .put(`/api/blogs/${nonExistentId}`)
    .send({ likes: 99 })
    .expect(404)
})

test('a blog can be deleted by its creator', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAfter = await Blog.find({})
  assert.strictEqual(blogsAfter.length, initialBlogs.length - 1)

  const titles = blogsAfter.map(b => b.title)
  assert.ok(!titles.includes(blogToDelete.title))
})

test('deleting a blog without token returns 401', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .expect(401)

  const blogsAfter = await Blog.find({})
  assert.strictEqual(blogsAfter.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})

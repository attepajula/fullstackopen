const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  await new User({ username: 'root', name: 'Root User', passwordHash }).save()
})

describe('creating a new user', () => {
  test('succeeds with valid data', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'keksi',
      name: 'Cookie Monster',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await User.find({})
    assert.strictEqual(usersAfter.length, usersAtStart.length + 1)

    const usernames = usersAfter.map(u => u.username)
    assert.ok(usernames.includes('mluukkai'))
  })

  test('fails with 400 if username already taken', async () => {
    const usersAtStart = await User.find({})

    const duplicateUser = {
      username: 'root',
      name: 'Another Root',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)

    assert.ok(result.body.error)

    const usersAfter = await User.find({})
    assert.strictEqual(usersAfter.length, usersAtStart.length)
  })

  test('fails with 400 if password is too short', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'shortpass',
      name: 'Short Pass',
      password: 'ab'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.ok(result.body.error.includes('3 characters'))

    const usersAfter = await User.find({})
    assert.strictEqual(usersAfter.length, usersAtStart.length)
  })

  test('fails with 400 if username is too short', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'validpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.ok(result.body.error.includes('3 characters'))

    const usersAfter = await User.find({})
    assert.strictEqual(usersAfter.length, usersAtStart.length)
  })

  test('fails with 400 if username is missing', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      name: 'No Username',
      password: 'validpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.ok(result.body.error)

    const usersAfter = await User.find({})
    assert.strictEqual(usersAfter.length, usersAtStart.length)
  })

  test('fails with 400 if password is missing', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'nopassword',
      name: 'No Password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.ok(result.body.error)

    const usersAfter = await User.find({})
    assert.strictEqual(usersAfter.length, usersAtStart.length)
  })

  test('passwordHash is not exposed in response', async () => {
    const newUser = {
      username: 'matti',
      name: 'Test User',
      password: 'validpassword'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    assert.strictEqual(response.body.passwordHash, undefined)
    assert.ok(response.body.id)
  })
})

describe('GET /api/users', () => {
  test('returns all users as JSON', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})

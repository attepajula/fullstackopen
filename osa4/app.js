const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRoutes = require('./routes/blogs')

mongoose.set('strictQuery', false)

const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRoutes)

module.exports = app

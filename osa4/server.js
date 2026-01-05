// server.js
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogs');

const app = express();

mongoose.set('debug', true);

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogRoutes);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

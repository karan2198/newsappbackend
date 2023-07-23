const express = require('express');
const http = require('http'); // Change 'https' to 'http'
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const app = express();
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 5000;
const frontendURL = 'https://main--newsappkaran.netlify.app'; // Replace this with your deployed frontend URL

app.use(cors({
  origin:frontendURL, // Allow requests from the deployed frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));



app.get('/', (req, res) => {
  res.redirect('/news');
});

app.get('/news', async (req, res) => {
  const page = req.query.page || 1;
  const q = req.query.q || 'sports';
  const customDate = req.query.date; // Get the custom date from req.query

  let currentDate;
  if (customDate) {
    currentDate = customDate;
  } else {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    currentDate = yesterday.toISOString().slice(0, 10);
  }

  const url = `https://newsapi.org/v2/everything?q=${q}&from=${currentDate}&to=${currentDate}&pageSize=32&page=${page}&sortBy=popularity&apiKey=${apiKey}`;
  try {
    const newsResponse = await axios.get(url);
    res.json(newsResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news data' });
  }
});

// Create an HTTP server
http.createServer(app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});

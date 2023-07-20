const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// const keyFilePath = path.join('C:', 'Users', 'karan', 'OneDrive', 'Desktop', 'NewsAPIapp', 'localhost-key.pem');
const keyFilePath = './localhost-key.pem'
// const keyFilePath = path.join('./','localhost-key.pem')

// const certFilePath = path.join('C:', 'Users', 'karan', 'OneDrive', 'Desktop', 'NewsAPIapp', 'localhost.pem');
// const certFilePath = path.join('./', 'localhost.pem')
const certFilePath = './localhost.pem'

require('dotenv').config();

const cors = require('cors');
const app = express();
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 5000;
app.use(cors({
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.get('/', (req, res) => {
  res.redirect('/news');
});

app.get('/news', async (req, res) => {
  const page = req.query.page || 1;
  const q = req.query.q || 'sports';
  const url = `https://newsapi.org/v2/everything?q=${q}&from=2023-07-15&to=2023-07-15&pageSize=20&page=${page}&sortBy=popularity&apiKey=${apiKey}`;
  try {
    const newsResponse = await axios.get(url);
    res.json(newsResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news data' });
  }
});

const options = {
  key: fs.readFileSync(keyFilePath),
  cert: fs.readFileSync(certFilePath),
};

// Create an HTTPS server
https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});

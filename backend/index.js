const cors = require('cors');
const express = require('express');
const connectToMongo = require('./db');

require('dotenv').config();
const PORT = process.env.PORT;

const app = express()

app.use(cors());
app.use(express.json());

connectToMongo();

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/auth', require('./routes/driverauth.js'))
app.use('/api/list', require('./routes/list'))


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
const cors = require('cors');
const express = require('express');
const connectToMongo = require('./db');

const app = express()

app.use(cors());
app.use(express.json());

connectToMongo();
const port = 5000

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/list', require('./routes/list'))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
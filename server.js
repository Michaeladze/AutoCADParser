const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

const data = fs.readFileSync('./assets/data1.dxf', { encoding: 'utf-8' })

app.get('/getData', (req, res) => {
  res.json({
    data
  })
})

app.listen(4300);

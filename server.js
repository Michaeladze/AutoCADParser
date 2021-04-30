const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

app.get('/getData/:id', (req, res) => {

  fs.readFile(`./assets/data${req.params.id}.dxf`, 'utf-8', (err, data) => {
    if (err) throw err;
    res.json({data});
  });
})


app.listen(4300, () => {
  console.log(`Сервер взлетел`);

});

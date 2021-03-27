const express = require('express'),
  app = express(),
  webp = require('webp-converter');

app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  const data = req.body;
  const input = data.file;
  const output = data.to;

  webp.cwebp(input, output, `-q ${data.quality} -mt`, logging = '-v')
    .then((status) => res.status(200).send({ status: Number(200), message: status }));
});

app.listen(8085);

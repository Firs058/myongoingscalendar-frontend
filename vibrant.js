const express = require('express'),
  app = express(),
  Vibrant = require('node-vibrant');

app.get('/', (req, res) => {
  let result = {};
  Vibrant.from(req.query.path).getPalette()
    .then(swatches => {
      for (let swatch in swatches)
        if (swatches.hasOwnProperty(swatch) && swatches[swatch])
          result[swatch.charAt(0).toLowerCase() + swatch.slice(1)] = swatches[swatch].getHex();
    })
    .then(() => res.status(200).send(result))
    .catch(error => res.status(404).send(error));
});

app.listen(8083);

const express = require('express'),
    app = express(),
    webp = require('webp-converter');

app.use(express.json({type: 'application/json'}));
app.use(express.urlencoded({extended: true}));

app.post('/', (req, res) => {
    const data = req.body;
    const input = data.file;
    const output = data.to;

    webp.cwebp(input, output, `-q ${data.quality} -mt`, (status, error) => {
        if (Number(status) === 100)
            res.status(200).send({status: Number(status), message: `Image converted: ${output}`});
        else
            res.status(200).send({status: Number(status), message: error});
    });
});

app.listen(8085);

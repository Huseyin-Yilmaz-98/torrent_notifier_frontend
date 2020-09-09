const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const https = require('https');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

https.createServer({
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('certificate.crt'),
    ca: fs.readFileSync('ca_bundle.crt')
}, app)
    .listen(80, function () {
        console.log('app working on port 80')
    })
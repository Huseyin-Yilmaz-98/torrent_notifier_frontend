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
    .listen(443, function () {
        console.log('app working on port 443')
    })

const http = express.createServer();


http.get('*', function (req, res) {
    res.redirect('https://' + req.headers.host + req.url);
})

http.listen(8080,()=>{
    console.log("also 8080")
});
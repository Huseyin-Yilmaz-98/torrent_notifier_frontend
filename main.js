const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const https = require("https");
const http = require("http");

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
    console.log(req.headers["host"]);
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

https
    .createServer(
        {
            key: fs.readFileSync("private.key"),
            cert: fs.readFileSync("certificate.crt"),
            ca: fs.readFileSync("ca_bundle.crt"),
        },
        app
    )
    .listen(443, () => console.log("app working on port 443"));

http
    .createServer((req, res) => {
        res.writeHead(301, {
            Location: "https://" + req.headers["host"] + req.url,
        });
        res.end();
    })
    .listen(80, () => console.log("also 80"));

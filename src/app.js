const express = require('express');

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from dashboard!");
});

app.get("/hello", (req, res) => {
    res.send("Hello Devansh");
});

app.get("/test", (req, res) => {
    res.send("Hello from server");
});

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});
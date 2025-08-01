require('dotenv').config();
const express = require('express');
const path = require('node:path');

const app = express();
const port = process.env.PORT || 3000;

app.use("/assets", express.static(path.resolve("./frontend/dist/assets")));

app.get("/", (req, res) => {
    return res.sendFile(path.resolve("./frontend/dist/index.html"));
});

app.get("/api", (req, res) => {
    return res.sendStatus(200);
});

app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
});

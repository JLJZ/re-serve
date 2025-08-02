require('dotenv').config();
const express = require('express');
const path = require('node:path');
const passport = require('./backend/Auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/assets", express.static(path.resolve(__dirname, "frontend", "dist", "assets")));

// server.js or routes.js
app.post('/api/auth/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    res.json({ message: 'Login successful', user: req.user });
  }
);

app.get("/{*splat}", (req, res) => {
    return res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
});

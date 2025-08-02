require('dotenv').config();
const express = require('express');
const path = require('node:path');
const { BasicStrategy } = require('passport-http');
const { findOne } = require('./backend/UserRepository');

const app = express();
const port = process.env.PORT || 3000;

app.use("/assets", express.static(path.resolve(_-dirname, "frontend", "dist", "assets")));

app.get("/api/auth/login", (req, res) => {
    passport.use(new BasicStrategy((username, password, done) => {
            findOne(username, (err, user) => {
                if(err) { return done(err); }
                if(!user) { return done(null, false); }
                if(!user.validPassword(password)) { return done(null, false); }

                return done(null, user);
            });
        }
    ));
});

app.get("/{*splat}", (req, res) => {
    return res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
});

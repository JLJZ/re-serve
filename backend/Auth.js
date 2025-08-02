// auth.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { findOneByUsername } = require('./UserRepository');

const bcrypt = require('bcrypt');

function verifyPassword(password, hashed_password) {
    return bcrypt.compareSync(password, hashed_password);
}

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        password: 'password'
    },
    async function (username, password, done) {
        try {
            const user = await findOneByUsername(username);
            if (!user) return done(null, false, { message: 'User not found' });

            const isValid = await verifyPassword(password, user.password);
            if (!isValid) return done(null, false, { message: 'Wrong password' });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));


module.exports = passport;
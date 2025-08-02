const sql = require('./Postgres.js');
const bcrypt = require('bcrypt');

async function hashPassword(plainText) {
    const saltRounds = 10;
    return bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(plainText, salt, (err, hash) => {
            return hash;
        })
    });
}

async function insertOne({
    name,
    email,
    password,
    school
}) {
    const hashedPassword = await hashPassword(password);
    try {
        const result = await sql`
            INSERT INTO users (name, email, password)
                VALUES (${name}, ${email}, ${hashedPassword}, ${school})
                RETURNING id;
        `;
        return result[0].id;
    } catch(error) {
        console.error(error);
    }
    finally {
        await sql.end();
    }
}

async function findOne({ username }) {
    const user = await sql`
        select
            id,
            username,
            password,
        from users
        where username == ${username}
    `;
    return user;
}

module.exports = {
    findOne
}
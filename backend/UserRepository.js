const sql = require('./Postgres.js');
const bcrypt = require('bcrypt');

async function hashPassword(plainText) {
    const saltRounds = 10;
    return await bcrypt.hash(plainText, saltRounds);
}

async function findOneById({
    id: id
}) {
    try {
        const [user] = await sql`
            SELECt * FROM users where id = ${id}`;
        return user;
    } catch(error) {
        console.error(error);
    }
    finally {
        await sql.end();
    }
}

async function findOneByUsername(username) {
    const [user] = await sql`
        select * from users
        where email = ${username};
    `;
    return user;
}

async function insertOne({
    name,
    email,
    password,
    school
}) {
    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);
    try {
        const result = await sql`
            INSERT INTO users (name, email, password, faculty)
                VALUES (${name}, ${email}, ${hashedPassword}, ${school})
                RETURNING id;
        `;
        return result[0].id;
    } catch(error) {
        console.error(error);
    }
}

module.exports = {
    findOneById,
    findOneByUsername,
    insertOne
}
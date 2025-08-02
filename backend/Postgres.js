const postgres = require('postgres');

const sql = postgres(process.env.PGURL);

module.exports = sql;
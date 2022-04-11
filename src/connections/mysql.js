const mysql = require("mysql2")

//conexão com o banco de dados para utilizar basta mudar o seu banco pessoal para utilizar esse.
const pool = mysql.createPool({
    "user": process.env.SQL_USER,
    "password": process.env.SQL_PASS,
    "database": process.env.SQL_DATABASE,
    "host": process.env.SQL_HOST,
    "port": process.env.SQL_PORT
})

// exporta as informações para onde precisar
exports.pool = pool;
const mysql = require("mysql2/promise");

async function myDbConnection() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  console.log("Database connected successfully!");
  return conn;
}

module.exports = myDbConnection;

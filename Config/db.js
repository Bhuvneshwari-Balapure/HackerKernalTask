const { Model } = require("objection");
const Knex = require("knex");
require("dotenv").config();
const knex = Knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "taskmanager",
  },
});

Model.knex(knex);

module.exports = knex;

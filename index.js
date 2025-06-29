const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
require("dotenv").config();

const myDbConnection = require("./Config/db"); // db connect karne wala function
const userRoutes = require("./route/UserRoute");
const taskRoutes = require("./route/TaskRoute");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const hbs = handlebars.create({ extname: ".hbs" });
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

const Port = process.env.PORT || 8000;
app.use(express.static("public"));

myDbConnection()
  .then(function (con) {
    app.locals.db = con;

    app.use("/", userRoutes);
    app.use("/", taskRoutes);

    app.listen(Port, function () {
      console.log(`Server started at port ${Port}`);
    });
  })
  .catch(function (error) {
    console.log("Something went wrong while connecting to database:", error);
  });

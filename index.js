const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
require("dotenv").config();
require("./Config/db");

// Routes
const userRoutes = require("./route/UserRoute");
const taskRoutes = require("./route/TaskRoute");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

const hbs = handlebars.create({ extname: ".hbs" });
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

const PORT = process.env.PORT || 8000;

app.use("/", userRoutes);
app.use("/", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

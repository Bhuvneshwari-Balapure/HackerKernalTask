const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");

// Routes
router.get("/", userController.getUserData);
router.get("/getAll", userController.getUserData);

// router.get("/getById/:id", userController.getUserById);
router.get("/adduser", (req, res) => {
  res.render("add-user");
});
router.post("/create", userController.createUser);
router.get("/deleteuser/:id", userController.deleteUser);
router.get("/tasks/:id", userController.getUserTasks);

module.exports = router;

const express = require("express");
const router = express.Router();
const taskController = require("../controller/TaskController");

router.get("/task", taskController.showTaskForm);

router.post("/task", taskController.saveTask);
router.get("/display-task", taskController.displayTasks);

module.exports = router;

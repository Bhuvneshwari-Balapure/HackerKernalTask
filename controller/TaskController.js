const ExcelJS = require("exceljs");
const User = require("../modal/userModal");
const Task = require("../modal/taskModal");

//  All Users
const showTaskForm = async (req, res) => {
  try {
    const users = await User.query();
    res.render("add-task", { users });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Error loading form");
  }
};

// ✅ Save New Task to DB
const saveTask = async (req, res) => {
  const { user_id, task_name, status } = req.body;

  if (!user_id || !task_name || !status) {
    return res.status(400).send("Please fill all fields");
  }

  try {
    await Task.query().insert({
      user_id,
      task_name,
      status,
    });

    const users = await User.query();
    res.render("add-task", { users, alert: "Task added!" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Error saving task");
  }
};

// ✅ Display All Tasks with User Names (JOIN)
const displayTasks = async (req, res) => {
  try {
    const tasks = await Task.query().withGraphFetched("user");
    const taskData = tasks.map((task) => ({
      id: task.id,
      task_name: task.task_name,
      status: task.status,
      user_name: task.user?.name || "N/A",
    }));

    res.render("display-task", { tasks: taskData });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Error fetching tasks");
  }
};

// Data to Excel
const exportExcel = async (req, res) => {
  try {
    const users = await User.query();
    const tasks = await Task.query().withGraphFetched("user");

    const workbook = new ExcelJS.Workbook();

    const userSheet = workbook.addWorksheet("User");
    userSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Name", key: "name" },
      { header: "Email", key: "email" },
      { header: "Mobile", key: "mobile" },
    ];
    users.forEach((user) => userSheet.addRow(user));

    const taskSheet = workbook.addWorksheet("Task");
    taskSheet.columns = [
      { header: "ID", key: "id" },
      { header: "Task Name", key: "task_name" },
      { header: "Status", key: "status" },
      { header: "Assigned To", key: "assigned_to" },
    ];
    tasks.forEach((task) => {
      taskSheet.addRow({
        id: task.id,
        task_name: task.task_name,
        status: task.status,
        assigned_to: task.user ? task.user.name : "N/A",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_tasks.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.log("Excel Export Error:", err);
    res.status(500).send("Could not generate Excel file");
  }
};

module.exports = {
  showTaskForm,
  saveTask,
  displayTasks,
  exportExcel,
};

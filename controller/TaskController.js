const showTaskForm = async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.render("add-task", { users });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Error loading form");
  }
};

const saveTask = async (req, res) => {
  const db = req.app.locals.db;
  const { user_id, task_name, status } = req.body;

  if (!user_id || !task_name || !status) {
    return res.status(400).send("Please fill all fields");
  }

  try {
    await db.query(
      "INSERT INTO tasks (user_id, task_name, status) VALUES (?, ?, ?)",
      [user_id, task_name, status]
    );
    const [users] = await db.query("SELECT * FROM users");
    res.render("add-task", { users, alert: "Task added!" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Error saving task");
  }
};
const displayTasks = async (req, res) => {
  const db = req.app.locals.db;
  const [tasks] = await db.query(`
    SELECT tasks.id, tasks.task_name, tasks.status, users.name
    FROM tasks
    JOIN users ON tasks.user_id = users.id
  `);

  res.render("display-task", { tasks });
};

module.exports = { showTaskForm, saveTask, displayTasks };

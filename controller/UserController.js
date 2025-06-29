const getUserData = async (req, res) => {
  const db = req.app.locals.db;
  try {
    const data = await db.query("SELECT * FROM users");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No data found",
      });
    }
    res.render("view-user", { rows: data[0] });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  const db = req.app.locals.db;
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "Valid User ID is required",
      });
    }
    const data = await db.query(`SELECT * FROM users WHERE id = ?`, [userId]);
    if (!data || data.length === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.render("user-details", { user: data[0] });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const createUser = async (req, res) => {
  const db = req.app.locals.db;
  try {
    const { name, email, mobile } = req.body;
    if (!name || !email || !mobile) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }
    const data = await db.query(
      `INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)`,
      [name, email, mobile]
    );
    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Failed to create user",
      });
    }
    // res.status(201).send({
    //   success: true,
    //   message: "User created successfully",
    //   userId: data.insertId,
    // });
    res.redirect("/");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const db = req.app.locals.db;
  const id = req.params.id;

  try {
    //pehle us user ka task  Delete hoga
    await db.query("DELETE FROM tasks WHERE user_id = ?", [id]);

    // usek baad Delete user
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.redirect("/");
  } catch (err) {
    console.log("User delete error:", err);
    res.send("Something went wrong");
  }
};
const getUserTasks = async (req, res) => {
  const db = req.app.locals.db;
  const userId = req.params.id;

  try {
    const [tasks] = await db.query("SELECT * FROM tasks WHERE user_id = ?", [
      userId,
    ]);
    const [userData] = await db.query("SELECT name FROM users WHERE id = ?", [
      userId,
    ]);
    const userName = userData.length > 0 ? userData[0].name : "Unknown User";
    res.render("user-tasks", {
      tasks,
      userId,
      userName,
    });
  } catch (err) {
    console.log("task error:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getUserData,
  getUserById,
  createUser,
  deleteUser,
  getUserTasks,
};

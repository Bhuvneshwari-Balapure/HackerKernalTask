const User = require("../modal/userModal");
const Task = require("../modal/taskModal");

// Get All User
const getUserData = async (req, res) => {
  try {
    const users = await User.query();
    if (!users || users.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No data found",
      });
    }
    res.render("view-user", { rows: users });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// User By ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "Valid User ID is required",
      });
    }

    const user = await User.query().findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.render("user-details", { user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Create  User
const createUser = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    if (!name || !email || !mobile) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const newUser = await User.query().insert({ name, email, mobile });
    if (!newUser) {
      return res.status(500).send({
        success: false,
        message: "Failed to create user",
      });
    }

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

//Delete User and  Tasks
const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await Task.query().delete().where("user_id", id);
    await User.query().deleteById(id);

    res.redirect("/");
  } catch (err) {
    console.log("User delete error:", err);
    res.send("Something went wrong");
  }
};

// Get All Tasks user ka
const getUserTasks = async (req, res) => {
  const userId = req.params.id;

  try {
    const tasks = await Task.query().where("user_id", userId);
    const user = await User.query().findById(userId);

    const userName = user?.name || "Unknown User";

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

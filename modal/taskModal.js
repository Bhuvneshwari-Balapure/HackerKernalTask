const { Model } = require("objection");

class Task extends Model {
  static get tableName() {
    return "tasks";
  }

  static get relationMappings() {
    const User = require("./userModal");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "tasks.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Task;

"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
      // define association here
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }
    static getTodo() {
      return this.findAll();
    }
    static deletetodo(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
        },
      });
    }

    static async dueLater(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().split("T")[0],
          },
          userId,
          // completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async overdue(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toISOString().split("T")[0],
          },
          userId,
          // completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString().split("T")[0],
          },
          userId,
          // completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static completedItem(userId) {
      //In order to get only completed Todos
      return this.findAll({
        where: {
          completed: true,
          userId,
        },
        order: [["id", "ASC"]],
      });
    }
    markAsCompleted() {
      return this.update({ completed: true });
    }
    setcompletionstatus(bool) {
      const notbool = !bool;
      return this.update({ completed: notbool });
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          len: 5,
        },
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: true,
          len: 5,
        },
      },
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};

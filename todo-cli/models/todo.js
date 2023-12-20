'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static async markAsComplete(id) {
      try {
        const todo = await Todo.findByPk(id);

        if (!todo) {
          throw new Error('Task not found');
        }

        todo.completed = true;
        await todo.save();

        console.log(`Task with id ${id} marked as complete.`);
      } catch (error) {
        console.error('Error marking task as complete:', error.message);
        throw error;
      }
    }
    static async addTask(params) {
      try {
        const newTask = await Todo.create({
          title: params.title,
          DueDate: params.dueDate, // Use correct case for DueDate
          completed: params.completed,
        });

        console.log("New Task:", newTask.toJSON());

        return newTask;
      } catch (error) {
        console.error('Error adding task:', error.message);
        throw error;
      }
    }
    static async showList() {
      const todos = await Todo.findAll();

      // Categorize tasks based on due dates
      const overdue = [];
      const dueToday = [];
      const dueLater = [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      todos.forEach((todo) => {
        const dueDate = new Date(todo.DueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate < today) {
          overdue.push(todo);
        } else if (dueDate.getTime() === today.getTime()) {
          dueToday.push(todo);
        } else {
          dueLater.push(todo);
        }
      });

      // Print the categorized tasks
      console.log('My Todo-list\n');

      console.log('Overdue');
      printTask(overdue);

      console.log('\nDue Today');
      printTask(dueToday);

      console.log('\nDue Later');
      printTask(dueLater);
    }

  }
  Todo.init({
    title: DataTypes.STRING,
    DueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};

function printTask(tasks) {
  tasks.forEach((task, index) => {
    const checkbox = task.completed ? '[x]' : '[ ]';
    console.log(`${index + 1}. ${checkbox} ${task.title} ${task.DueDate ? task.DueDate : ''}`);
  });
}
// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Todo extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }

//     static async markAsComplete(id) {
//       try {
//         const todo = await Todo.findByPk(id);

//         if (!todo) {
//           throw new Error('Task not found');
//         }

//         todo.completed = true;
//         await todo.save();

//         console.log(`Task with id ${id} marked as complete.`);
//       } catch (error) {
//         console.error('Error marking task as complete:', error.message);
//         throw error;
//       }
//     }

//     static async addTask(params) {
//       try {
//         const newTask = await Todo.create({
//           title: params.title,
//           DueDate: params.dueDate, // Use correct case for DueDate
//           completed: params.completed,
//         });

//         console.log("New Task:", newTask.toJSON());

//         return newTask;
//       } catch (error) {
//         console.error('Error adding task:', error.message);
//         throw error;
//       }
//     }

//     static async showList() {
//       const todos = await Todo.findAll();

//       // Categorize tasks based on due dates
//       const overdue = [];
//       const dueToday = [];
//       const dueLater = [];

//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       todos.forEach((todo) => {
//         const dueDate = new Date(todo.DueDate);
//         dueDate.setHours(0, 0, 0, 0);

//         if (dueDate < today) {
//           overdue.push(todo);
//         } else if (dueDate.getTime() === today.getTime()) {
//           dueToday.push(todo);
//         } else {
//           dueLater.push(todo);
//         }
//       });

//       // Print the categorized tasks
//       console.log('My Todo-list\n');

//       console.log('Overdue');
//       printTask(overdue);

//       console.log('\nDue Today');
//       printTask(dueToday);

//       console.log('\nDue Later');
//       printTask(dueLater);
//     }

//   }
//   Todo.init({
//     title: DataTypes.STRING,
//     DueDate: DataTypes.DATEONLY,
//     completed: DataTypes.BOOLEAN
//   }, {
//     sequelize,
//     modelName: 'Todo',
//   });
//   return Todo;
// };

// function printTask(tasks) {
//   tasks.forEach((task, index) => {
//     const checkbox = task.completed ? '[x]' : '[ ]';
//     console.log(`${index + 1}. ${checkbox} ${task.title} ${task.DueDate ? task.DueDate : ''}`);
//   });
// }

// models/todo.js
'use strict';
const {
  Model, Op, where
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdueTasks = await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() }

        },
      });
      overdueTasks.forEach(task => {
        console.log(task.displayableString());
      });
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const TodaydueTasks = await Todo.findAll({
        where: {
          dueDate: { [Op.eq]: new Date() }

        },
      });
      TodaydueTasks.forEach(task => {
        console.log(task.displayableString());
      });
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const LaterdueTasks = await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() }

        },
      });
      LaterdueTasks.forEach(task => {
        console.log(task.displayableString());
      });
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() }
        }
      });

    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      return await Todo.findAll({
        where: {
          dueDate: { [Op.eq]: new Date() }
        }
      });

    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() }
        }
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      await Todo.update({ completed: true }, {
        where: {
          id: id
        }
      });

    }

    displayableString() {
      const today = new Date().toLocaleDateString();
      const dueDate = new Date(this.dueDate).toLocaleDateString();

      if (dueDate === today) {
        const checkbox = this.completed ? "[x]" : "[ ]";
        return `${this.id}. ${checkbox} ${this.title}`;
      }

      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};

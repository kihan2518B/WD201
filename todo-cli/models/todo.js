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

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
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

    static async overdue() {
      const todos = await Todo.findAll();
      return todos.filter(todo => todo.DueDate && new Date(todo.DueDate) < new Date());
    }

    static async dueToday() {
      const todos = await Todo.findAll();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return todos.filter(todo => todo.DueDate && new Date(todo.DueDate).getTime() === today.getTime());
    }

    static async dueLater() {
      const todos = await Todo.findAll();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return todos.filter(todo => !todo.DueDate || new Date(todo.DueDate) > today);
    }

    static async displayableString(todo) {
      const checkbox = todo.completed ? '[x]' : '[ ]';
      let dueDateString = '';

      if (todo.DueDate) {
        const dueDate = new Date(todo.DueDate);
        dueDateString = todo.completed ? '' : ` ${dueDate.toLocaleDateString()}`;
      }

      return `${todo.id}. ${checkbox} ${todo.title}${dueDateString}`;
    }

    static async printTask(tasks) {
      const resolvedTasks = await Promise.all(tasks);
      resolvedTasks.forEach(task => {
        console.log(task);
      });
    }

    // static async showList() {
    //   const todos = await Todo.findAll();

    //   // Categorize tasks based on due dates
    //   const overdue = [];
    //   const dueToday = [];
    //   const dueLater = [];

    //   const today = new Date();
    //   today.setHours(0, 0, 0, 0);

    //   todos.forEach((todo) => {
    //     const dueDate = new Date(todo.DueDate);

    //     if (isNaN(dueDate.getTime())) {
    //       console.error(`Invalid due date for task with ID ${todo.id}`);
    //       return;
    //     }

    //     dueDate.setHours(0, 0, 0, 0);

    //     if (dueDate < today) {
    //       overdue.push(todo);
    //     } else if (dueDate.getTime() === today.getTime()) {
    //       dueToday.push(todo);
    //     } else {
    //       dueLater.push(todo);
    //     }
    //   });

    //   // Print the categorized tasks
    //   console.log('My Todo-list\n');

    //   console.log('Overdue');
    //   Todo.printTask(overdue);

    //   console.log('\nDue Today');
    //   Todo.printTask(dueToday);

    //   console.log('\nDue Later');
    //   Todo.printTask(dueLater);
    // }
    static async showList() {
      const overdue = await Todo.overdue();
      const dueToday = await Todo.dueToday();
      const dueLater = await Todo.dueLater();

      // Print the categorized tasks
      console.log('My Todo-list\n');

      console.log('Overdue');
      await Todo.printTask(overdue);

      console.log('\nDue Today');
      await Todo.printTask(dueToday);

      console.log('\nDue Later');
      await Todo.printTask(dueLater);
    }

    // Add this updated printTask method to your Todo class
    static async printTask(tasks) {
      const resolvedTasks = await Promise.all(tasks);
      resolvedTasks.forEach(async (task, index) => {
        const resolvedTask = await task; // Ensure the promise is resolved
        console.log(`${index + 1}. ${await Todo.displayableString(resolvedTask)}`);
      });
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

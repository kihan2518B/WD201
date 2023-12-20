// addTodo.js
var argv = require("minimist")(process.argv.slice(2));
const db = require("./models/index");
const Todo = require("./models/index");

const createTodo = async (params) => {
  try {
    await db.Todo.addTask(params);
  } catch (error) {
    console.error(error);
  }
};

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};
(async () => {
  const { title, dueInDays } = argv;
  if (!title || dueInDays === undefined) {
    throw new Error(
      'title and dueInDays are required. \nSample command: node addTodo.js --title="Buy milk" --dueInDays=-2 '
    );
  }

  //to delete any Item
  // const DeleteItem = async (id) => {
  //   try {
  //     const deletedRowCount = await db.Todo.destroy({
  //       where: {
  //         id: id
  //       }
  //     });

  //     if (deletedRowCount > 0) {
  //       console.log(`Successfully deleted task with id ${id}`);
  //     } else {
  //       console.log(`Task with id ${id} not found`);
  //     }
  //   } catch (error) {
  //     console.error('Error while deleting task:', error.message);
  //   }
  // };
  await createTodo({ title, dueDate: getJSDate(dueInDays), completed: false });
  await db.Todo.showList();

})();

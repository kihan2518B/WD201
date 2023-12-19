const todolist = require("../todo");

const {
  all,
  add,
  markAsComplete,
  overdue,
  dueToday,
  dueLater,
  toDisplayableList,
} = todolist;

describe("Todolist Test", () => {
  const Item = todolist();

  test("should Add Todo item", () => {
    const todoItemlength = Item.all.length;
    // console.log(todoItemlength);
    Item.add({
      title: "Test Todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(Item.all.length).toBe(todoItemlength + 1);
  });

  test("should mark a todo as complete", () => {
    const todoItemlength = Item.all.length;
    // console.log("todoItemlength" + todoItemlength);
    expect(Item.all[todoItemlength - 1].completed).toBe(false);
    Item.markAsComplete(todoItemlength - 1);
    expect(Item.all[todoItemlength - 1].completed).toBe(true);
  });

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  test("Retrieval of overdue Items", () => {
    const todoItemlength = Item.all.length;
    Item.overdue();
    expect(todoItemlength).toBe(1);
  });

  test("Retrieval of Due today Items", () => {
    const todoItemlength = Item.all.length;
    Item.dueToday();
    expect(todoItemlength).toBe(1);
  });

  test("Retrieval of dueLater Items", () => {
    const todoItemlength = Item.all.length;
    Item.dueLater();
    expect(todoItemlength).toBe(1);
  });

  test("To Displayable List", () => {
    const displayabletodo = Item.toDisplayableList(Item.all);
    expect(typeof displayabletodo).toBe("string");
  });
});

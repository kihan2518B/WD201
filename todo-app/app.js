const express = require("express");
const app = express();
const { Todo } = require("./models");
const path = require("path");
const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get("/", async function (request, response) {
  // response.send("Hello World");
  const allTodo = await Todo.getTodo();
  const overdueTodos = await Todo.overdue();
  const dueTodayTodos = await Todo.dueToday();
  const dueLaterTodos = await Todo.dueLater();
  // const markAsCompleted = await Todo.markAsCompleted();
  // const Delete = await Todo.deletetodo()

  if (request.accepts("html")) {
    response.render("index", {
      allTodo,
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
    });
  } else {
    response.json({ allTodo });
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");

  // FILL IN YOUR CODE HERE
  try {
    const todos = await Todo.findAll();
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }

  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("Delete a todo by ID:", request.params.id);

  try {
    const deletedItem = await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });
    response.send(deletedItem ? true : false);
  } catch (error) {
    console.error(error);
    return response.status(442).json(error);
  }
});

module.exports = app;

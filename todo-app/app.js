const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.send("Hello World");
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");

  // FILL IN YOUR CODE HERE
  try {
    const todos = await Todo.findAll()
    return response.json(todos);
  } catch (error) {
    console.log(error)
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
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
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

app.delete("/todos/:id/deleteitem", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  const ID = request.params.id
  const todo = await Todo.findByPk(ID);
  // FILL IN YOUR CODE HERE
  try {
    const deleteTodo = await todo.deletetodo()
    console.log(`Item with id:${ID} Deleted`)
    response.send(deleteTodo ? true : false);
    // response.send({ success: true });
  } catch (error) {
    console.log(error)
    return response.status(422).json(err);
  }
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
});

module.exports = app;

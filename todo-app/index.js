const express = require("express");
const app = express();
const { Todo } = require("./models");
// const { bodyParser } = require('body-parser')
app.use(express.json());

app.get("/todos", async (request, response) => {
  // response.send('hello world')
  const todoItems = await Todo.gettodo();
  response.json(todoItems);
});

app.post("/todos", async (request, response) => {
  // console.log('Created Todo', request.body)
  try {
    const todo = await Todo.addtodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

//https://mttodoapp.com/todos/123/markascompleted
app.put("/todos/:id/markascompleted", async (request, response) => {
  // console.log('Updated Todo with id', request.params.id)
  const todo = await Todo.findByPk(request.params.id);
  try {
    const UpdatedTodo = await todo.markAsCompleted();
    return response.json(UpdatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", (request, response) => {
  console.log("Item Deleted with id", request.params.id);
});
app.listen(3000, () => {
  try {
    console.log("server is running on port 3000");
  } catch (err) {
    console.log("error while running server");
  }
});

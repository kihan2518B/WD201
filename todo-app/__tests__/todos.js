const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
// const { Json } = require("sequelize/types/utils");

let server, agent;
function extractCsrf(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let token = extractCsrf(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: token,
  });
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("checking signup ", async () => {
    let res = await agent.get("/signup");
    let token = extractCsrf(res);
    res = await agent.post("/users").send({
      firstName: "test",
      lastName: "usera",
      email: "usera@gmail.com",
      password: "123456789",
      _csrf: token,
    });
    expect(res.statusCode).toBe(302);
  });

  test("SignOut", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const agent = request.agent(server);
    await login(agent, "usera@gmail.com", "123456789");
    let res = await agent.get("/todos");
    let token = extractCsrf(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      _csrf: token,
    });
    expect(response.statusCode).toBe(302); //302 is success code for http redirect
  });

  test("Toogles completion status if true then do false and vice versa", async () => {
    const agent = request.agent(server);
    await login(agent, "usera@gmail.com", "123456789");
    let res = await agent.get("/todos");
    let token = extractCsrf(res);
    //creating todo
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      _csrf: token,
    });
    //getting all todos from database
    const groupOfTodos = await agent
      .get(`/todos`)
      .set("Accept", "application/json"); //This method is used to set HTTP headers for the request.
    const parsedgroupOfTodos = JSON.parse(groupOfTodos.text);
    //counting todo to find last added todo
    const dueTodaycount = parsedgroupOfTodos.dueTodayTodos.length;
    //getting last todo from array of all todos
    const lastTodo = parsedgroupOfTodos.dueTodayTodos[dueTodaycount - 1]; //getting last todo array
    const booleanValue = lastTodo.completed; //initial value

    console.log("Last Todo", lastTodo);

    res = await agent.get("/todos");
    token = extractCsrf(res);

    const updatedresponse1 = await agent.put(`/todos/${lastTodo.id}`).send({
      completed: booleanValue,
      _csrf: token,
    });
    const updatedparsedResponse = JSON.parse(updatedresponse1.text);
    const oppositeboolean = !booleanValue; //after updated value
    console.log("OppositeBoolean", oppositeboolean);
    expect(updatedparsedResponse.completed).toBe(oppositeboolean);
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    const agent = request.agent(server);
    await login(agent, "usera@gmail.com", "123456789");
    let res = await agent.get("/todos");
    let token = extractCsrf(res);
    //creating todo
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      _csrf: token,
    });
    //getting all todos from database
    const groupOfTodos = await agent
      .get(`/todos`)
      .set("Accept", "application/json"); //This method is used to set HTTP headers for the request.
    const parsedgroupOfTodos = JSON.parse(groupOfTodos.text);
    //counting todo to find last added todo
    const dueTodaycount = parsedgroupOfTodos.dueTodayTodos.length;
    //getting last todo from array of all todos
    const lastTodo = parsedgroupOfTodos.dueTodayTodos[dueTodaycount - 1]; //getting last todo array

    console.log("Last Todo", lastTodo);

    res = await agent.get("/todos");
    token = extractCsrf(res);

    const deletedresponse = await agent
      .delete(`/todos/${lastTodo.id}/delete`)
      .send({
        _csrf: token,
      });
    console.log("deleted response", deletedresponse);
    // const updatedparsedResponse = JSON.parse(updatedresponse1.text);
    // const oppositeboolean = !booleanValue; //after updated value
    expect(deletedresponse.statusCode).toBe(200);
  });
  // test("Fetches all todos in the database using /todos endpoint", async () => {
  //     await agent.post("/todos").send({
  //         title: "Buy xbox",
  //         dueDate: new Date().toISOString().split('T')[0],
  //         completed: false,
  //     });
  //     await agent.post("/todos").send({
  //         title: "Buy ps3",
  //         dueDate: new Date().toISOString(),
  //         completed: false,
  //     });

  //     //Getting all todos and checking the length of parsedResponse
  //     const response = await agent.get("/todos");
  //     const parsedResponse = JSON.parse(response.text);
  //     expect(parsedResponse.length).toBe(4);
  //     expect(parsedResponse[3]["title"]).toBe("Buy ps3"); //Checking Is Index[1] is Same or not
  // });
});

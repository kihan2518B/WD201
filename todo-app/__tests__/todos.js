const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => { });
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

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Marks a todo with the given ID as complete", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    expect(parsedResponse.completed).toBe(false);

    const markCompleteResponse = await agent
      .put(`/todos/${todoID}/markASCompleted`)
      .send();
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Fetches all todos in the database using /todos endpoint", async () => {
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    //Getting all todos and checking the length of parsedResponse
    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.length).toBe(4);
    expect(parsedResponse[3]["title"]).toBe("Buy ps3"); //Checking Is Index[1] is Same or not
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    //adding Reponse 
    const response = await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString()
    });

    //Parsing the Respose To check If Added or not
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
    const todoID = parsedResponse.id;
    //Checking if size in data is 5
    const Getresponse = await agent.get("/todos");
    const parsedGetResponse = JSON.parse(Getresponse.text);
    expect(parsedGetResponse.length).toBe(5);

    //Deleting response and checking that it is returning true or not
    const DeletedResponse = await agent.delete(`/todos/${todoID}/deleteitem`).send();
    expect(DeletedResponse.statusCode).toBe(200);

    // const parsedUpdateResponse = JSON.parse(DeletedResponse.text);
    // const responseBody = response.body;

    // Check if the 'success' property is a boolean.
    // expect(responseBody.success).toBeDefined();
    // expect(typeof responseBody.success).toBe('boolean');

    // geting All Response to check length of response
    const GetAllResponse = await agent.get("/todos");
    const parsedGetAllResponse = JSON.parse(GetAllResponse.text)
    expect(parsedGetAllResponse.length).toBe(4);

  });
});

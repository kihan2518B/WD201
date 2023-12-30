/* eslint-disable */
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Will responds with json at /json", async () => {
    const response = await agent.post("/todos").send({
      title: "complete assignment",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8",
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Mark as Complete", async () => {
    const response = await agent.post("/todos").send({
      title: "complete assignment",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    const parsedResponse = JSON.parse(response.text);
    const Todoid = parsedResponse.id;
    expect(parsedResponse.completed).toBe(false);

    const markedascompleted = await agent
      .put(`/todos/${Todoid}/markascompleted`)
      .send();
    const ParsedUpdatedresponse = JSON.parse(markedascompleted.text);
    expect(ParsedUpdatedresponse.completed).toBe(true);
  });
});

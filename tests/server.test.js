const request = require('supertest');
const app = require('../index');

describe("Pruebas API REST Marketplace", () => {
  it("GET /posts debe responder con código 200 y un Array", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("POST /users debe responder con 400 si faltan datos", async () => {
    const response = await request(app).post("/users").send({});
    expect(response.statusCode).toBe(400);
  });

  it("GET /users/me debe responder 401 sin Token", async () => {
    const response = await request(app).get("/users/me");
    expect(response.statusCode).toBe(401);
  });

  it("GET /posts/999999 debe responder 404", async () => {
    const response = await request(app).get("/posts/999999");
    expect(response.statusCode).toBe(404);
  });
});
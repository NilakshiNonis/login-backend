import request from "supertest";
import app from "../src/index";
import { removeTestUsers } from "./mock/function";
import redisClient from '../src/clients/redis'

let tokens: any = null

describe("User Module", () => {


  afterAll(async () => {
    await removeTestUsers();
    redisClient.quit();
  }, 50000);


  it("POST user/ - User Registration - Invalid Payload", async () => {
    const newUser = {
      email: "",
      name: "test",
      password: "test",
    };

    const response = await request(app).post("/user").send(newUser);

    expect(response.status).toBe(422);
  }, 20000);

  it("POST user/ - User Registration - Valid Payload", async () => {
    const newUser = {
      email: "test@abc.com",
      name: "test",
      password: "test",
    };

    const response = await request(app).post("/user").send(newUser);

    expect(response.status).toBe(200);
    expect(response.body.value.user).toHaveProperty("id");
  }, 20000);

  it("POST user/ - User Registration - Duplicate email", async () => {
    const newUser = {
      email: "test@abc.com",
      name: "test",
      password: "test",
    };

    const response = await request(app).post("/user").send(newUser);

    expect(response.status).toBe(409);
  }, 20000);

  it("POST user/login - User Login - Invalid payload", async () => {
    const credentials = {
      email: "",
      password: "test",
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).toBe(422);
  }, 20000);

  it("POST user/login - User Login - User not found", async () => {
    const credentials = {
      email: "test123@abc.com",
      password: "test",
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).toBe(404);
  }, 20000);

  it("POST user/login - User Login - Incorrect password", async () => {
    const credentials = {
      email: "test@abc.com",
      password: "testt",
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).toBe(401);
  }, 20000);

  it("POST user/login - User Login - Valid credentials", async () => {
    const credentials = {
      email: "test@abc.com",
      password: "test",
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).toBe(200);
    expect(response.body.value.user).toHaveProperty("id");
    expect(response.body.value).toHaveProperty("backendTokens");
    tokens = response.body.value.backendTokens;
  }, 20000);

  it("GET user/me - User Details - Valid", async () => {
    
    const response = await request(app).get("/user/me").set("Authorization", "Bearer " + tokens?.token).send();

    expect(response.status).toBe(200);
    expect(response.body.value).toHaveProperty("id");
  }, 20000);

  it("POST user/refresh-token - Generate Refresh Token - Valid", async () => {
    const credentials = {
      refresh_token: tokens?.refreshToken,
    };

    const response = await request(app).post("/user/refresh-token").send(credentials);
    expect(response.status).toBe(200);
    expect(response.body.value.user).toHaveProperty("id");
    
  }, 20000);

  it("POST user/logout - User Logout - Missing token", async () => {
    const credentials = {
      refresh_token: tokens?.refreshToken,
    };

    const response = await request(app).post("/user/logout").send(credentials);

    expect(response.status).toBe(401);
  },20000);

  it("POST user/logout - User Logout - Valid", async () => {
    const credentials = {
      refresh_token: tokens?.refreshToken,
    };

    const response = await request(app).post("/user/logout").set("Authorization", "Bearer " + tokens?.token).send(credentials);

    expect(response.status).toBe(200);
  },20000);


});

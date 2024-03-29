import request from "supertest";
import app from "../src/index";
import { removeTestUsers } from "./mock/function";

afterAll(async () => {
  await removeTestUsers();
});

describe("User Module", () => {
  it("POST user/ - User Registration - Invalid Payload", async () => {
    const newUser = {
      email: "",
      name: "test",
      password: "test",
    };

    const response = await request(app).post("/user").send(newUser);

    expect(response.status).toBe(422);
  });

  it("POST user/ - User Registration - Valid Payload", async () => {
    const newUser = {
      email: "test@abc.com",
      name: "test",
      password: "test",
    };

    const response = await request(app).post("/user").send(newUser);

    expect(response.status).toBe(200);
    expect(response.body.value.user).toHaveProperty("id");
  });

  it("POST user/ - User Registration - Duplicate email", async () => {
    const newUser = {
      email: "test@abc.com",
      name: "test",
      password: "test",
    };

    const response = await request(app).post("/user").send(newUser);

    expect(response.status).toBe(409);
  });

  it("POST user/login - User Login - Invalid payload", async () => {
    const credentials = {
      email: "",
      password: "test",
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).toBe(422);
  });

  it("POST user/login - User Login - User not found", async () => {
    const credentials = {
      email: "test123@abc.com",
      password: "test",
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).toBe(404);
  });

  it("POST user/login - User Login - Incorrect password", async () => {
    const credentials = {
      email: "test@abc.com",
      password: "testt",
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).toBe(401);
  });

  it("POST user/login - User Login - Valid credentials", async () => {
    const credentials = {
      email: "test@abc.com",
      password: "test",
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).toBe(200);
    expect(response.body.value.user).toHaveProperty("id");
  });
});

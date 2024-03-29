import request from "supertest";
import app from "../src/index";
import { addTestUser, removeTestUsers } from "./mock/function";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import moment from "moment";
import { Role } from "../src/utils/enum";

let accessToken = "";

const sampleUser = {
  name: "test",
  email: "sample@abc.com",
  password: crypto
    .createHmac("sha256", process.env.PASSWORD_SECRET_KEY)
    .update("sample")
    .digest("hex"),
  role: Role.USER,
  created_at: moment().unix(),
  updated_at: moment().unix(),
  id: uuidv4(),
};
beforeAll(async () => {
  const adminCredentials = {
    email: "admin@example.com",
    password: "admin",
  };
  const response = await request(app)
    .post("/user/login")
    .send(adminCredentials);

  accessToken = response.body.value.backendTokens.token;
  await addTestUser(sampleUser);
});

afterAll(async () => {
  await removeTestUsers();
});

describe("Admin Module", () => {
  it("GET user/all - Get all users - Valid", async () => {
    const response = await request(app)
      .get("/user/all")
      .set("Authorization", "Bearer " + accessToken)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.value.length).toBe(1);
  });

  it("PUT user/:id - Update user - Invalid payload", async () => {
    const payload = {
      name: "",
    };
    const response = await request(app)
      .put(`/user/${sampleUser.id}`)
      .set("Authorization", "Bearer " + accessToken)
      .send(payload);

    expect(response.status).toBe(422);
  });

  it("PUT user/:id - Update user - Valid payload", async () => {
    const payload = {
      name: `${sampleUser.name} example`,
    };
    const response = await request(app)
      .put(`/user/${sampleUser.id}`)
      .set("Authorization", "Bearer " + accessToken)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.value.name).toEqual(payload.name);
  });

  it("DELETE user/:id - Delete user - Valid", async () => {
    const response = await request(app)
      .delete(`/user/${sampleUser.id}`)
      .set("Authorization", "Bearer " + accessToken)
      .send();
    expect(response.status).toBe(200);
    console.log(response);
  });
});

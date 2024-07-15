import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { Express } from "express";
import { createApp } from "../createApp";
import mongoose from "mongoose";
//THIS WILL RUN ALL TESTS IN THE E2E DIRECTORY
describe("create user and login", () => {
  let app: Express;
  beforeAll(() => {
    //connect to database before the test
    mongoose
      .connect("mongodb://127.0.0.1:27017/express_tutorial_test")
      .then((value) => console.log("Connected to Test Database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  //test the create user scenario
  it("should create the user", async () => {
    //send method pass in the request body
    const response = await request(app).post("/api/users").send({
      username: "adam123",
      password: "password",
      displayName: "Adam The Developer",
    });

    expect(response.statusCode).toBe(201);
  });

  it("should log the user in and visit /api/auth/status2 and return auth user", async () => {
    //send method pass in the request body
    const response = await request(app)
      .post("/api/auth2")
      .send({
        username: "adam123",
        password: "password",
      })
      .then((res) => {
        return (
          request(app)
            .get("/api/auth/status2")
            //we need to set the cookie and send it again because when we call this endpoint the cookie is not persisted, therefore we get not authorized
            .set("Cookie", res.headers["set-cookie"])
        );
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe("adam123");
    expect(response.body.displayName).toBe("Adam The Developer");
  });

  afterAll(async () => {
    //close the connection and drop the test database not the actual database so it doesn't conflict with the other test in another file
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});

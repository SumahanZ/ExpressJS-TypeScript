//Integration testing, testing a specific scenario (login scenario)
//Installing the super test package to do Integration testing, it works well with Jest
//The difference of integration testing is we are actually testing the real implementation, but as a small scenario
//Integration is easier than Unit Testing because we don't have to worry about creating mocks, stubbing, etc since we are actually testing the implementation
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { Express } from "express";
import { createApp } from "../createApp";
import mongoose from "mongoose";

/*
app.get("/hello", (req: Request, res: Response) => {
  return res.status(200).send({});
});

describe("hello endpoint", () => {
  it("get /hello and expect 200", async () => {
    //test this a specific endpoint by passing the specific HTTP Method and the URL
    const response = await request(app).get("/hello");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({});
    // expect(response.body).toEqual()
    // expect(response.body).toContain()
  });
});
*/

describe("/api/auth", () => {
  let app: Express;
  beforeAll(() => {
    //connect to database before the test
    mongoose
      .connect("mongodb://127.0.0.1:27017/express_tutorial_test")
      .then((value) => console.log("Connected to Test Database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  it("should return 401 when not logged in", async () => {
    const response = await request(app).get("/api/auth/status2");
    expect(response.statusCode).toBe(401);
  });

  afterAll(async () => {
    //close the connection and drop the test database
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});

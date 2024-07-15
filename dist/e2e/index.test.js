"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Integration testing, testing a specific scenario (login scenario)
//Installing the super test package to do Integration testing, it works well with Jest
//The difference of integration testing is we are actually testing the real implementation, but as a small scenario
//Integration is easier than Unit Testing because we don't have to worry about creating mocks, stubbing, etc since we are actually testing the implementation
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const createApp_1 = require("../createApp");
const mongoose_1 = __importDefault(require("mongoose"));
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
(0, globals_1.describe)("/api/auth", () => {
    let app;
    (0, globals_1.beforeAll)(() => {
        //connect to database before the test
        mongoose_1.default
            .connect("mongodb://127.0.0.1:27017/express_tutorial_test")
            .then((value) => console.log("Connected to Test Database"))
            .catch((err) => console.log(`Error: ${err}`));
        app = (0, createApp_1.createApp)();
    });
    (0, globals_1.it)("should return 401 when not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/api/auth/status2");
        (0, globals_1.expect)(response.statusCode).toBe(401);
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        //close the connection and drop the test database
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
    }));
});

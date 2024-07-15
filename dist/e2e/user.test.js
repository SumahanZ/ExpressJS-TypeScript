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
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const createApp_1 = require("../createApp");
const mongoose_1 = __importDefault(require("mongoose"));
//THIS WILL RUN ALL TESTS IN THE E2E DIRECTORY
(0, globals_1.describe)("create user and login", () => {
    let app;
    (0, globals_1.beforeAll)(() => {
        //connect to database before the test
        mongoose_1.default
            .connect("mongodb://127.0.0.1:27017/express_tutorial_test")
            .then((value) => console.log("Connected to Test Database"))
            .catch((err) => console.log(`Error: ${err}`));
        app = (0, createApp_1.createApp)();
    });
    //test the create user scenario
    (0, globals_1.it)("should create the user", () => __awaiter(void 0, void 0, void 0, function* () {
        //send method pass in the request body
        const response = yield (0, supertest_1.default)(app).post("/api/users").send({
            username: "adam123",
            password: "password",
            displayName: "Adam The Developer",
        });
        (0, globals_1.expect)(response.statusCode).toBe(201);
    }));
    (0, globals_1.it)("should log the user in and visit /api/auth/status2 and return auth user", () => __awaiter(void 0, void 0, void 0, function* () {
        //send method pass in the request body
        const response = yield (0, supertest_1.default)(app)
            .post("/api/auth2")
            .send({
            username: "adam123",
            password: "password",
        })
            .then((res) => {
            return ((0, supertest_1.default)(app)
                .get("/api/auth/status2")
                //we need to set the cookie and send it again because when we call this endpoint the cookie is not persisted, therefore we get not authorized
                .set("Cookie", res.headers["set-cookie"]));
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.body.username).toBe("adam123");
        (0, globals_1.expect)(response.body.displayName).toBe("Adam The Developer");
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        //close the connection and drop the test database not the actual database so it doesn't conflict with the other test in another file
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
    }));
});

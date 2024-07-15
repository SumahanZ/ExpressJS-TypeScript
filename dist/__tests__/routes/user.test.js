"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const globals_1 = require("@jest/globals");
const helpers = __importStar(require("../../utils/helpers"));
const user_handler_1 = require("../../handlers/user_handler");
const constants_1 = require("../../utils/constants");
//import this validator so we can access the validationResult property, isEmpty, array to assert it
const express_validator_1 = __importDefault(require("express-validator"));
const user_model_1 = require("../../models/user_model");
//used to mock external modules or your own modules (anything to do with modules)
//Mocks a module with an auto-mocked version when it is being required to prevent side-effects/dependent
globals_1.jest.mock("express-validator", () => {
    return {
        //mock the matchedData function to return object {}
        matchedData: globals_1.jest.fn(() => {
            return {
                username: "test123",
                password: "password",
                displayName: "test_name",
            };
        }),
        //mock the validationResult function to return object {}
        validationResult: globals_1.jest.fn(() => {
            return {
                isEmpty: globals_1.jest.fn(() => false),
                array: globals_1.jest.fn(() => [{ msg: "Invalid Field" }]),
            };
        }),
    };
});
//mock our custom module which is helper
globals_1.jest.mock("../../utils/helpers", () => ({
    hashPassword: globals_1.jest.fn((password) => `hashed_${password}`),
}));
//Mock our custom module which is the UserModel Schema
//we do this so we can call the .toHaveBeenCalled() method from jest which requires a mock function
globals_1.jest.mock("../../models/user_model");
const mockRequest = {
    findUserIndex: 1,
};
//mock the functions used
//and call the mock function, we don't wanna call the actual function
const mockResponse = {
    //mock function sendStatus to do nothing basically like () => {}
    sendStatus: globals_1.jest.fn(),
    send: globals_1.jest.fn(),
    //we set status to return itself, so mockResponse will have access to other methods, if we don't do this we can't test for like res.status(400).send()
    status: globals_1.jest.fn(() => mockResponse),
};
(0, globals_1.describe)("get users", () => {
    (0, globals_1.it)("should get user by id", () => {
        (0, user_handler_1.getUserByIdHandler)(mockRequest, mockResponse);
        //check if the mockResponse.send method was called with mockUser data from 1st index
        (0, globals_1.expect)(mockResponse.send).toHaveBeenCalledWith(constants_1.mockUsers[mockRequest.findUserIndex]);
        //check if the mockResponse.send method was called once
        //toHaveBeenCalledTimes, toHaveBeenCalledWith only works with mock function
        (0, globals_1.expect)(mockResponse.send).toHaveBeenCalledTimes(1);
    });
    (0, globals_1.it)("should call sendStatus with 404 when user not found", () => {
        //create a copy of the mock to have the exact copy of the setup mockRequest, but with the findUserIndex set to 100, to simulate a 404 not found
        const copyMockRequest = Object.assign(Object.assign({}, mockRequest), { findUserIndex: 100 });
        (0, user_handler_1.getUserByIdHandler)(copyMockRequest, mockResponse);
        (0, globals_1.expect)(mockResponse.sendStatus).toHaveBeenCalledWith(404);
        (0, globals_1.expect)(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
        (0, globals_1.expect)(mockResponse.send).not.toHaveBeenCalled();
    });
});
//When we are testing a function that has function that belongs to an external library. We don't really care about what the function does since we are mocking it anyways
//We just care about what it returns
//We only care about our own function and the cases it can have, not care about other external
(0, globals_1.describe)("create users", () => {
    const mockRequest = {};
    //without the mock it is actually calling the library
    (0, globals_1.it)("should return status of 400 when there are errors", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_handler_1.createUserHandler)(mockRequest, mockResponse);
        (0, globals_1.expect)(express_validator_1.default.validationResult).toHaveBeenCalledWith(mockRequest);
        (0, globals_1.expect)(express_validator_1.default.validationResult).toHaveBeenCalledTimes(1);
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(400);
        (0, globals_1.expect)(mockResponse.send).toHaveBeenCalledWith({
            errors: [{ msg: "Invalid Field" }],
        });
    }));
    // const newUser = await UserModel.create({
    //   ...data,
    // });
    (0, globals_1.it)("should return status of 201 and the user created", () => __awaiter(void 0, void 0, void 0, function* () {
        //change the empty in the mock module, because it is set to return false, and we need it to be true, to test this specific case
        //Hijack the isEmpty function from isEmpty function from the result of validationResult to return true
        globals_1.jest
            .spyOn(express_validator_1.default, "validationResult")
            .mockImplementationOnce(() => {
            return {
                isEmpty: globals_1.jest.fn(() => true),
            };
        });
        //mock the function save from UserModel, with the default (){}
        const createMethod = globals_1.jest.spyOn(user_model_1.UserModel, "create").mockReturnValueOnce({
            id: 1,
            username: "test123",
            password: "hashed_password",
            displayName: "test_name",
        });
        yield (0, user_handler_1.createUserHandler)(mockRequest, mockResponse);
        (0, globals_1.expect)(express_validator_1.default.matchedData).toHaveBeenCalledWith(mockRequest);
        (0, globals_1.expect)(helpers.hashPassword).toHaveBeenCalledWith("password");
        //check if returned with the correct values
        (0, globals_1.expect)(helpers.hashPassword).toHaveReturnedWith("hashed_password");
        //verify that the constructor is invoked
        // expect(UserModel).toHaveBeenCalledWith({
        //   username: "test123",
        //   password: "hashed_password",
        //   displayName: "test_name",
        // });
        (0, globals_1.expect)(createMethod).toHaveBeenCalled();
        (0, globals_1.expect)(createMethod).toHaveBeenCalledWith({
            username: "test123",
            password: "hashed_password",
            displayName: "test_name",
        });
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(201);
        (0, globals_1.expect)(mockResponse.send).toHaveBeenCalledWith({
            id: 1,
            username: "test123",
            password: "hashed_password",
            displayName: "test_name",
        });
    }));
    (0, globals_1.it)("should return status of 400 when create users throws an error", () => __awaiter(void 0, void 0, void 0, function* () {
        globals_1.jest
            .spyOn(express_validator_1.default, "validationResult")
            .mockImplementationOnce(() => {
            return {
                isEmpty: globals_1.jest.fn(() => true),
            };
        });
        globals_1.jest
            .spyOn(user_model_1.UserModel, "create")
            //because it is an async function, therefore we need to return a promise
            .mockImplementationOnce(() => Promise.reject("Failed to save user"));
        yield (0, user_handler_1.createUserHandler)(mockRequest, mockResponse);
        (0, globals_1.expect)(user_model_1.UserModel.create).toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    }));
});

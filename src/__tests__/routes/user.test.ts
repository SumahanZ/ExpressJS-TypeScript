import { describe, expect, test, it, jest } from "@jest/globals";
import * as helpers from "../../utils/helpers";
import {
  getUserByIdHandler,
  createUserHandler,
} from "../../handlers/user_handler";
import { mockUsers } from "../../utils/constants";
//import this validator so we can access the validationResult property, isEmpty, array to assert it
import validator from "express-validator";
import { UserModel } from "../../models/user_model";

//used to mock external modules or your own modules (anything to do with modules)
//Mocks a module with an auto-mocked version when it is being required to prevent side-effects/dependent
jest.mock("express-validator", () => {
  return {
    //mock the matchedData function to return object {}
    matchedData: jest.fn(() => {
      return {
        username: "test123",
        password: "password",
        displayName: "test_name",
      };
    }),
    //mock the validationResult function to return object {}
    validationResult: jest.fn(() => {
      return {
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: "Invalid Field" }]),
      };
    }),
  };
});

//mock our custom module which is helper
jest.mock("../../utils/helpers", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

//Mock our custom module which is the UserModel Schema
//we do this so we can call the .toHaveBeenCalled() method from jest which requires a mock function
jest.mock("../../models/user_model");

const mockRequest = {
  findUserIndex: 1,
} as any;

//mock the functions used
//and call the mock function, we don't wanna call the actual function
const mockResponse = {
  //mock function sendStatus to do nothing basically like () => {}
  sendStatus: jest.fn(),
  send: jest.fn(),
  //we set status to return itself, so mockResponse will have access to other methods, if we don't do this we can't test for like res.status(400).send()
  status: jest.fn(() => mockResponse),
} as any;

describe("get users", () => {
  it("should get user by id", () => {
    getUserByIdHandler(mockRequest, mockResponse);
    //check if the mockResponse.send method was called with mockUser data from 1st index
    expect(mockResponse.send).toHaveBeenCalledWith(
      mockUsers[mockRequest.findUserIndex]
    );
    //check if the mockResponse.send method was called once
    //toHaveBeenCalledTimes, toHaveBeenCalledWith only works with mock function
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it("should call sendStatus with 404 when user not found", () => {
    //create a copy of the mock to have the exact copy of the setup mockRequest, but with the findUserIndex set to 100, to simulate a 404 not found
    const copyMockRequest = { ...mockRequest, findUserIndex: 100 };
    getUserByIdHandler(copyMockRequest, mockResponse);
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});

//When we are testing a function that has function that belongs to an external library. We don't really care about what the function does since we are mocking it anyways
//We just care about what it returns
//We only care about our own function and the cases it can have, not care about other external
describe("create users", () => {
  const mockRequest = {} as any;

  //without the mock it is actually calling the library
  it("should return status of 400 when there are errors", async () => {
    await createUserHandler(mockRequest, mockResponse);
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(validator.validationResult).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid Field" }],
    });
  });

  // const newUser = await UserModel.create({
  //   ...data,
  // });
  it("should return status of 201 and the user created", async () => {
    //change the empty in the mock module, because it is set to return false, and we need it to be true, to test this specific case
    //Hijack the isEmpty function from isEmpty function from the result of validationResult to return true
    jest
      .spyOn(validator, "validationResult")
      .mockImplementationOnce((): any => {
        return {
          isEmpty: jest.fn(() => true),
        };
      });

    //mock the function save from UserModel, with the default (){}
    const createMethod = jest.spyOn(UserModel, "create").mockReturnValueOnce({
      id: 1,
      username: "test123",
      password: "hashed_password",
      displayName: "test_name",
    } as any);

    await createUserHandler(mockRequest, mockResponse);
    expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
    expect(helpers.hashPassword).toHaveBeenCalledWith("password");
    //check if returned with the correct values
    expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
    //verify that the constructor is invoked
    // expect(UserModel).toHaveBeenCalledWith({
    //   username: "test123",
    //   password: "hashed_password",
    //   displayName: "test_name",
    // });
    expect(createMethod).toHaveBeenCalled();
    expect(createMethod).toHaveBeenCalledWith({
      username: "test123",
      password: "hashed_password",
      displayName: "test_name",
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: 1,
      username: "test123",
      password: "hashed_password",
      displayName: "test_name",
    });
  });

  it("should return status of 400 when create users throws an error", async () => {
    jest
      .spyOn(validator, "validationResult")
      .mockImplementationOnce((): any => {
        return {
          isEmpty: jest.fn(() => true),
        };
      });

    jest
      .spyOn(UserModel, "create")
      //because it is an async function, therefore we need to return a promise
      .mockImplementationOnce(() => Promise.reject("Failed to save user"));

    await createUserHandler(mockRequest, mockResponse);
    expect(UserModel.create).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });
});

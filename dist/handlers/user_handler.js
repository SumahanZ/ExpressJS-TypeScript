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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserHandler = exports.getUserByIdHandler = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = require("../models/user_model");
const constants_1 = require("../utils/constants");
const helpers_1 = require("../utils/helpers");
const getUserByIdHandler = (req, res) => {
    const { findUserIndex } = req;
    const findUser = constants_1.mockUsers[findUserIndex];
    if (!findUser) {
        return res.sendStatus(404);
    }
    return res.send(findUser);
};
exports.getUserByIdHandler = getUserByIdHandler;
const createUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    //if the result returns validation error
    if (!result.isEmpty()) {
        //send the error as a response in the form of JSON
        return res.status(400).send({ errors: result.array() });
    }
    //get data from request body that has been validated
    //if it enters here that means the body is validated
    const data = (0, express_validator_1.matchedData)(req);
    //hash password here
    data.password = yield (0, helpers_1.hashPassword)(data.password);
    try {
        const newUser = yield user_model_1.UserModel.create(Object.assign({}, data));
        return res.status(201).send(newUser);
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
});
exports.createUserHandler = createUserHandler;

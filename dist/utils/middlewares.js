"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveIndexByUserId = exports.loggingMiddlware2 = exports.loggingMiddlware = void 0;
const constants_1 = require("./constants");
//Order matters when defining middleware, define middlewares before the API, if not it will not have that middleware
//Registering a specific middleware globally
//You can put another middleware here as well
//app.use(loggingMiddlware, loggingMiddlware2);
const loggingMiddlware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
};
exports.loggingMiddlware = loggingMiddlware;
const loggingMiddlware2 = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
};
exports.loggingMiddlware2 = loggingMiddlware2;
//satifies keyword in typescript
const resolveIndexByUserId = (req, res, next) => {
    //We can't pass data from 1 middleware to another
    //But we can attach properties to the objects
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        return res.status(400).send({ msg: "Bad Request. Invalid ID" });
    }
    const findUserIndex = constants_1.mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) {
        return res.sendStatus(404);
    }
    req.findUserIndex = findUserIndex;
    //We can pass error here and it will throw in the route (app.get, etc)
    //next(new Error())
    next();
};
exports.resolveIndexByUserId = resolveIndexByUserId;

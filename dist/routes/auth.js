"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_schemas_1 = require("../utils/validation_schemas");
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const constants_1 = require("../utils/constants");
const router = (0, express_1.Router)();
//Manual authentication username and password
router.post("/auth", (0, express_validator_1.checkSchema)(validation_schemas_1.userAuthValidationSchema), (req, res) => {
    const { body: { username, password }, } = req;
    const findUser = constants_1.mockUsers.find((user) => user.username === username);
    if (!findUser || findUser.password !== password)
        return res.status(401).send({ msg: "Bad Credentials" });
    //We can attach dynamic data to a specific sessionData. This would allow the session to persist the sessionID of a specific client
    req.session.user = findUser;
    return res.status(200).send(findUser);
});
//Passport.js authentication username and password (local strategy)
router.post("/auth2", passport_1.default.authenticate("local"), (req, res) => {
    res.sendStatus(200);
});
router.get("/auth/status", (req, res) => {
    //remember sessionID is stored in the cookie
    //Each client has their own sessionData mapped by the sessionID stored in the cookie
    //by doing this it would allow the req.session to be identified based on the client
    //check is user is logged in/authenticated based if there is a user session object stored in the SessionStore
    req.sessionStore.get(req.sessionID, (error, sessionData) => {
        console.log(sessionData);
    });
    return req.session.user
        ? res.status(200).send(req.session.user)
        : //if the cookie is deleted then the request sessionID can't be mapped to the value, and therefore return status 401 with Not Authenticated
            res.status(401).send({ msg: "Not Authenticated" });
});
router.get("/auth/status2", (req, res) => {
    console.log("Inside /auth/status2 endpoint");
    console.log(req.user);
    return req.user ? res.send(req.user) : res.sendStatus(401);
});
router.post("/auth/logout", (req, res) => {
    if (!req.user)
        return res.sendStatus(401);
    //terminate the specific client session
    req.logout((err) => {
        if (err)
            return res.sendStatus(400);
        res.sendStatus(200);
    });
});
exports.default = router;

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
//For creating instance of Express Router
const express_1 = require("express");
const user_model_1 = require("../models/user_model");
const express_validator_1 = require("express-validator");
const validation_schemas_1 = require("../utils/validation_schemas");
const constants_1 = require("../utils/constants");
const middlewares_1 = require("../utils/middlewares");
//Its like a mini application and register request in the Router to group all your routes
//But then you need to register your router in the app...
const router = (0, express_1.Router)();
//Prefix all endpoint with /api/slash
//Query parameters
//example of query string ?key=value1&key2=value2
//These are used for example when client send a request to the server, we use query string to add information on how to filter the data, how to sort the data, etc.
//the req.query is not undefined if the route has a query parameter: /api/users?filter="kevin"&value="ke", and parsed into object format
router.get("/users", 
//this is a middleware implicitly
(0, express_validator_1.checkSchema)(validation_schemas_1.getUsersFilterValidationSchema), (req, res) => {
    //get the sessionData from the SessionStore of a specific client who sent the request
    console.log(req.session);
    console.log(req.session.id);
    //get the sessionData from the SessionStore of a specific client based on the passed session.id
    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {
            throw err;
        }
        console.log(sessionData);
    });
    //extract the validation error
    const result = (0, express_validator_1.validationResult)(req);
    const { filter, value } = req.query;
    //filter can only exist if value is also present
    if (filter && value) {
        return res.send(constants_1.mockUsers.filter((user) => 
        //this is because query parameters value are 100% going to be string, therefore we can typecast it
        user[filter].includes(value)));
    }
    //if there is only one query param and not the other or both are not present, it will just return the default mockUsers
    res.send(constants_1.mockUsers);
});
//POST Request
//We can reuse the route, if the HTTP method is different
//handle the validation of the req body passed by the user
router.post("/users", 
//VALIDATOR
//We can also use this validator to validate headers or cookies
//Seperate this validation requirement in a schema, to make it more clean
(0, express_validator_1.checkSchema)(validation_schemas_1.createUserValidationSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    //if the result returns validation error
    if (!result.isEmpty()) {
        //send the error as a response in the form of JSON
        return res.status(400).send({ errors: result.array() });
    }
    //get data from request body that has been validated
    //if it enters here that means the body is validated
    const data = (0, express_validator_1.matchedData)(req);
    try {
        const newUser = yield user_model_1.UserModel.create(Object.assign({}, data));
        return res.status(201).send(newUser);
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
}));
//PUT Request
//PATCH VS PUT
//PATCH ONLY UPDATING A PARTIAL (1/2/3 fields)
//PUT UPDATING THE WHOLE DATA (ALL FIELDS)
router.put("/users/:id", 
//pass middleware here
//this will be run after running all the global middleware like the express.json() middleware
middlewares_1.resolveIndexByUserId, (req, res) => {
    var _a, _b, _c;
    //we still have body here
    const { body, findUserIndex } = req;
    //remember when using PUT request we need to include the whole object and the fields, even if we are not including those fields, it will be overwritten/null/gone
    constants_1.mockUsers[findUserIndex] = {
        id: constants_1.mockUsers[findUserIndex].id,
        username: (_a = body === null || body === void 0 ? void 0 : body.username) !== null && _a !== void 0 ? _a : constants_1.mockUsers[findUserIndex].username,
        displayName: (_b = body === null || body === void 0 ? void 0 : body.displayName) !== null && _b !== void 0 ? _b : constants_1.mockUsers[findUserIndex].displayName,
        password: (_c = body === null || body === void 0 ? void 0 : body.password) !== null && _c !== void 0 ? _c : constants_1.mockUsers[findUserIndex].password,
    };
    return res.sendStatus(201);
});
//PATCH Request
router.patch("/users/:id", middlewares_1.resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    //Get the current value and unpack it and then the body paylod will also be unpacked, so the same fields, aka the one we pass from the body will override
    constants_1.mockUsers[findUserIndex] = Object.assign(Object.assign({}, constants_1.mockUsers[findUserIndex]), body);
    return res.sendStatus(200);
});
//DELETE Request
//You can post request body in DELETE, but typically, you are just deleting stuff and it is straightforward
router.delete("/users/:id", middlewares_1.resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    constants_1.mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});
//Route parameters
//3 edge cases are handled for when param is NaN, user with specific id not found, and when succeed
router.get("/users/:id", middlewares_1.resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    const findUser = constants_1.mockUsers[findUserIndex];
    if (!findUser) {
        return res.sendStatus(404);
    }
    return res.send(findUser);
});
exports.default = router;

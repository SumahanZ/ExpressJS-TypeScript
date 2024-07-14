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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_model_1 = require("../models/user_model");
//This function is only called when we are logging in/authenticating
//As soon as we modify the session object, it will send a cookie to the client and save the sessionID in that cookie
//when using password we need to serialize the req.user object attached from the local configuration and put it in sessionStore (req.session.passport.user)
passport_1.default.serializeUser((user, done) => {
    //you wanna pass in something that is unique
    //store the user.id in the sessionStore
    console.log("Inside Serialize User");
    console.log(user);
    //you dont wanna have store alot of information in your sessionData, it will take alot of memory
    //usually a unique identifier that doesnt change is used, because when u deserialize it and return to a request handler, there may be a data mismatch with the database
    done(null, user.id);
});
//This function is called when we are already logged in (have a sessionID/user unique identifier store in sessionStore) and do some stuff
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Inside Deserializer");
    //retrieve the data we passed into the sessionStore
    console.log(`Deserializing User Id: ${id}`);
    //search for the user in the array or database
    try {
        const findUser = yield user_model_1.UserModel.findById(id);
        if (!findUser)
            throw new Error("User not found");
        //reattach the user retrieved from database/array to the req.user object
        //this will enter the callback after the middleware
        done(null, findUser);
    }
    catch (err) {
        done(err, false);
    }
}));
//passport will automatically look for the username and password property passed from the req body
//and pass it as argument for the callback function
//If we dont use username and password, we can override it with another field
exports.default = passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    //for this instance we are not using a database, but we are using dummy data from an array
    try {
        const findUser = yield user_model_1.UserModel.findOne({
            username,
        });
        if (!findUser)
            throw new Error("User not found");
        if (findUser.password !== password)
            throw new Error("Bad Credentials");
        //this will enter the passport.serialize function
        done(null, findUser);
    }
    catch (err) {
        //throw an error
        done(err, false);
    }
})));

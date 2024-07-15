"use strict";
// GU47XD--aXhLLeX8qOsQqMxUlC42Z6GY
// 1262278641182703757
// http://localhost:3002/api/auth/discord/redirect
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
const passport_discord_1 = require("passport-discord");
const discord_user_model_1 = require("../models/discord_user_model");
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
//This function is called when we are already logged in (have a sessionID/user unique identifier store in sessionStore) and do some stuff
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Grab the sessionID from the cookie
        //Based on the sessionID grabed from cookie match the sessionID store in the SessionStore and then retrieve the session data from the SessionStore
        const findUser = yield discord_user_model_1.DiscordUserModel.findById(id);
        if (!findUser)
            throw new Error("User not found");
        done(null, findUser);
    }
    catch (err) {
        done(err, false);
    }
}));
exports.default = passport_1.default.use(new passport_discord_1.Strategy({
    //configure OAuth2 options to work with Discord
    //On production apps don't put hardcoded sensitive data
    clientID: "1262278641182703757",
    clientSecret: "GU47XD--aXhLLeX8qOsQqMxUlC42Z6GY",
    //Upon success call this endpoint redirect URL
    callbackURL: "http://localhost:3002/api/auth/discord/redirect",
    //Discord has this identify scope. Used to define the permissions to have, what field and information we want to access
    //Discord has many other scope used to access specific endpoints to get specific information
    scope: ["identify", "email", "guilds"],
}, 
//the profile is the user object returned
//Verify function
(accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    //REMINDER: Its not good to put code that can throw in a try catch
    //access token used to access the endpoints
    //refresh token used to refresh the short-lived access token
    let findUser;
    try {
        findUser = yield discord_user_model_1.DiscordUserModel.findOne({ discordId: profile.id });
    }
    catch (err) {
        return done(err, false);
    }
    try {
        if (!findUser) {
            //if not found, we create it in database
            const newUser = new discord_user_model_1.DiscordUserModel({
                username: profile.username,
                discordId: profile.id,
            });
            const newSavedUser = yield newUser.save();
            return done(null, newSavedUser);
        }
    }
    catch (err) {
        return done(err, false);
    }
    return done(null, findUser);
})));

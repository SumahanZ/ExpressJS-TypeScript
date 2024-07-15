"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_initializer_1 = __importDefault(require("./routes/route_initializer"));
const global_middlewares_initialzer_1 = __importDefault(require("./utils/global_middlewares_initialzer"));
//Alot of things that we are going to install to third party package into express are going to be middleware
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = __importDefault(require("mongoose"));
// import "./strategies/local_strategy_config";
require("./strategies/discord_strategy_config");
const connect_mongo_1 = __importDefault(require("connect-mongo"));
//We need to validate our request.bodies, what if we already did it from the client-side, well for starters the server does not know where the payload is being sent from
//So to avoid malicious request and for validating on the server side we can use a package called express-validator
//Create an express application using this command
const app = (0, express_1.default)();
mongoose_1.default
    .connect("mongodb://127.0.0.1:27017/express_tutorial")
    .then((value) => console.log("Connected to Database"))
    .catch((err) => console.log(`Error: ${err}`));
//Express doesnt't enable parser for request body for application/json by default, we need to tell it to do that
app.use(express_1.default.json());
//make sure to register the cookieParser before the routes, so it can parse the cookies, this is technically a global middleware
app.use((0, cookie_parser_1.default)("helloWorld"));
//setup the express-session global middleware
app.use((0, express_session_1.default)({
    //use something hard to decipher
    secret: "kevin the sander dev",
    //when client visit, if set true, it will save a SessionStore object even if you didnt't modify the sessionData (everytime you visit endpoint, its going to add another entry in the session collection)
    //Better to have it false or only set to the SessionStore when the session data changes
    //Could maybe be usefull when for example customer on guest mode and when they login wanna retrieve the cart and put in their account
    saveUninitialized: false,
    resave: false,
    //configure how long the cookie will live
    cookie: {
        //logged in for exactly 1 hour
        maxAge: 60000 * 60,
    },
    //setup session store, so the sessionData will not be stored in memory causing the problems of session being wiped automatically when server restart/down/etc
    //connect the session store with the database connection, depends on the database you are using
    //therefore the sessionData will be stored in MongoDB (Collection of sessions is created in MongoDB)
    store: connect_mongo_1.default.create({
        //refer to the current connected client of MongoDB
        //After connection, and setting up of session. req.session will be attached with the sessionData fetched from MongoDB
        client: mongoose_1.default.connection.getClient(),
    }),
}));
app.use(passport_1.default.initialize());
//this will take care of attaching a dynamic user property to the req object
//configure passport to work with session
app.use(passport_1.default.session());
app.use(global_middlewares_initialzer_1.default);
app.use(route_initializer_1.default);
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3002;
//Base endpoint
//Passing the middleware on a specific function
//If you don't call the next function, it will just be stuck or you can send request as well
//Route you must visit first to get the cookies to get the protected routes,etc
app.get("/", (req, res, next) => {
    //send a specific response from here if something doesnt match or just call next()
    next();
}, (req, res) => {
    //to parse cookies that are signed, you need to provide a secret
    //signed allows to hash the cookie value
    //Cookies are just small piece of data that server send to the client and store it with a temporary lifespan
    //The browser will store it, and then can send it to the server again, so the server can identify who this belongs to and send dynamic data, based on the cookie
    //HTTP is stateless, whenever we make request, server doesn't know who send the request
    console.log(req.session.id);
    //modify the session so the server can keep tabs on who this sessionid belongs to, if you don't do this then it will generate new sessionID everytime
    //The id is not gonna be generated every single time, they can look up the sessionID after the 1st request and attach the correct session data (property)
    req.session.visited = true;
    res.cookie("hello", "world", { maxAge: 60000, signed: true });
    res.status(201).send({ msg: "Hello" });
});
app.listen(PORT, () => {
    //Do something when startup
    console.log(`Server is running on http://localhost:${PORT}`);
});

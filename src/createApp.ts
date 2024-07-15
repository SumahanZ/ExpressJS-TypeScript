import express, { Request, Response, NextFunction, Express } from "express";
import routes from "./routes/route_initializer";
import globalMiddlewares from "./utils/global_middlewares_initialzer";
//Alot of things that we are going to install to third party package into express are going to be middleware
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import "./strategies/local_strategy_config";
// import "./strategies/discord_strategy_config";
import MongoStore from "connect-mongo";

//We need to validate our request.bodies, what if we already did it from the client-side, well for starters the server does not know where the payload is being sent from
//So to avoid malicious request and for validating on the server side we can use a package called express-validator
//Create an express application using this command
//Seperated into function here so we can pass the app instance into our e2e test
export function createApp(): Express {
  const app = express();

  //Express doesnt't enable parser for request body for application/json by default, we need to tell it to do that
  app.use(express.json());
  //make sure to register the cookieParser before the routes, so it can parse the cookies, this is technically a global middleware
  app.use(cookieParser("helloWorld"));
  //setup the express-session global middleware
  app.use(
    session({
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
      store: MongoStore.create({
        //refer to the current connected client of MongoDB
        //After connection, and setting up of session. req.session will be attached with the sessionData fetched from MongoDB
        client: mongoose.connection.getClient(),
      }),
    })
  );
  app.use(passport.initialize());
  //this will take care of attaching a dynamic user property to the req object
  //configure passport to work with session
  app.use(passport.session());
  app.use(globalMiddlewares);
  app.use(routes);

  //Base endpoint
  //Passing the middleware on a specific function
  //If you don't call the next function, it will just be stuck or you can send request as well
  //Route you must visit first to get the cookies to get the protected routes,etc
  app.get(
    "/",
    (req: Request, res: Response, next: NextFunction) => {
      //send a specific response from here if something doesnt match or just call next()
      next();
    },
    (req: Request, res: Response) => {
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
    }
  );

  return app;
}

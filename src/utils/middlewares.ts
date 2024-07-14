import { Request, Response, NextFunction } from "express";
import { mockUsers } from "./constants";
import { UserRequestParams } from "./interfaces";

//Order matters when defining middleware, define middlewares before the API, if not it will not have that middleware
//Registering a specific middleware globally
//You can put another middleware here as well
//app.use(loggingMiddlware, loggingMiddlware2);
export const loggingMiddlware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

export const loggingMiddlware2 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

//satifies keyword in typescript
export const resolveIndexByUserId = (
  req: Request<UserRequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  //We can't pass data from 1 middleware to another
  //But we can attach properties to the objects
  const { id } = req.params;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request. Invalid ID" });
  }

  const findUserIndex: number = mockUsers.findIndex(
    (user) => user.id === parsedId
  );

  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }

  req.findUserIndex = findUserIndex;
  //We can pass error here and it will throw in the route (app.get, etc)
  //next(new Error())
  next();
};

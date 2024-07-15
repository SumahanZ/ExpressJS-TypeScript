//For creating instance of Express Router
import { Router, Request, Response } from "express";
import { UserModel } from "../models/user_model";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  createUserValidationSchema,
  getUsersFilterValidationSchema,
} from "../utils/validation_schemas";
import {
  User,
  UserBodyParam,
  UserQueryParam,
  UserRequestParams,
} from "../utils/interfaces";
import { mockUsers } from "../utils/constants";
import { resolveIndexByUserId } from "../utils/middlewares";
import { hashPassword } from "../utils/helpers";
import {
  createUserHandler,
  getUserByIdHandler,
} from "../handlers/user_handler";

//Its like a mini application and register request in the Router to group all your routes
//But then you need to register your router in the app...
const router = Router();

//Prefix all endpoint with /api/slash
//Query parameters
//example of query string ?key=value1&key2=value2
//These are used for example when client send a request to the server, we use query string to add information on how to filter the data, how to sort the data, etc.
//the req.query is not undefined if the route has a query parameter: /api/users?filter="kevin"&value="ke", and parsed into object format
router.get(
  "/users",
  //this is a middleware implicitly
  checkSchema(getUsersFilterValidationSchema),
  (req: Request<{}, {}, {}, UserQueryParam>, res: Response) => {
    //get the sessionData from the SessionStore of a specific client who sent the request
    console.log(req.session);
    console.log(req.session.id);
    //get the sessionData from the SessionStore of a specific client based on the passed session.id
    //IN-MEMORY SESSION STORE
    //CONS: When server goes down, therefore the SessionStore and underlying sessions are wiped
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        throw err;
      }
      console.log(sessionData);
    });
    //extract the validation error
    const result = validationResult(req);
    const { filter, value } = req.query;
    //filter can only exist if value is also present
    if (filter && value) {
      return res.send(
        mockUsers.filter((user) =>
          //this is because query parameters value are 100% going to be string, therefore we can typecast it
          (user[filter as keyof User] as string).includes(value)
        )
      );
    }
    //if there is only one query param and not the other or both are not present, it will just return the default mockUsers
    res.send(mockUsers);
  }
);

//POST Request
//We can reuse the route, if the HTTP method is different
//handle the validation of the req body passed by the user
router.post(
  "/users",
  //VALIDATOR
  //We can also use this validator to validate headers or cookies
  //Seperate this validation requirement in a schema, to make it more clean
  checkSchema(createUserValidationSchema),
  createUserHandler
);

//PUT Request
//PATCH VS PUT
//PATCH ONLY UPDATING A PARTIAL (1/2/3 fields)
//PUT UPDATING THE WHOLE DATA (ALL FIELDS)
router.put(
  "/users/:id",
  //pass middleware here
  //this will be run after running all the global middleware like the express.json() middleware
  resolveIndexByUserId,
  (req: Request<UserRequestParams, {}, UserBodyParam>, res: Response) => {
    //we still have body here
    const { body, findUserIndex } = req;
    //remember when using PUT request we need to include the whole object and the fields, even if we are not including those fields, it will be overwritten/null/gone
    mockUsers[findUserIndex] = {
      id: mockUsers[findUserIndex].id,
      username: body?.username ?? mockUsers[findUserIndex].username,
      displayName: body?.displayName ?? mockUsers[findUserIndex].displayName,
      password: body?.password ?? mockUsers[findUserIndex].password,
    };
    return res.sendStatus(201);
  }
);

//PATCH Request
router.patch(
  "/users/:id",
  resolveIndexByUserId,
  (req: Request<UserRequestParams, {}, UserBodyParam>, res: Response) => {
    const { body, findUserIndex } = req;
    //Get the current value and unpack it and then the body paylod will also be unpacked, so the same fields, aka the one we pass from the body will override
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

    return res.sendStatus(200);
  }
);

//DELETE Request
//You can post request body in DELETE, but typically, you are just deleting stuff and it is straightforward
router.delete(
  "/users/:id",
  resolveIndexByUserId,
  (req: Request<UserRequestParams>, res: Response) => {
    const { findUserIndex } = req;

    mockUsers.splice(findUserIndex, 1);

    return res.sendStatus(200);
  }
);

//Route parameters
//3 edge cases are handled for when param is NaN, user with specific id not found, and when succeed
router.get("/users/:id", resolveIndexByUserId, getUserByIdHandler);

export default router;

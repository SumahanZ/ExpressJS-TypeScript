import { Router, Request, Response } from "express";
import { userAuthValidationSchema } from "../utils/validation_schemas";
import { checkSchema } from "express-validator";
import passport from "passport";
import { mockUsers } from "../utils/constants";

const router = Router();

//Manual authentication username and password
router.post(
  "/auth",
  checkSchema(userAuthValidationSchema),
  (req: Request, res: Response) => {
    const {
      body: { username, password },
    } = req;

    const findUser = mockUsers.find((user) => user.username === username);

    if (!findUser || findUser.password !== password)
      return res.status(401).send({ msg: "Bad Credentials" });
    //We can attach dynamic data to a specific sessionData. This would allow the session to persist the sessionID of a specific client
    req.session.user = findUser;
    return res.status(200).send(findUser);
  }
);

//Passport.js authentication username and password (local strategy)
router.post(
  "/auth2",
  passport.authenticate("local"),
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

router.get("/auth/status", (req: Request, res: Response) => {
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

router.get("/auth/status2", (req: Request, res: Response) => {
  console.log("Inside /auth/status2 endpoint");
  console.log(req.user);

  return req.user ? res.send(req.user) : res.sendStatus(401);
});

router.post("/auth/logout", (req: Request, res: Response) => {
  if (!req.user) return res.sendStatus(401);
  //terminate the specific client session
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  });
});

export default router;

import { validationResult, matchedData } from "express-validator";
import { UserModel } from "../models/user_model";
import { mockUsers } from "../utils/constants";
import { hashPassword } from "../utils/helpers";
import { User, UserRequestParams } from "../utils/interfaces";
import { Request, Response } from "express";

export const getUserByIdHandler = (
  req: Request<UserRequestParams>,
  res: Response
) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) {
    return res.sendStatus(404);
  }
  return res.send(findUser);
};

export const createUserHandler = async (req: Request, res: Response) => {
  const result = validationResult(req);
  //if the result returns validation error
  if (!result.isEmpty()) {
    //send the error as a response in the form of JSON
    return res.status(400).send({ errors: result.array() });
  }
  //get data from request body that has been validated
  //if it enters here that means the body is validated
  const data: Omit<User, "id"> = matchedData(req);
  //hash password here
  data.password = await hashPassword(data.password);

  try {
    const newUser = await UserModel.create({
      ...data,
    });

    return res.status(201).send(newUser);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

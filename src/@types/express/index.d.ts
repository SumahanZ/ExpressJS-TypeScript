import { Express } from "express";
// Adding type to the Request object to attach our own properties
declare global {
  namespace Express {
    interface Request {
      findUserIndex: number;
    }
  }
}

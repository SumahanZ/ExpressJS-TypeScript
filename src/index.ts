import mongoose from "mongoose";
import express, { Request, Response, NextFunction, Express } from "express";
import { createApp } from "./createApp";

mongoose
  .connect("mongodb://127.0.0.1:27017/express_tutorial")
  .then((value) => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

const app = createApp();

const PORT: number | string = process.env.PORT ?? 3002;

app.listen(PORT, () => {
  //Do something when startup
  console.log(`Server is running on http://localhost:${PORT}`);
});

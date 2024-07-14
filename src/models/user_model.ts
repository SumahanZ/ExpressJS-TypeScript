import mongoose from "mongoose";
import { User } from "../utils/interfaces";

const UserSchema: mongoose.Schema<Omit<User, "id">> = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  displayName: mongoose.Schema.Types.String,
  password: mongoose.Schema.Types.String,
});

export const UserModel = mongoose.model("User", UserSchema);

import mongoose from "mongoose";
import { User } from "../utils/interfaces";

export type DiscordUser = {
  username: string;
  discordId: string;
};

const DiscordUserSchema: mongoose.Schema<DiscordUser> = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  discordId: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
});

export const DiscordUserModel = mongoose.model(
  "DiscordUser",
  DiscordUserSchema
);

// GU47XD--aXhLLeX8qOsQqMxUlC42Z6GY
// 1262278641182703757
// http://localhost:3002/api/auth/discord/redirect

import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser, DiscordUserModel } from "../models/discord_user_model";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

//This function is called when we are already logged in (have a sessionID/user unique identifier store in sessionStore) and do some stuff
passport.deserializeUser(async (id, done) => {
  try {
    //Grab the sessionID from the cookie
    //Based on the sessionID grabed from cookie match the sessionID store in the SessionStore and then retrieve the session data from the SessionStore
    const findUser = await DiscordUserModel.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, false);
  }
});

export default passport.use(
  new Strategy(
    {
      //configure OAuth2 options to work with Discord
      //On production apps don't put hardcoded sensitive data
      clientID: "1262278641182703757",
      clientSecret: "GU47XD--aXhLLeX8qOsQqMxUlC42Z6GY",
      //Upon success call this endpoint redirect URL
      callbackURL: "http://localhost:3002/api/auth/discord/redirect",
      //Discord has this identify scope. Used to define the permissions to have, what field and information we want to access
      //Discord has many other scope used to access specific endpoints to get specific information
      scope: ["identify", "email", "guilds"],
    },
    //the profile is the user object returned
    //Verify function
    async (accessToken, refreshToken, profile, done) => {
      //REMINDER: Its not good to put code that can throw in a try catch
      //access token used to access the endpoints
      //refresh token used to refresh the short-lived access token
      let findUser;
      try {
        findUser = await DiscordUserModel.findOne({ discordId: profile.id });
      } catch (err) {
        return done(err, false);
      }

      try {
        if (!findUser) {
          //if not found, we create it in database
          const newUser = new DiscordUserModel({
            username: profile.username,
            discordId: profile.id,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
      } catch (err) {
        return done(err, false);
      }

      return done(null, findUser);
    }
  )
);

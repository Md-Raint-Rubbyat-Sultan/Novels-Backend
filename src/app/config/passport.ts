import passport from "passport";
import {
  Strategy as googleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as localStrategy } from "passport-local";
import bcrypt from "bcryptjs";

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExisted = await User.findOne({ email });

        if (!isUserExisted) {
          return done(null, false, { message: "User does not exist." });
        }

        if (!isUserExisted.isVarified) {
          return done(null, false, { message: "User is not verified yet." });
        }

        if (
          isUserExisted.isActive === IsActive.BLOCKED ||
          isUserExisted.isActive === IsActive.INACTIVE
        ) {
          return done(null, false, {
            message: `User is ${isUserExisted.isActive}.`,
          });
        }

        if (isUserExisted.isDeleted) {
          return done(null, false, { message: "User is deleted." });
        }

        const userAuthenticated = isUserExisted.auth.some(
          (userProvider) => userProvider.provider === "google"
        );

        if (userAuthenticated && !isUserExisted.password) {
          return done(null, false, {
            message:
              "This email is already authenticaed with google sign in. If you want to use it with password authentication, then login with google and the set a password to login with email password.",
          });
        }

        const isCorrectPassword = await bcrypt.compare(
          password as string,
          isUserExisted.password as string
        );

        if (!isCorrectPassword) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, isUserExisted);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.use(
  new googleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "Email not found." });
        }

        let user = await User.findOne({ email });

        if (
          user &&
          (user.isActive === IsActive.BLOCKED ||
            user.isActive === IsActive.INACTIVE)
        ) {
          return done(null, false, {
            message: `User is ${user.isActive}.`,
          });
        }

        if (user && user.isDeleted) {
          return done(null, false, { message: "User is deleted." });
        }

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            isVarified: true,
            auth: [{ provider: "google", providerId: profile.id }],
            role: Role.USER,
          });
        }

        if (
          user &&
          !user.auth.some((provider) => provider.provider === "google")
        ) {
          user.auth = [
            ...user.auth,
            { provider: "google", providerId: profile.id },
          ];
        }

        if (user && !user.picture) {
          user.picture = profile.photos?.[0].value;
        }

        user.save();

        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(
  async (
    id: unknown,
    done: (err: any, user?: Express.User | false | null) => void
  ) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
);

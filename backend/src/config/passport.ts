import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { oauthVerify } from '../controllers/authController';

export const initializePassport = () => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const facebookAppId = process.env.FACEBOOK_APP_ID;
  const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  if (googleClientId && googleClientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: googleClientId,
          clientSecret: googleClientSecret,
          callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
          scope: ['profile', 'email'],
        },
        async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
          try {
            const user = await oauthVerify(profile, 'google');
            return done(null, user);
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );
  }

  if (facebookAppId && facebookAppSecret) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: facebookAppId,
          clientSecret: facebookAppSecret,
          callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
          profileFields: ['id', 'emails', 'name', 'displayName'],
        },
        async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
          try {
            const user = await oauthVerify(profile, 'facebook');
            return done(null, user);
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );
  }

  passport.serializeUser((user: any, done: any) => done(null, user));
  passport.deserializeUser((obj: any, done: any) => done(null, obj));
};

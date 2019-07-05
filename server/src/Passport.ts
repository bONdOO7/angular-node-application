import * as bcrypt from 'bcrypt-nodejs';
import { Passport } from 'passport';
import { Strategy } from 'passport-local';
import UserRepository from './repository/UserRepository';
const config = require('../../config.json');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const userRepository = new UserRepository();

export = (passport: Passport) => {
  /**
   * passport session setup
   */
  
  // used to serialize the user for the session
  passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
  });
  
  // used to deserialize the user
  passport.deserializeUser((id: any, done: any) => {
    try {
      userRepository.findOneById(id, (result: any) => {
        done(null, result);
      });
    } catch (err) {
      return done(err);
    }
  });

  /** Google Auth Stratagy */
  passport.use(new GoogleStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret,
    callbackURL: '/api/auth/google/callback',
  }, (accessToken: any, refreshToken: any, profile: any, done: any) => {
    console.log('profile >> ', profile);
    const email = profile.emails[0].value;
    const status = profile.emails[0].verified;
    console.log(email, status);
    passport.authenticate('google-signup');
  }));

  /**
   * Google Sign Up
   */

  passport.use('google-signup',
    new Strategy({
    usernameField: 'username',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },(req: any, username: string, done: any) =>{
    try {
      userRepository.findOneByUsername(username, (result: any) => {
        if (!result) {
          // if there is no user with that username, create the user
          const newUser = {
            id: 0,
            username,
            password: ''
          };
          userRepository.createOne(newUser, (result: any) => {
            newUser.id = result.user_id;
            done(null, newUser);
          });
        }
      });
    } catch (err) {
      return done(err);
    }
    try {
      userRepository.findOneByUsername(username, (result: any) => {
        if (result) {
          // if the user is found but the password is wrong
          return done(null, result);
        } else {
          return done(null, false, {message: 'User name or password is wrong'});
        }
      });
    } catch (err) {
      return done(err);
    }
  }));
  
  /** 
   * LOCAL SIGNUP
   */
  
  passport.use('local-signup',
    new Strategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      (req: any, username: string, password: string, done: any) => {
        try {
          userRepository.findOneByUsername(username, (result: any) => {
            if (result) {
              return done(false, {message: 'This username is already taken.'});
            } else {
              // if there is no user with that username, create the user
              const newUser = {
                id: 0,
                username,
                password: bcrypt.hashSync(password, null)
              };
              userRepository.createOne(newUser, (result: any) => {
                newUser.id = result.user_id;
                done(null, newUser);
              });
              return done;
            }
          });
        } catch (err) {
          return done(err);
        }
      })
  );
  
  /** 
   * LOCAL LOGIN 
   */
  
  passport.use('local-login',
    new Strategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      (req: any, username: string, password: string, done: any) => { // callback with email and password from our form
        try {
          userRepository.findOneByUsername(username, (result: any) => {
            if (result) {
              // if the user is found but the password is wrong
              if (!bcrypt.compareSync(password, result.password)) {
                return done(null, false, {message: 'User name or password is wrong'});
              } else {
                // all is well, return successful user
                return done(null, result);
              }
            } else {
              return done(null, false, {message: 'User name or password is wrong'});
            }
          });
        } catch (err) {
          return done(err);
        }
      })
  );
};

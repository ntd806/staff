const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const UserService = require('../service/user/UserService');
const {User} = require('../models');
passport.use(
    new JWTstrategy(
      {
        secretOrKey: 'TOP_SECRET',
        jwtFromRequest: ExtractJWT.fromHeader('secret_token')
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

passport.use(
    'signup',
    new localStrategy(
      {
        usernameField: 'email',
        pwField: 'password'
      },
      async (email, password, done) => {
        try {
            const user = await UserService.signUp({ email, password });
  
          return done(null, user);
        } catch (error) {

          done(error);
        }
      }
    )
  );


passport.use(
    'login',
    new localStrategy(
      {
        usernameField: 'email',
        pwField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email })

          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
          const validate = await UserService.isValidPassword({user, password});
          console.log(validate);
  
          if (!validate) {
            return done(null, false, { message: 'Wrong password' });
          }
  
          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
  );
import passport from 'passport';
import passportLocal from 'passport-local';
import passportjwt from 'passport-jwt';
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens

const JwtStrategy = passportjwt.Strategy;
const ExtractJwt = passportjwt.ExtractJwt;
const models = require('../db/models');

const { SESSION_SECRET } = process.env;
const getToken = function (user: any) {
  return jwt.sign(user, SESSION_SECRET, { expiresIn: 3600 });
};

const verifyUser = passport.authenticate('jwt', { session: false });

export default {
  getToken,
  verifyUser,
};

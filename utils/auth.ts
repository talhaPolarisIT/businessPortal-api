import passport from 'passport';
import passportLocal from 'passport-local';
import passportjwt from 'passport-jwt';
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens

const JwtStrategy = passportjwt.Strategy;
const ExtractJwt = passportjwt.ExtractJwt;
const models = require('../db/models');

export const secretKey = '12345-67890-09876-54321';

const getToken = function (user: any) {
  return jwt.sign(user, secretKey, { expiresIn: 3600 });
};


const verifyUser = passport.authenticate('jwt', { session: false });

export default {
  getToken,
  verifyUser,
};

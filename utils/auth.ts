import passport from 'passport';
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens

const { SESSION_SECRET } = process.env;
const getToken = function (user: any) {
  return jwt.sign(user, SESSION_SECRET, { expiresIn: 3600 });
};

const verifyUser = passport.authenticate('jwt', { session: false });

export default {
  getToken,
  verifyUser,
};

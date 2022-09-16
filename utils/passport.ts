import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import { UserDetails } from '../controllers/user';
import passportjwt from 'passport-jwt';

const JwtStrategy = passportjwt.Strategy;
const ExtractJwt = passportjwt.ExtractJwt;

const models = require('../db/models');

const { SESSION_SECRET } = process.env;

passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user);
});

passport.deserializeUser(async (user: UserDetails, done) => {
  const existing = await models.user.findOne({ where: { id: user.id } });
  done(!existing ? { message: 'User not found.' } : null, existing);
});

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SESSION_SECRET,
};

passport.use(
  new passportLocal.Strategy(async (email, password, done) => {
    const user = await models.user.findOne({ where: { email } });
    if (!user) return done(null, false, { message: 'User not found.' });
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return done(null, false, { message: 'Incorect password.' });

    return done(
      null,
      {
       ...user.dataValues,
      },
      { message: 'Login successful.' }
    );
  })
);

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log('JWT payload: ', jwt_payload);
    try {
      const User = await models.user.findOne({ where: { id: jwt_payload.id } });
      console.log('User: ', User);

      return done(null, User, { message: 'User found.' });
    } catch (error) {
      return done(null, false, { message: 'User not found.' });
    }
  })
);
export default passport;

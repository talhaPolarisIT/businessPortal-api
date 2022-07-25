import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcryptjs';
import { UserDetails } from '../controllers/user';

const models = require('../database/models');

passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user);
});

passport.deserializeUser(async (user: UserDetails, done) => {
  const existing = await models.user.findOne({ where: { id: user.id } });
  done(!existing ? { message: 'User not found.' } : null, existing);
});

passport.use(new passportLocal.Strategy({
  usernameField: 'email',
  passwordField: 'pwd',
}, async (email, pwd, done) => {
  const user = await models.user.findOne({ where: { email } });
  if (!user) return done(null, false, { message: 'User not found.' });
  const validPassword = bcrypt.compareSync(pwd, user.password);
  if (!validPassword) return done(null, false, { message: 'Incorect password.' });

  return done(null, {
    id: user.id,
    name: user.name,
    email: user.email,
    inDarkMode: user.inDarkMode,
  }, { message: 'User logged in.' });
}));

export default passport;
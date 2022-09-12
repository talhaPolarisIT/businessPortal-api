import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { IVerifyOptions } from 'passport-local';

import passport from '../utils/passport';
import auth from '../utils/auth';
import logger from '../utils/logger';
import { ILocalUserRequest } from '../interceptors/localUserCheck';

const SALT_ROUNDS = 10;

export interface UserDetails {
  id: number;
  email: string;
  name: string;
}

export default () => {
  const models = require('../db/models');
  const { user: User, userGroup } = models;

  return {
    getAllUsers: async (req: Request, res: Response) => {
      try {
        const users = await User.findAll({ include: userGroup });
        res.status(200).json({ message: 'Users retrived.', users });
      } catch (error) {
        res.status(500).json({ message: 'Users retrived.', error: error.message });
      }
    },
    register: async (req: Request, res: Response) => {
      const { name, email, password, country, userGroupId, isCheckReq, isPasswordUpdated } = req.body;
      try {
        const existing = await User.findOne({ where: { email } });
        if (existing) {
          res.status(403).json({ message: 'User with email already exists.' });
          return;
        }
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));
        const user = await User.create({ name, email, password: hash, country, userGroupId, isCheckReq, isPasswordUpdated });
        res.status(201).json({ message: 'User created.', user });
      } catch (e: any) {
        logger.error(e.message);
        res.status(500).json({ message: 'Server error.', e: e.message });
      }
    },
    login: (req: Request, res: Response) => {
      passport.authenticate('local', (err: Error, user: UserDetails, info: IVerifyOptions) => {
        if (err) res.status(500).json({ message: err.message });
        else if (!user) res.status(403).json({ message: info.message });
        else {
          req.logIn(user, (err) => {
            if (err) res.status(500).json({ message: 'Could not create session.' });
            else {
              const accessToken = auth.getToken(user);
              res.status(200).json({ accessToken, message: info.message });
            }
          });
        }
      })(req, res);
    },
    getUser: async (req: ILocalUserRequest, res: Response) => {
      const { userId } = req.params;
      if (req.localUser.id === userId) {
        res.status(200).json({ message: 'User retrieved.', user: req.localUser });
      } else {
        res.status(403).json({ message: 'Unauthorized request.' });
      }
    },

    updateUser: async (req: ILocalUserRequest, res: Response) => {
      const { userId } = req.params;
      if (req.localUser.id === parseInt(userId)) {
        try {
          const { name, email, inDarkMode, emailVerified, mobile, recoveryEmail } = req.body;
          await User.update({ name, email, inDarkMode, emailVerified, mobile, recoveryEmail }, { where: { id: userId } });
          const user = await User.findOne({ where: { id: userId } });
          res.status(200).json({ message: 'User updated.', user });
        } catch (e: any) {
          logger.error(e.message);
          res.status(500).json({ message: 'Server error occurred.', e: e.message });
        }
      } else {
        res.status(403).json({ message: 'Unauthorized request.' });
      }
    },
  };
};

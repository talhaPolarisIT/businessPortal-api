import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { IVerifyOptions } from 'passport-local';

import passport from '../utils/passport';
import auth from '../utils/auth';
import logger from '../utils/logger';
import { ILocalUserRequest } from '../interceptors/localUserCheck';
import EmailService from '../utils/email';

const SALT_ROUNDS = 10;

export interface UserDetails {
  id: number;
  email: string;
  name: string;
}

export interface IVerifyAccountRequest extends Request {
  body: {
    code: number;
    email: string;
  };
}

export interface IUpdatePasswordRequest extends Request {
  body: {
    password: string;
    email: string;
  };
}

export interface ISendVerificationCodeRequest extends Request {
  body: {
    email: string;
  };
}

export interface IRestPasswordRequest extends Request {
  body: {
    email: string;
  };
}

export const MIN_CODE = 111111;
export const MAX_CODE = 999999;

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
        EmailService.sendLoginInvitation(email, { password, link: 'http://localhost:3000/login' });
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
              const accessToken = auth.getToken({ id: user.id, email: user.email, name: user.name });
              res.status(200).json({ user, accessToken, message: info.message });
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
    updateUser: async (req: Request, res: Response) => {
      const { userId } = req.params;
      if (parseInt(userId)) {
        try {
          if (req.body.password) {
            const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_ROUNDS));
            req.body.password = hash;
          }
          const { name, password, email, isActive, isPasswordUpdated, isCheckReq, verificationCode } = req.body;
          await User.update({ name, password, email, isActive, isPasswordUpdated, isCheckReq, verificationCode }, { where: { id: userId } });
          const user = await User.findOne({ where: { id: userId }, include: userGroup });
          res.status(200).json({ message: 'User updated.', user });
        } catch (e: any) {
          logger.error(e.message);
          res.status(500).json({ message: 'Server error occurred.', e: e.message });
        }
      } else {
        res.status(403).json({ message: 'Unauthorized request.' });
      }
    }, validate: async (req: ILocalUserRequest, res: Response) => {
      if (req.user)
        res.status(200).json({
          message: 'Session validated.',
          user: req.localUser,
          isAuthenticated: true,
        });
      else res.status(403).json({ message: 'Invalid session.' });
    },
    updatePassword: async (req: IUpdatePasswordRequest, res: Response) => {
      try {
        const { password, email } = req.body;
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));
        await User.update({ password: hash, email, isPasswordUpdated: true }, { where: { email } });
        const user = await User.findOne({ where: { email }, include: userGroup });
        const accessToken = auth.getToken({ id: user.id, email: user.email, name: user.name });
        res.status(200).json({ message: 'Password updated.', user, accessToken });
      } catch (e: any) {
        logger.error(e.message);
        res.status(500).json({ message: 'Server error occurred.', e: e.message });
      }
    },
    resetPassword: async (req: IRestPasswordRequest, res: Response) => {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: 'User not found.' });
      EmailService.sendRestPassword(email);
      res.status(200).json({ message: `Email verified. ${email}.` });
    },
    verifyAccount: async (req: IVerifyAccountRequest, res: Response) => {
      const { email, code } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: 'User not found.' });
      if (user.verificationCode === code) {
        try {
          res.status(200).json({ message: 'Email verified.' });
        } catch (e) {
          res.status(500).json({ message: 'Server error.' });
        }
      } else {
        res.status(403).json({ message: 'Incorrect code.' });
      }
    },
    sendVerificationCode: async (req: ISendVerificationCodeRequest, res: Response) => {
      const { email } = req.body;
      const code = Math.floor(Math.random() * (MAX_CODE - MIN_CODE)) + MIN_CODE;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: 'User not found.' });
      await User.update({ verificationCode: code }, { where: { id: user.id } });
      EmailService.sendVerificationCode(email, code);
      res.status(200).json({ message: `Verification code sent to ${email}.` });
    },
  };
};

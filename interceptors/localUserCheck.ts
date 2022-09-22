import { Request, Response, NextFunction } from 'express';

import { IAuth0MiddlewareRequest } from '../interfaces/common';

export interface ILocalUserRequest extends Request {
  localUser: any;
}

const models = require('../db/models');

export default async (req: IAuth0MiddlewareRequest, res: Response, next: NextFunction) => {
  const { user: User } = models;
  const user = await User.findOne({ where: { id: req.user.id }, include: [{ all: true }] });
  if (!user) return res.status(403).json({ message: 'Registration process not complete.' });
  req.localUser = user;
  next();
};

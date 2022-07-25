import { Request, Response } from 'express';

export interface IAuth0User {
  iss: string;
  sub: string;
  aud: string[],
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  gty: string;
};

export interface IAuth0MiddlewareRequest extends Request {
  user: IAuth0User;
  localUser?: any;
}
import http from 'http';
import express, { Express, Request, Response, NextFunction } from 'express';
// import helmet from "helmet";
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';

import { getRoutes } from './routes';

import logger from './utils/logger';

dotenv.config();
const main = async () => {
  const NAMESPACE = 'Server';
  const router: Express = express();

  const { PORT, SESSION_SECRET } = process.env;
  const port: number = PORT ? parseInt(PORT) : 8080;
  router.use(
    cors({
      origin: '*',
    })
  );
  // router.use(helmet());
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  router.use(passport.initialize()) 
  
  /** Log the request */
  router.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the req */
    logger.info(`${NAMESPACE}: METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
      /** Log the res */
      logger.info(`${NAMESPACE}: METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
  });

  router.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({ message: 'Method not allowed.' });
    }

    next();
  });

  /** Routes go here */
  router.use('/', getRoutes());

  /** Error handling */
  router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Not found.');

    res.status(404).json({
      message: error.message,
    });
  });

  const httpServer = http.createServer(router);

  httpServer.listen(port, () => logger.info(`${NAMESPACE}: Running on ${port}`));
};
main();

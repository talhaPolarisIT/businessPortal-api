import express, { Request, Response } from 'express';
import localUserCheck from '../interceptors/localUserCheck';

import user from '../controllers/user';
import entity from '../controllers/entity';

export const getRoutes = () => {
  const router = express();
  const model = require('../db/models');

  const userController = user();
  const entityController = entity();

  router.post('/user/register', userController.register);
  router.post('/user/login', userController.login);

  router.post('/entity', entityController.createEntity);
  router.get('/entity', entityController.getEntities);
  router.get('/entity/:entityId', entityController.getEntityById);
  router.put('/entity/:entityId', entityController.updateEntity);
  router.delete('/entity/:entityId', entityController.deleteEntity);

  return router;
};

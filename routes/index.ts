import express, { Request, Response } from 'express';
import localUserCheck from '../interceptors/localUserCheck';
import Passport from 'passport';

import user from '../controllers/user';
import entity from '../controllers/entity';
import userGroup from '../controllers/userGroup';
import auth from '../utils/auth';

export const getRoutes = () => {
  const router = express();

  const userController = user();
  const entityController = entity();
  const userGroupController = userGroup();

  /*Auth */
  router.post('/user/register', userController.register);
  router.post('/user/login', userController.login);

  /* Users */
  router.get('/users', userController.getAllUsers);

  /*User Group */
  router.get('/usergroup', userGroupController.getUserGroups);
  router.post('/usergroup', userGroupController.createUserGroups);
  router.put('/usergroup/:userGroupId', userGroupController.updateUserGroups);
  router.delete('/usergroup/:userGroupId', userGroupController.deleteUserGroups);

  /*Entity */
  router.post('/entity', entityController.createEntity);
  router.get('/entity', entityController.getEntities);
  router.get('/entity/:entityName', entityController.getEntityByName);
  router.get('/entity/:entityId', entityController.getEntityById);
  router.put('/entity/:entityName', entityController.updateEntity);
  router.delete('/entity/:entityId', entityController.deleteEntity);

  /*Entity Records */
  router.post('/entity/:entityName/record', entityController.addRecord);
  router.put('/entity/:entityName/record/:recordId', entityController.updateRecord);
  router.delete('/entity/:entityName/record/:recordId', entityController.deleteRecord);

  return router;
};

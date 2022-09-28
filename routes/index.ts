import express, { Request, Response } from 'express';
import localUserCheck from '../interceptors/localUserCheck';
import Passport from 'passport';

import user from '../controllers/user';
import entity from '../controllers/entity';
import userGroup from '../controllers/userGroup';
import auth from '../utils/auth';
import systemAdminCheck from '../interceptors/systemAdminCheck';

export const getRoutes = () => {
  const router = express();

  const userController = user();
  const entityController = entity();
  const userGroupController = userGroup();

  /*Auth */
  router.post('/auth/register', userController.register);
  router.post('/auth/login', userController.login);
  router.get('/auth/validate', auth.verifyUser, userController.validate);
  router.post('/auth/send_verification_code', userController.sendVerificationCode);
  router.post('/auth/verify_account', userController.verifyAccount);
  router.post('/auth/rest_password', userController.resetPassword);
  router.post('/auth/update_password', userController.updatePassword);

  /* Users */
  router.get('/user', userController.getAllUsers);
  router.put('/user/:userId', userController.updateUser);

  /*User Group */
  router.get('/usergroup', auth.verifyUser, userGroupController.getUserGroups);
  router.post('/usergroup', auth.verifyUser, userGroupController.createUserGroups);
  router.put('/usergroup/:userGroupId', auth.verifyUser, userGroupController.updateUserGroups);
  router.delete('/usergroup/:userGroupId', auth.verifyUser, userGroupController.deleteUserGroups);

  /*Entity */
  router.post('/entity', auth.verifyUser, localUserCheck, systemAdminCheck, entityController.createEntity);
  router.get('/entity', auth.verifyUser, localUserCheck, entityController.getEntities);
  router.get('/entity/:entityName', auth.verifyUser, localUserCheck, entityController.getEntityByName);
  router.get('/entity/:entityId', auth.verifyUser, localUserCheck, entityController.getEntityById);
  router.put('/entity/:entityName', auth.verifyUser, localUserCheck, entityController.updateEntity);
  router.delete('/entity/:entityId', auth.verifyUser, localUserCheck, entityController.deleteEntity);

  /*Entity Records */
  router.post('/entity/:entityName/record', auth.verifyUser, localUserCheck, entityController.addRecord);
  router.put('/entity/:entityName/record/:recordId', auth.verifyUser, localUserCheck, entityController.updateRecord);
  router.delete('/entity/:entityName/record/:recordId', auth.verifyUser, localUserCheck, entityController.deleteRecord);

  return router;
};

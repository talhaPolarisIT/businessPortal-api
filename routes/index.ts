import express, { Request, Response } from 'express';
import localUserCheck from '../interceptors/localUserCheck';

import user from '../controllers/user';

export const getRoutes=()=>{
    const router = express();
    const model = require('../database/models')
    
    const userController = user();


    router.post('/user/register', userController.register);
    router.post('/user/login', userController.login);
    return router;
}
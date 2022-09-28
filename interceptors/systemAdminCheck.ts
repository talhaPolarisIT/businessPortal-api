import { Response, NextFunction } from 'express';

import { USER_GROUP_MAP } from '../constants/userGroupsMap';
import { ILocalUserRequest } from './localUserCheck';

const systemAdminCheck = (req: ILocalUserRequest, res: Response, next: NextFunction) => {
  if (req.localUser.userGroupCodes.includes(USER_GROUP_MAP.SYSTEM_ADMIN)) {
    next();
  } else res.status(403).json({ message: 'Not authorized.' });
};

export default systemAdminCheck;

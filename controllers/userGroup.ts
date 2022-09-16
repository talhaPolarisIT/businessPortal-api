import { Request, Response } from 'express';

export default () => {
  const models = require('../db/models');
  const { userGroup: UserGroupModel, user: UserModel } = models;

  return {
    getUserGroups: async (req: Request, res: Response) => {
      try {
        const userGroups = await UserGroupModel.findAll({ include: UserModel });
        res.status(200).json({ message: 'getUserGroups', userGroups });
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
      }
    },

    createUserGroups: async (req: Request, res: Response) => {
      try {
        const { name, code, isActive } = req.body;
        if (!name || !code) {
          res.status(403).json({ message: 'Name and code is required for user group.' });
          return;
        }
        const created = await UserGroupModel.create({
          name,
          code,
          isActive,
        });
        res.status(201).json({ message: 'user group created.', created });
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
      }
    },

    updateUserGroups: async (req: Request, res: Response) => {
      const { userGroupId: id } = req.params;
      try {
        const { name, isActive } = req.body;
        const userGroups = await UserGroupModel.findOne({ where: { id } });
        if (!userGroups) res.status(404).json({ message: 'User group does not exist.' });
        else {
          const updated = await UserGroupModel.update(
            {
              name,
              isActive,
            },
            { where: { id } }
          );
          res.status(200).json({ message: 'user group updated.', updated });
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
      }
    },

    deleteUserGroups: async (req: Request, res: Response) => {
      const { userGroupId: id } = req.params;
      try {
        const userGroup = await UserGroupModel.findOne({ where: { id } });
        if (!userGroup) res.status(404).json({ message: 'User group does not exist.' });
        else {
          const deleted = await UserGroupModel.destroy({ where: { id } });
          res.status(200).json({ message: `${userGroup.name} Deleted` });
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
  };
};
